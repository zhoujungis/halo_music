package com.halomusic.app;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.lang.ref.WeakReference;
import org.json.JSONObject;

public class MainActivity extends Activity {
  private static final String APP_URL = "https://music.zhoujun.dev";
  private static final int FILE_CHOOSER_REQUEST = 1001;
  private static final int REQUEST_NOTIFICATION_PERMISSION = 1002;

  /** PlaybackService 通过它把通知栏/耳机的播放指令回注到页面。 */
  static WeakReference<WebView> ACTIVE_WEBVIEW = new WeakReference<>(null);

  private WebView webView;
  private ValueCallback<Uri[]> filePathCallback;
  private boolean notificationPermissionRequested;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    webView = new WebView(this);
    webView.setBackgroundColor(Color.parseColor("#f7f7f2"));

    WebSettings settings = webView.getSettings();
    settings.setJavaScriptEnabled(true);
    settings.setDomStorageEnabled(true);
    settings.setMediaPlaybackRequiresUserGesture(false);
    settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
    settings.setSupportMultipleWindows(false);

    webView.addJavascriptInterface(new HaloNativeBridge(), "haloNative");

    webView.setWebViewClient(new WebViewClient() {
      @Override
      public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        return openExternalIfNeeded(request.getUrl());
      }

      @Override
      @SuppressWarnings("deprecation")
      public boolean shouldOverrideUrlLoading(WebView view, String url) {
        return openExternalIfNeeded(Uri.parse(url));
      }
    });

    webView.setWebChromeClient(new WebChromeClient() {
      @Override
      public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
        if (filePathCallback != null) filePathCallback.onReceiveValue(null);
        filePathCallback = callback;
        try {
          startActivityForResult(params.createIntent(), FILE_CHOOSER_REQUEST);
          return true;
        } catch (Exception error) {
          filePathCallback = null;
          return false;
        }
      }
    });

    setContentView(webView);
    webView.loadUrl(APP_URL);
    ACTIVE_WEBVIEW = new WeakReference<>(webView);
  }

  private boolean openExternalIfNeeded(Uri uri) {
    String scheme = uri.getScheme();
    if (!"http".equals(scheme) && !"https".equals(scheme)) return true;
    String host = uri.getHost();
    if (isTrustedHost(host)) return false;
    try {
      startActivity(new Intent(Intent.ACTION_VIEW, uri));
    } catch (Exception ignored) {
      // No browser available; keep the current page.
    }
    return true;
  }

  private boolean isTrustedHost(String host) {
    if (host == null) return false;
    return host.equals("music.zhoujun.dev")
        || host.equals("halo-music.pages.dev")
        || host.endsWith(".halo-music.pages.dev");
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (requestCode == FILE_CHOOSER_REQUEST) {
      if (filePathCallback != null) {
        Uri[] results = null;
        if (resultCode == RESULT_OK && data != null) {
          if (data.getData() != null) {
            results = new Uri[] { data.getData() };
          } else if (data.getClipData() != null) {
            int count = data.getClipData().getItemCount();
            results = new Uri[count];
            for (int i = 0; i < count; i++) {
              results[i] = data.getClipData().getItemAt(i).getUri();
            }
          }
        }
        filePathCallback.onReceiveValue(results);
        filePathCallback = null;
      }
      return;
    }
    super.onActivityResult(requestCode, resultCode, data);
  }

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if (keyCode == KeyEvent.KEYCODE_BACK && webView != null && webView.canGoBack()) {
      webView.goBack();
      return true;
    }
    return super.onKeyDown(keyCode, event);
  }

  @Override
  @SuppressWarnings("deprecation")
  public void onBackPressed() {
    if (webView != null && webView.canGoBack()) {
      webView.goBack();
      return;
    }
    super.onBackPressed();
  }

  // 注意：不要重写 onPause() 调 webView.onPause()。那会连同音频一起挂起，
  // 是过去「切后台就停播」的直接原因；后台播放由 PlaybackService 前台服务保障。

  @Override
  protected void onDestroy() {
    ACTIVE_WEBVIEW = new WeakReference<>(null);
    if (webView != null) {
      webView.destroy();
      webView = null;
    }
    super.onDestroy();
  }

  private void ensureNotificationPermission() {
    if (Build.VERSION.SDK_INT < 33 || notificationPermissionRequested) return;
    notificationPermissionRequested = true;
    if (checkSelfPermission("android.permission.POST_NOTIFICATIONS") != PackageManager.PERMISSION_GRANTED) {
      requestPermissions(new String[] { "android.permission.POST_NOTIFICATIONS" }, REQUEST_NOTIFICATION_PERMISSION);
    }
  }

  /** 页面通过 window.haloNative.playbackState(json) 上报播放状态。 */
  private class HaloNativeBridge {
    @JavascriptInterface
    public void playbackState(String payload) {
      boolean playing = false;
      String title = "", artist = "", album = "", cover = "";
      double position = 0, duration = 0;
      try {
        JSONObject data = new JSONObject(payload == null ? "{}" : payload);
        playing = data.optBoolean("playing", false);
        title = data.optString("title", "");
        artist = data.optString("artist", "");
        album = data.optString("album", "");
        cover = data.optString("cover", "");
        position = data.optDouble("position", 0);
        duration = data.optDouble("duration", 0);
      } catch (Exception ignored) {
        // 解析失败按空状态处理，不影响网页播放本身。
      }
      PlaybackService.updateWebState(playing, title, artist, album, cover, position, duration);
      if (playing) {
        runOnUiThread(MainActivity.this::ensureNotificationPermission);
        PlaybackService.ensureStarted(MainActivity.this);
      }
    }
  }
}
