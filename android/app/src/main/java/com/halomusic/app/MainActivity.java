package com.halomusic.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
  private static final String APP_URL = "https://music.zhoujun.dev";
  private static final int FILE_CHOOSER_REQUEST = 1001;

  private WebView webView;
  private ValueCallback<Uri[]> filePathCallback;

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

  @Override
  protected void onPause() {
    if (webView != null) webView.onPause();
    super.onPause();
  }

  @Override
  protected void onResume() {
    super.onResume();
    if (webView != null) webView.onResume();
  }

  @Override
  protected void onDestroy() {
    if (webView != null) {
      webView.destroy();
      webView = null;
    }
    super.onDestroy();
  }
}
