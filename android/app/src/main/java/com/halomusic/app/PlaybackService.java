package com.halomusic.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.AudioManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.webkit.WebView;
import androidx.core.app.NotificationCompat;
import androidx.media.app.NotificationCompat.MediaStyle;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 前台媒体服务：让 WebView 里的音频在 Activity 退到后台后继续播放，
 * 并提供通知栏/锁屏控制、音频焦点与拔耳机暂停。
 * 播放本体始终在网页的 <audio> 元素里；本服务只负责保活、呈现与遥控。
 */
public class PlaybackService extends Service {
  private static final String CHANNEL_ID = "halo_playback";
  private static final int NOTIFICATION_ID = 42;
  private static final long TICK_INTERVAL_MS = 1000;

  static final String ACTION_UPDATE = "com.halomusic.app.action.UPDATE";
  static final String ACTION_PLAY = "com.halomusic.app.action.PLAY";
  static final String ACTION_PAUSE = "com.halomusic.app.action.PAUSE";
  static final String ACTION_NEXT = "com.halomusic.app.action.NEXT";
  static final String ACTION_PREV = "com.halomusic.app.action.PREV";
  static final String ACTION_STOP = "com.halomusic.app.action.STOP";

  // 网页端经 JS 桥写入、服务在主线程轮询读取的播放状态（同进程共享）。
  private static volatile boolean webPlaying = false;
  private static volatile String webTitle = "";
  private static volatile String webArtist = "";
  private static volatile String webAlbum = "";
  private static volatile String webCover = "";
  private static volatile double webPosition = 0;
  private static volatile double webDuration = 0;

  private static PlaybackService instance;

  private MediaSessionCompat mediaSession;
  private AudioManager audioManager;
  private final Handler mainHandler = new Handler(Looper.getMainLooper());
  private final ExecutorService coverExecutor = Executors.newSingleThreadExecutor();
  private BroadcastReceiver noisyReceiver;
  private AudioManager.OnAudioFocusChangeListener focusListener;
  private Runnable tickRunnable;
  private boolean foregroundStarted;
  private boolean focusHeld;
  private boolean lastRenderedPlaying;
  private String lastRenderedTitle = "";
  private String lastRenderedArtist = "";
  private String loadedCoverUrl = "";
  private Bitmap coverBitmap;

  @Override
  public void onCreate() {
    super.onCreate();
    instance = this;
    audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
    createNotificationChannel();

    mediaSession = new MediaSessionCompat(this, "HaloMusicPlayback");
    mediaSession.setCallback(new MediaSessionCompat.Callback() {
      @Override
      public void onPlay() {
        dispatchToWebView("play");
      }

      @Override
      public void onPause() {
        dispatchToWebView("pause");
      }

      @Override
      public void onSkipToNext() {
        dispatchToWebView("next");
      }

      @Override
      public void onSkipToPrevious() {
        dispatchToWebView("prev");
      }
    });
    mediaSession.setActive(true);

    focusListener = focusChange -> {
      if (focusChange == AudioManager.AUDIOFOCUS_LOSS
          || focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT
          || focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK) {
        // 失焦只暂停、不自动恢复，避免其他应用让完广告后突然出声。
        dispatchToWebView("pause");
      }
    };

    noisyReceiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        dispatchToWebView("pause");
      }
    };
    registerReceiver(noisyReceiver, new IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY));

    tickRunnable = new Runnable() {
      @Override
      public void run() {
        syncWithWebState();
        mainHandler.postDelayed(this, TICK_INTERVAL_MS);
      }
    };
    mainHandler.post(tickRunnable);
  }

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    String action = intent != null ? intent.getAction() : null;
    if (ACTION_STOP.equals(action)) {
      stopPlaybackService();
      return START_NOT_STICKY;
    }
    if (ACTION_PLAY.equals(action)) dispatchToWebView("play");
    else if (ACTION_PAUSE.equals(action)) dispatchToWebView("pause");
    else if (ACTION_NEXT.equals(action)) dispatchToWebView("next");
    else if (ACTION_PREV.equals(action)) dispatchToWebView("prev");
    syncWithWebState();
    return START_NOT_STICKY;
  }

  @Override
  public void onTaskRemoved(Intent rootIntent) {
    // 用户从最近任务划掉应用：媒体类应用保持继续播放，通知栏仍可控制。
    super.onTaskRemoved(rootIntent);
  }

  @Override
  public void onDestroy() {
    instance = null;
    cleanup();
    super.onDestroy();
  }

  @Override
  public IBinder onBind(Intent intent) {
    return null;
  }

  /** 供网页 JS 桥（任意线程）写入最新播放状态。 */
  static void updateWebState(boolean playing, String title, String artist, String album, String cover,
                             double position, double duration) {
    webPlaying = playing;
    webTitle = title == null ? "" : title;
    webArtist = artist == null ? "" : artist;
    webAlbum = album == null ? "" : album;
    webCover = cover == null ? "" : cover;
    webPosition = position;
    webDuration = duration;
  }

  /** 服务未运行时启动它；已在运行则立即同步一次状态。 */
  static void ensureStarted(Context context) {
    if (instance != null) {
      instance.mainHandler.post(instance::syncWithWebState);
      return;
    }
    try {
      Intent intent = new Intent(context, PlaybackService.class).setAction(ACTION_UPDATE);
      if (Build.VERSION.SDK_INT >= 26) context.startForegroundService(intent);
      else context.startService(intent);
    } catch (Exception error) {
      // 系统限制后台启动前台服务时静默降级：播放继续，只是没有通知栏控制。
    }
  }

  private void syncWithWebState() {
    if (!foregroundStarted) {
      if (!webPlaying) return;
      startForegroundWithNotification();
      requestAudioFocus();
    }
    refreshCover();
    renderPlaybackState();
  }

  private void startForegroundWithNotification() {
    Notification notification = buildNotification();
    if (Build.VERSION.SDK_INT >= 29) {
      startForeground(NOTIFICATION_ID, notification,
          android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
    } else {
      startForeground(NOTIFICATION_ID, notification);
    }
    foregroundStarted = true;
  }

  private void renderPlaybackState() {
    boolean playing = webPlaying;
    updateMediaSession(playing);
    if (playing != lastRenderedPlaying
        || !webTitle.equals(lastRenderedTitle)
        || !webArtist.equals(lastRenderedArtist)) {
      NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
      if (manager != null) manager.notify(NOTIFICATION_ID, buildNotification());
      lastRenderedPlaying = playing;
      lastRenderedTitle = webTitle;
      lastRenderedArtist = webArtist;
    }
  }

  private void updateMediaSession(boolean playing) {
    if (mediaSession == null) return;
    PlaybackStateCompat.Builder stateBuilder = new PlaybackStateCompat.Builder()
        .setActions(PlaybackStateCompat.ACTION_PLAY
            | PlaybackStateCompat.ACTION_PAUSE
            | PlaybackStateCompat.ACTION_PLAY_PAUSE
            | PlaybackStateCompat.ACTION_SKIP_TO_NEXT
            | PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS
            | PlaybackStateCompat.ACTION_STOP)
        .setState(playing ? PlaybackStateCompat.STATE_PLAYING : PlaybackStateCompat.STATE_PAUSED,
            (long) (webPosition * 1000), playing ? 1f : 0f);
    if (webDuration > 0) stateBuilder.setBufferedPosition((long) (webDuration * 1000));
    mediaSession.setPlaybackState(stateBuilder.build());

    MediaMetadataCompat.Builder metadataBuilder = new MediaMetadataCompat.Builder()
        .putString(MediaMetadataCompat.METADATA_KEY_TITLE, webTitle)
        .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, webArtist)
        .putString(MediaMetadataCompat.METADATA_KEY_ALBUM, webAlbum)
        .putLong(MediaMetadataCompat.METADATA_KEY_DURATION, (long) (webDuration * 1000));
    if (coverBitmap != null) {
      metadataBuilder.putBitmap(MediaMetadataCompat.METADATA_KEY_ALBUM_ART, coverBitmap);
    }
    mediaSession.setMetadata(metadataBuilder.build());
  }

  private Notification buildNotification() {
    PendingIntent contentIntent = PendingIntent.getActivity(this, 0,
        new Intent(this, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
        PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

    NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
        .setSmallIcon(R.drawable.ic_notification)
        .setContentTitle(webTitle.isEmpty() ? getString(R.string.app_name) : webTitle)
        .setContentText(webArtist)
        .setContentIntent(contentIntent)
        .setDeleteIntent(actionPendingIntent(ACTION_STOP, 5))
        .setOnlyAlertOnce(true)
        .setShowWhen(false)
        .setOngoing(webPlaying)
        .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
        .addAction(R.drawable.ic_prev, "上一首", actionPendingIntent(ACTION_PREV, 1))
        .addAction(webPlaying ? R.drawable.ic_pause : R.drawable.ic_play,
            webPlaying ? "暂停" : "播放",
            actionPendingIntent(webPlaying ? ACTION_PAUSE : ACTION_PLAY, 2))
        .addAction(R.drawable.ic_next, "下一首", actionPendingIntent(ACTION_NEXT, 3));

    builder.setStyle(new MediaStyle()
        .setMediaSession(mediaSession != null ? mediaSession.getSessionToken() : null)
        .setShowActionsInCompactView(0, 1, 2));
    if (coverBitmap != null) builder.setLargeIcon(coverBitmap);
    return builder.build();
  }

  private PendingIntent actionPendingIntent(String action, int requestCode) {
    Intent intent = new Intent(this, PlaybackService.class).setAction(action);
    return PendingIntent.getService(this, requestCode, intent,
        PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
  }

  private void refreshCover() {
    String cover = webCover;
    if (cover.isEmpty() || cover.equals(loadedCoverUrl)) return;
    loadedCoverUrl = cover;
    final String target = cover;
    coverExecutor.execute(() -> {
      Bitmap bitmap = fetchBitmap(target);
      if (bitmap == null) return;
      mainHandler.post(() -> {
        coverBitmap = bitmap;
        if (foregroundStarted) {
          NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
          if (manager != null) manager.notify(NOTIFICATION_ID, buildNotification());
          updateMediaSession(webPlaying);
        }
      });
    });
  }

  private Bitmap fetchBitmap(String url) {
    HttpURLConnection connection = null;
    try {
      connection = (HttpURLConnection) new URL(url).openConnection();
      connection.setConnectTimeout(8000);
      connection.setReadTimeout(8000);
      connection.setRequestProperty("Referer", "https://music.zhoujun.dev/");
      InputStream stream = connection.getInputStream();
      return BitmapFactory.decodeStream(stream);
    } catch (Exception error) {
      return null;
    } finally {
      if (connection != null) connection.disconnect();
    }
  }

  @SuppressWarnings("deprecation")
  private void requestAudioFocus() {
    if (focusHeld || audioManager == null) return;
    int result = audioManager.requestAudioFocus(focusListener,
        AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
    focusHeld = result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED;
  }

  private void dispatchToWebView(String command) {
    WebView webView = MainActivity.ACTIVE_WEBVIEW != null ? MainActivity.ACTIVE_WEBVIEW.get() : null;
    if (webView == null) return;
    mainHandler.post(() -> webView.evaluateJavascript(
        "window.haloRemote&&window.haloRemote." + command + "()", null));
  }

  private void stopPlaybackService() {
    cleanup();
    stopSelf();
  }

  private void cleanup() {
    if (tickRunnable != null) mainHandler.removeCallbacks(tickRunnable);
    if (focusHeld && audioManager != null) {
      audioManager.abandonAudioFocus(focusListener);
      focusHeld = false;
    }
    if (noisyReceiver != null) {
      try {
        unregisterReceiver(noisyReceiver);
      } catch (Exception ignored) {
      }
      noisyReceiver = null;
    }
    if (mediaSession != null) {
      mediaSession.release();
      mediaSession = null;
    }
    if (coverExecutor != null) coverExecutor.shutdownNow();
    if (foregroundStarted) {
      if (Build.VERSION.SDK_INT >= 24) stopForeground(STOP_FOREGROUND_REMOVE);
      else stopForeground(true);
      foregroundStarted = false;
    }
    webPlaying = false;
  }

  private void createNotificationChannel() {
    if (Build.VERSION.SDK_INT < 26) return;
    NotificationChannel channel = new NotificationChannel(CHANNEL_ID,
        getString(R.string.app_name), NotificationManager.IMPORTANCE_LOW);
    channel.setDescription("正在播放的音乐");
    channel.setShowBadge(false);
    NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    if (manager != null) manager.createNotificationChannel(channel);
  }
}
