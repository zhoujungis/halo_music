/**
 * HALO Music - Player Module
 * 音频播放管理、AnalyserNode 真实 FFT 频谱分析与 CORS 降级、FSM 状态机与睡眠淡出定时器
 */

import { PlayerState, PlayerEvent, PlayerStateMachine } from './fsm.js';

/**
 * 频谱分析器：
 * 对自建代理同源流/本地离线流，优先尝试真实 AnalyserNode FFT 频谱分析；
 * 遇到跨域无 CORS 头或捕获到异常时，优雅降级到正弦波模拟。
 */
export class AudioAnalyser {
  constructor() {
    this._ctx = null;
    this._analyser = null;
    this._shadowAudio = null;
    this._dataArray = null;
    this._isRealAnalysisActive = false;
    this._currentUrl = '';
  }

  /**
   * 判断音频流是否为同源或本地离线 Blob/Data 流
   */
  isSameOriginOrBlob(url) {
    if (!url) return false;
    const str = String(url).trim();
    if (str.startsWith('blob:') || str.startsWith('data:')) return true;
    try {
      if (typeof window !== 'undefined' && window.location) {
        const parsed = new URL(str, window.location.href);
        return parsed.origin === window.location.origin;
      }
    } catch {
      return false;
    }
    return false;
  }

  /**
   * 关联当前音轨地址并初始化分析器
   */
  attach(url, mainAudio) {
    this._currentUrl = url || '';
    this._isRealAnalysisActive = false;

    // 只有自建代理同源流或本地离线流才尝试建立真实 Web Audio 节点，规避第三方 CDN 跨域静音与报错风险
    if (!this.isSameOriginOrBlob(url)) {
      this._teardownShadow();
      return;
    }

    try {
      const AudioContextClass = typeof window !== 'undefined'
        && (window.AudioContext || window.webkitAudioContext);
      if (!AudioContextClass) return;

      if (!this._ctx) {
        this._ctx = new AudioContextClass();
      }
      if (this._ctx.state === 'suspended') {
        this._ctx.resume().catch(() => {});
      }

      if (!this._analyser) {
        this._analyser = this._ctx.createAnalyser();
        this._analyser.fftSize = 128;
        this._analyser.smoothingTimeConstant = 0.8;
        this._dataArray = new Uint8Array(this._analyser.frequencyBinCount);
      }

      // 使用静音 Shadow Audio 进行无损 FFT 取样，主播放音频不受任何 Web Audio 链路影响
      if (!this._shadowAudio) {
        this._shadowAudio = new Audio();
        this._shadowAudio.muted = true;
        this._shadowAudio.crossOrigin = 'anonymous';
        try {
          const source = this._ctx.createMediaElementSource(this._shadowAudio);
          source.connect(this._analyser);
        } catch (sourceErr) {
          // 若已连接或环境不支持，降级
        }
      }

      this._shadowAudio.src = url;
      if (mainAudio && Number.isFinite(mainAudio.currentTime)) {
        this._shadowAudio.currentTime = mainAudio.currentTime;
      }
      if (mainAudio && !mainAudio.paused) {
        this._shadowAudio.play().then(() => {
          this._isRealAnalysisActive = true;
        }).catch(() => {
          // 捕获到 CORS 或自动播放阻止异常，优雅降级
          this._isRealAnalysisActive = false;
        });
      }
    } catch {
      // 任何 Web Audio 异常，平滑降级
      this._isRealAnalysisActive = false;
    }
  }

  /**
   * 同步主音频与分析影子节点的播放状态
   */
  sync(mainAudio) {
    if (!this._isRealAnalysisActive || !this._shadowAudio || !mainAudio) return;
    if (Math.abs(this._shadowAudio.currentTime - mainAudio.currentTime) > 0.3) {
      try {
        this._shadowAudio.currentTime = mainAudio.currentTime;
      } catch {}
    }
    if (mainAudio.paused && !this._shadowAudio.paused) {
      this._shadowAudio.pause();
    } else if (!mainAudio.paused && this._shadowAudio.paused) {
      this._shadowAudio.play().catch(() => {
        this._isRealAnalysisActive = false;
      });
    }
  }

  _teardownShadow() {
    if (this._shadowAudio) {
      try {
        this._shadowAudio.pause();
        this._shadowAudio.removeAttribute('src');
        this._shadowAudio.load();
      } catch {}
    }
    this._isRealAnalysisActive = false;
  }

  /**
   * 获取当前音频动态强度 (0.0 ~ 1.0)
   * 优先输出真实 FFT 频谱能量；异常时降级至正弦波仿真
   */
  getAudioLevel(currentTime = 0, volume = 1) {
    if (this._isRealAnalysisActive && this._analyser && this._dataArray) {
      try {
        this._analyser.getByteFrequencyData(this._dataArray);
        let sum = 0;
        const count = Math.min(32, this._dataArray.length);
        for (let i = 0; i < count; i++) {
          sum += this._dataArray[i];
        }
        const energy = sum / (count * 255);
        if (energy > 0.01) {
          return Math.min(1, (0.25 + energy * 1.5) * (volume || 1));
        }
      } catch {
        // 读取频率数据异常，平滑降级至正弦波
        this._isRealAnalysisActive = false;
      }
    }

    // 经典正弦波能量仿真
    const intensity = Math.abs(Math.sin(currentTime * 2.3));
    return 0.3 + 0.7 * intensity * (volume || 1);
  }
}

/**
 * 睡眠定时器管理器（带最后 5 秒平滑线性淡出）
 */
export class SleepTimer {
  constructor(audioElement, options = {}) {
    this.audio = audioElement;
    this.onToast = options.onToast || (() => {});
    this.onUpdateUI = options.onUpdateUI || (() => {});
    this.bilingual = options.bilingual || ((zh) => zh);

    this.mode = null; // null | 'duration' | 'track'
    this.minutes = 0;
    this.endsAt = 0;
    this.totalMs = 0;
    this.tickId = null;
    this.fadeId = null;
    this.fading = false;
    this.restoreVolume = null;

    this.SLEEP_FADE_MS = 5000;
    this.SLEEP_FADE_STEP_MS = 100;
  }

  isActive() {
    return this.mode === 'duration' || this.mode === 'track';
  }

  startDuration(minutes) {
    this.disarm();
    this.mode = 'duration';
    this.minutes = minutes;
    this.totalMs = minutes * 60000;
    this.endsAt = Date.now() + this.totalMs;
    this.tickId = setInterval(() => this._tick(), 250);
    this.onUpdateUI();
    this.onToast(this.bilingual(`已开启睡眠定时：${minutes} 分钟后停止播放`, `Sleep timer set: stops in ${minutes} min`));
  }

  startTrack() {
    this.disarm();
    this.mode = 'track';
    this.onUpdateUI();
    this.onToast(this.bilingual('已开启睡眠定时：播完当前这首后停止', 'Sleep timer set: stops after this track'));
  }

  cancel() {
    if (!this.isActive()) {
      this.onUpdateUI();
      return;
    }
    this.disarm();
    this.onToast(this.bilingual('已关闭睡眠定时', 'Sleep timer off'));
  }

  disarm() {
    if (this.tickId) {
      clearInterval(this.tickId);
      this.tickId = null;
    }
    this._stopFade(true);
    this.mode = null;
    this.minutes = 0;
    this.endsAt = 0;
    this.totalMs = 0;
    this.onUpdateUI();
  }

  consumeAtTrackEnd() {
    if (this.mode === 'track') {
      this.disarm();
      this.onToast(this.bilingual('睡眠定时：本首播完已停止播放', 'Sleep timer: stopped after this track'));
      return true;
    }
    if (this.fading) {
      if (this.audio) this.audio.pause();
      this._stopFade(true);
      this.disarm();
      this.onToast(this.bilingual('睡眠定时已结束，已暂停播放', 'Sleep timer finished — playback paused'));
      return true;
    }
    return false;
  }

  _tick() {
    if (this.mode !== 'duration') return;
    const remaining = this.endsAt - Date.now();
    if (remaining <= this.SLEEP_FADE_MS && !this.fading) {
      this._beginFade(Math.max(250, remaining));
    }
    this.onUpdateUI();
  }

  _beginFade(durationMs) {
    if (this.fading || !this.audio) return;
    if (!this.audio.src || this.audio.paused) {
      this.disarm();
      this.onToast(this.bilingual('睡眠定时已结束', 'Sleep timer finished'));
      return;
    }
    this.fading = true;
    this.restoreVolume = this.audio.volume;
    const baseVolume = this.restoreVolume;
    const startedAt = Date.now();
    const fadeMs = Math.max(200, durationMs);

    this.fadeId = setInterval(() => {
      const progress = Math.min(1, (Date.now() - startedAt) / fadeMs);
      this.audio.volume = baseVolume * (1 - progress);
      if (progress < 1) return;
      this.audio.pause();
      this._stopFade(true);
      this.disarm();
      this.onToast(this.bilingual('睡眠定时已结束，已暂停播放', 'Sleep timer finished — playback paused'));
    }, this.SLEEP_FADE_STEP_MS);
  }

  _stopFade(restoreVolume = true) {
    if (this.fadeId) {
      clearInterval(this.fadeId);
      this.fadeId = null;
    }
    this.fading = false;
    if (restoreVolume && this.restoreVolume != null && this.audio) {
      this.audio.volume = this.restoreVolume;
    }
    this.restoreVolume = null;
  }
}
