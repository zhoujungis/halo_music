/**
 * HALO Music - Player Finite State Machine (FSM)
 * 状态机规范化管理播放器生命周期：空闲、加载、播放中、已暂停、缓冲中、播放错误
 */

export const PlayerState = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  BUFFERING: 'buffering',
  ERROR: 'error'
});

export const PlayerEvent = Object.freeze({
  LOAD: 'LOAD',           // 开始加载新歌曲/解析音源
  PLAY: 'PLAY',           // 实际起播或恢复播放
  PAUSE: 'PAUSE',         // 暂停播放
  BUFFER: 'BUFFER',       // 缓冲不足/等待网络数据
  CANPLAY: 'CANPLAY',     // 媒体准备就绪
  ERROR: 'ERROR',         // 播放或解码失败
  STOP: 'STOP'            // 停止播放并重置状态
});

// 状态转移表定义：currentState -> event -> nextState
const TRANSITIONS = {
  [PlayerState.IDLE]: {
    [PlayerEvent.LOAD]: PlayerState.LOADING,
    [PlayerEvent.STOP]: PlayerState.IDLE
  },
  [PlayerState.LOADING]: {
    [PlayerEvent.PLAY]: PlayerState.PLAYING,
    [PlayerEvent.PAUSE]: PlayerState.PAUSED,
    [PlayerEvent.BUFFER]: PlayerState.BUFFERING,
    [PlayerEvent.CANPLAY]: PlayerState.LOADING,
    [PlayerEvent.ERROR]: PlayerState.ERROR,
    [PlayerEvent.STOP]: PlayerState.IDLE,
    [PlayerEvent.LOAD]: PlayerState.LOADING
  },
  [PlayerState.BUFFERING]: {
    [PlayerEvent.PLAY]: PlayerState.PLAYING,
    [PlayerEvent.PAUSE]: PlayerState.PAUSED,
    [PlayerEvent.CANPLAY]: PlayerState.BUFFERING,
    [PlayerEvent.ERROR]: PlayerState.ERROR,
    [PlayerEvent.STOP]: PlayerState.IDLE,
    [PlayerEvent.LOAD]: PlayerState.LOADING
  },
  [PlayerState.PLAYING]: {
    [PlayerEvent.PAUSE]: PlayerState.PAUSED,
    [PlayerEvent.BUFFER]: PlayerState.BUFFERING,
    [PlayerEvent.LOAD]: PlayerState.LOADING,
    [PlayerEvent.ERROR]: PlayerState.ERROR,
    [PlayerEvent.STOP]: PlayerState.IDLE
  },
  [PlayerState.PAUSED]: {
    [PlayerEvent.PLAY]: PlayerState.PLAYING,
    [PlayerEvent.LOAD]: PlayerState.LOADING,
    [PlayerEvent.STOP]: PlayerState.IDLE,
    [PlayerEvent.ERROR]: PlayerState.ERROR
  },
  [PlayerState.ERROR]: {
    [PlayerEvent.LOAD]: PlayerState.LOADING,
    [PlayerEvent.STOP]: PlayerState.IDLE
  }
};

export class PlayerStateMachine {
  constructor(initialState = PlayerState.IDLE, onTransition = null) {
    this._state = initialState;
    this._listeners = new Set();
    if (typeof onTransition === 'function') {
      this._listeners.add(onTransition);
    }
  }

  get state() {
    return this._state;
  }

  is(expectedState) {
    return this._state === expectedState;
  }

  can(event) {
    const table = TRANSITIONS[this._state];
    return Boolean(table && table[event]);
  }

  transition(event, payload = null) {
    const table = TRANSITIONS[this._state];
    const nextState = table ? table[event] : null;
    if (!nextState) {
      return false;
    }
    if (nextState === this._state) {
      return true;
    }
    const previousState = this._state;
    this._state = nextState;
    for (const listener of this._listeners) {
      try {
        listener(nextState, previousState, payload);
      } catch (err) {
        console.error('FSM listener error:', err);
      }
    }
    return true;
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  reset() {
    this._state = PlayerState.IDLE;
  }
}
