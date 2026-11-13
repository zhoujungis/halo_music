import test from 'node:test';
import assert from 'node:assert/strict';
import { PlayerState, PlayerEvent, PlayerStateMachine } from '../js/fsm.js';
import { parseLRC } from '../js/lyrics.js';
import { AudioAnalyser } from '../js/player.js';
import {
  OFFLINE_DB_NAME,
  LIBRARY_STORAGE_KEY,
  PLAY_QUEUE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  SEARCH_HISTORY_KEY
} from '../js/storage.js';

test('PlayerStateMachine initializes with IDLE state', () => {
  const fsm = new PlayerStateMachine();
  assert.equal(fsm.state, PlayerState.IDLE);
  assert.equal(fsm.is(PlayerState.IDLE), true);
  assert.equal(fsm.can(PlayerEvent.LOAD), true);
  assert.equal(fsm.can(PlayerEvent.PAUSE), false);
});

test('PlayerStateMachine transitions correctly through playback lifecycle', () => {
  const history = [];
  const fsm = new PlayerStateMachine(PlayerState.IDLE, (next, prev) => {
    history.push(`${prev}->${next}`);
  });

  // IDLE -> LOADING
  assert.equal(fsm.transition(PlayerEvent.LOAD), true);
  assert.equal(fsm.state, PlayerState.LOADING);

  // LOADING -> BUFFERING
  assert.equal(fsm.transition(PlayerEvent.BUFFER), true);
  assert.equal(fsm.state, PlayerState.BUFFERING);

  // BUFFERING -> PLAYING
  assert.equal(fsm.transition(PlayerEvent.PLAY), true);
  assert.equal(fsm.state, PlayerState.PLAYING);

  // PLAYING -> PAUSED
  assert.equal(fsm.transition(PlayerEvent.PAUSE), true);
  assert.equal(fsm.state, PlayerState.PAUSED);

  // PAUSED -> PLAYING
  assert.equal(fsm.transition(PlayerEvent.PLAY), true);
  assert.equal(fsm.state, PlayerState.PLAYING);

  // PLAYING -> ERROR
  assert.equal(fsm.transition(PlayerEvent.ERROR), true);
  assert.equal(fsm.state, PlayerState.ERROR);

  // ERROR -> LOADING (retry)
  assert.equal(fsm.transition(PlayerEvent.LOAD), true);
  assert.equal(fsm.state, PlayerState.LOADING);

  // LOADING -> STOP
  assert.equal(fsm.transition(PlayerEvent.STOP), true);
  assert.equal(fsm.state, PlayerState.IDLE);

  assert.deepEqual(history, [
    'idle->loading',
    'loading->buffering',
    'buffering->playing',
    'playing->paused',
    'paused->playing',
    'playing->error',
    'error->loading',
    'loading->idle'
  ]);
});

test('PlayerStateMachine rejects invalid transitions', () => {
  const fsm = new PlayerStateMachine(PlayerState.IDLE);
  assert.equal(fsm.transition(PlayerEvent.PAUSE), false);
  assert.equal(fsm.state, PlayerState.IDLE);
});

test('parseLRC parses timestamps and formats text correctly', () => {
  const lrc = `
    [ti:Test Song]
    [ar:Test Artist]
    [00:01.50]Hello world
    [00:04.200]This is line 2
    [01:10.05]End of track
  `;
  const lines = parseLRC(lrc);
  assert.equal(lines.length, 3);
  assert.equal(lines[0].time, 1.5);
  assert.equal(lines[0].text, 'Hello world');
  assert.equal(lines[1].time, 4.2);
  assert.equal(lines[1].text, 'This is line 2');
  assert.equal(lines[2].time, 70.05);
  assert.equal(lines[2].text, 'End of track');
});

test('AudioAnalyser identifies same-origin vs cross-origin streams and falls back safely', () => {
  const analyser = new AudioAnalyser();

  // Blobs and data URIs are recognized as safe
  assert.equal(analyser.isSameOriginOrBlob('blob:https://music.zhoujun.dev/12345'), true);
  assert.equal(analyser.isSameOriginOrBlob('data:audio/mp3;base64,...'), true);

  // In test environment without location, non-blob URLs are treated as not same-origin
  assert.equal(analyser.isSameOriginOrBlob('http://m701.music.126.net/track.mp3'), false);
  assert.equal(analyser.isSameOriginOrBlob(''), false);

  // Audio level falls back to valid simulated number
  const level = analyser.getAudioLevel(1.5, 0.8);
  assert.equal(typeof level, 'number');
  assert.ok(level >= 0 && level <= 1);
});

test('storage module exports expected storage keys', () => {
  assert.equal(OFFLINE_DB_NAME, 'halo-music-offline');
  assert.equal(LIBRARY_STORAGE_KEY, 'halo-music-library-v1');
  assert.equal(PLAY_QUEUE_STORAGE_KEY, 'halo-music-play-queue-v1');
  assert.equal(THEME_STORAGE_KEY, 'halo-music-theme');
  assert.equal(SEARCH_HISTORY_KEY, 'halo-music-search-history-v1');
});
