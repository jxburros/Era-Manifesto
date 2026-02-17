/*
 * Copyright 2026 Jeffrey Guntly (JX Holdings, LLC)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { test } from 'node:test';
import assert from 'node:assert';
import {
  DEFAULT_SONG_OFFSETS,
  DEFAULT_VIDEO_OFFSETS,
  DEFAULT_EVENT_OFFSETS,
  getEffectiveOffset,
  getDefaultOffsets,
  validateOffsets,
  mergeOffsets
} from '../src/settings/taskOffsets.js';

test('DEFAULT_SONG_OFFSETS contains expected task types', () => {
  assert.strictEqual(DEFAULT_SONG_OFFSETS['Demo'], 100);
  assert.strictEqual(DEFAULT_SONG_OFFSETS['Mix'], 42);
  assert.strictEqual(DEFAULT_SONG_OFFSETS['Master'], 21);
  assert.strictEqual(DEFAULT_SONG_OFFSETS['Release'], 0);
});

test('DEFAULT_VIDEO_OFFSETS contains expected task types', () => {
  assert.strictEqual(DEFAULT_VIDEO_OFFSETS['Plan Video'], 60);
  assert.strictEqual(DEFAULT_VIDEO_OFFSETS['Film Video'], 35);
  assert.strictEqual(DEFAULT_VIDEO_OFFSETS['Release Video'], 0);
});

test('getEffectiveOffset returns default offset when no user override', () => {
  const offset = getEffectiveOffset('Mix', 'song', {});
  assert.strictEqual(offset, 42);
});

test('getEffectiveOffset returns user-defined offset when provided', () => {
  const userOffsets = {
    song: { 'Mix': 30 }
  };
  const offset = getEffectiveOffset('Mix', 'song', userOffsets);
  assert.strictEqual(offset, 30);
});

test('getEffectiveOffset returns project-specific offset', () => {
  const userOffsets = {
    song: { 'Mix': 30 },
    projectTypes: {
      'Album': { 'Mix': 50 }
    }
  };
  const offset = getEffectiveOffset('Mix', 'song', userOffsets, 'Album');
  assert.strictEqual(offset, 50);
});

test('getEffectiveOffset prioritizes user project type over general user offset', () => {
  const userOffsets = {
    song: { 'Mix': 30 },
    projectTypes: {
      'Single': { 'Mix': 20 }
    }
  };
  const offset = getEffectiveOffset('Mix', 'song', userOffsets, 'Single');
  assert.strictEqual(offset, 20);
});

test('getDefaultOffsets returns defaults for song category', () => {
  const offsets = getDefaultOffsets('song');
  assert.strictEqual(offsets['Mix'], 42);
  assert.strictEqual(offsets['Master'], 21);
});

test('validateOffsets sanitizes invalid offsets', () => {
  const invalid = {
    song: { 'Mix': 'invalid', 'Master': 21 },
    video: { 'Film Video': -10 }
  };
  const validated = validateOffsets(invalid);
  
  // Invalid string should be removed
  assert.strictEqual(validated.song?.['Mix'], undefined);
  // Valid offset should remain
  assert.strictEqual(validated.song?.['Master'], 21);
  // Negative offset should be removed
  assert.strictEqual(validated.video?.['Film Video'], undefined);
});

test('validateOffsets accepts valid numeric offsets', () => {
  const valid = {
    song: { 'Mix': 30, 'Master': 15 },
    video: { 'Plan Video': 45 }
  };
  const validated = validateOffsets(valid);
  
  assert.strictEqual(validated.song['Mix'], 30);
  assert.strictEqual(validated.song['Master'], 15);
  assert.strictEqual(validated.video['Plan Video'], 45);
});

test('mergeOffsets combines user offsets with defaults', () => {
  const userOffsets = {
    song: { 'Mix': 30 }
  };
  const merged = mergeOffsets(userOffsets);
  
  // User override should be present
  assert.strictEqual(merged.song['Mix'], 30);
  // Default values should still be present
  assert.strictEqual(merged.song['Demo'], 100);
  assert.strictEqual(merged.song['Master'], 21);
});

test('mergeOffsets handles empty user offsets', () => {
  const merged = mergeOffsets({});
  
  // Should return all defaults
  assert.strictEqual(merged.song['Mix'], 42);
  assert.strictEqual(merged.video['Plan Video'], 60);
  assert.strictEqual(merged.event['Attend Event'], 0);
});

test('getEffectiveOffset returns 0 for unknown task type', () => {
  const offset = getEffectiveOffset('UnknownTask', 'song', {});
  assert.strictEqual(offset, 0);
});

test('getEffectiveOffset returns 0 for unknown category', () => {
  const offset = getEffectiveOffset('SomeTask', 'unknown_category', {});
  assert.strictEqual(offset, 0);
});
