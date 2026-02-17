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
  saveScrollPosition,
  getScrollPosition,
  clearScrollPosition,
  clearAllScrollPositions,
  saveFormDraft,
  getFormDraft,
  clearFormDraft,
  hasFormDraft,
  getAllFormDrafts,
  clearExpiredFormDrafts,
  clearAllFormDrafts,
  createFormKey,
  autoSaveForm,
  saveNavigationState,
  getNavigationState,
  clearNavigationState
} from '../src/utils/navigationPersistence.js';

// Mock sessionStorage
global.sessionStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

test('saveScrollPosition stores position in memory', () => {
  saveScrollPosition('route1', 100, false);
  const position = getScrollPosition('route1');
  assert.strictEqual(position, 100);
});

test('getScrollPosition returns 0 for unknown route', () => {
  const position = getScrollPosition('nonexistent');
  assert.strictEqual(position, 0);
});

test('clearScrollPosition removes position', () => {
  saveScrollPosition('route2', 200, false);
  clearScrollPosition('route2');
  const position = getScrollPosition('route2');
  assert.strictEqual(position, 0);
});

test('clearAllScrollPositions removes all positions', () => {
  saveScrollPosition('route3', 300, false);
  saveScrollPosition('route4', 400, false);
  clearAllScrollPositions();
  assert.strictEqual(getScrollPosition('route3'), 0);
  assert.strictEqual(getScrollPosition('route4'), 0);
});

test('saveFormDraft stores form data', () => {
  const formData = { name: 'Test Song', genre: 'Rock' };
  saveFormDraft('song-create', formData);
  const retrieved = getFormDraft('song-create');
  assert.deepStrictEqual(retrieved, formData);
});

test('getFormDraft returns null for nonexistent draft', () => {
  const draft = getFormDraft('nonexistent');
  assert.strictEqual(draft, null);
});

test('getFormDraft returns null for expired draft', () => {
  const formData = { name: 'Old Song' };
  saveFormDraft('song-old', formData, -1000); // Already expired
  const retrieved = getFormDraft('song-old');
  assert.strictEqual(retrieved, null);
});

test('hasFormDraft checks for draft existence', () => {
  const formData = { name: 'New Song' };
  saveFormDraft('song-new', formData);
  assert.strictEqual(hasFormDraft('song-new'), true);
  assert.strictEqual(hasFormDraft('nonexistent'), false);
});

test('clearFormDraft removes draft', () => {
  const formData = { name: 'Temp Song' };
  saveFormDraft('song-temp', formData);
  clearFormDraft('song-temp');
  assert.strictEqual(hasFormDraft('song-temp'), false);
});

test('getAllFormDrafts returns all active drafts', () => {
  clearAllFormDrafts(); // Clean slate
  saveFormDraft('draft1', { name: 'Song 1' });
  saveFormDraft('draft2', { name: 'Song 2' });
  
  const drafts = getAllFormDrafts();
  assert.strictEqual(Object.keys(drafts).length, 2);
  assert.deepStrictEqual(drafts['draft1'], { name: 'Song 1' });
  assert.deepStrictEqual(drafts['draft2'], { name: 'Song 2' });
});

test('clearExpiredFormDrafts removes only expired drafts', () => {
  clearAllFormDrafts();
  saveFormDraft('active', { name: 'Active' }, 10000);
  saveFormDraft('expired', { name: 'Expired' }, -1000);
  
  const cleared = clearExpiredFormDrafts();
  assert.strictEqual(cleared, 1);
  assert.strictEqual(hasFormDraft('active'), true);
  assert.strictEqual(hasFormDraft('expired'), false);
});

test('clearAllFormDrafts removes all drafts', () => {
  saveFormDraft('draft3', { name: 'Song 3' });
  saveFormDraft('draft4', { name: 'Song 4' });
  clearAllFormDrafts();
  
  const drafts = getAllFormDrafts();
  assert.strictEqual(Object.keys(drafts).length, 0);
});

test('createFormKey generates correct keys', () => {
  assert.strictEqual(createFormKey('song', 'create'), 'song-create');
  assert.strictEqual(createFormKey('song', 'edit', '123'), 'song-edit-123');
  assert.strictEqual(createFormKey('release', 'create'), 'release-create');
});

test('autoSaveForm debounces save operations', async () => {
  const formData = { name: 'Auto Save Test' };
  const cleanup = autoSaveForm('auto-test', formData, 50);
  
  // Should not be saved immediately
  assert.strictEqual(hasFormDraft('auto-test'), false);
  
  // Wait for debounce
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Now it should be saved
  assert.strictEqual(hasFormDraft('auto-test'), true);
  
  cleanup();
});

test('saveNavigationState stores nav state', () => {
  const state = { activeTab: 'songs', filter: 'all' };
  saveNavigationState('dashboard', state);
  const retrieved = getNavigationState('dashboard');
  assert.deepStrictEqual(retrieved, state);
});

test('getNavigationState returns null for unknown route', () => {
  const state = getNavigationState('unknown');
  assert.strictEqual(state, null);
});

test('clearNavigationState removes state', () => {
  const state = { activeTab: 'releases' };
  saveNavigationState('releases-view', state);
  clearNavigationState('releases-view');
  assert.strictEqual(getNavigationState('releases-view'), null);
});
