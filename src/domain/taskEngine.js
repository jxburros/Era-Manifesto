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

/**
 * taskEngine.js - Unified TaskEngine module
 *
 * Provides a single import point for all task generation logic, constants,
 * and helpers. Avoids importing from Store.jsx (would create circular deps)
 * by defining the task-type arrays locally.
 */

// ─── Re-exports from taskLogic.js ────────────────────────────────────────────
// These are re-exported so consumers only need one import source.
// The subset actually used inside this module is also imported below.

export {
  STATUS_OPTIONS,
  STATUS_POINTS,
  getStatusPoints,
  calculateTaskProgress,
  getEffectiveCost,
  resolveCostPrecedence,
} from './taskLogic.js';

// Local bindings for the helpers actually called inside this file
import { calculateTaskProgress, getEffectiveCost } from './taskLogic.js';

// ─── Task Type Constant Arrays ────────────────────────────────────────────────
// Copied from Store.jsx to avoid circular imports.

/**
 * Core song production task types.
 * Per APP_ARCHITECTURE.md Section 3.1 and 3.2.
 */
export const SONG_TASK_TYPES = [
  { type: 'Demo',                 category: 'Production',       daysBeforeRelease: 100, appliesTo: 'all'    },
  { type: 'Arrangement',          category: 'Production',       daysBeforeRelease:  90, appliesTo: 'all'    },
  { type: 'Record',               category: 'Recording',        daysBeforeRelease:  70, appliesTo: 'all'    },
  { type: 'Vocal Recording',      category: 'Recording',        daysBeforeRelease:  60, appliesTo: 'all'    },
  { type: 'Instrument Recording', category: 'Recording',        daysBeforeRelease:  55, appliesTo: 'all'    },
  { type: 'Mix',                  category: 'Post-Production',  daysBeforeRelease:  42, appliesTo: 'all'    },
  { type: 'Master',               category: 'Post-Production',  daysBeforeRelease:  21, appliesTo: 'all'    },
  { type: 'DSP Upload',           category: 'Distribution',     daysBeforeRelease:  14, appliesTo: 'single' },
  { type: 'Release',              category: 'Distribution',     daysBeforeRelease:   0, appliesTo: 'all'    },
];

/**
 * Stems-related task types (auto-added when stemsNeeded = true).
 * Per APP_ARCHITECTURE.md Section 3.2.
 */
export const STEMS_TASK_TYPES = [
  { type: 'Receive Stems', category: 'Post-Production', daysBeforeRelease: 35 },
  { type: 'Release Stems', category: 'Distribution',    daysBeforeRelease:  7 },
];

/**
 * Version task types (Arrangement → Instrumentation → Mix → Master → Release).
 * These are the standard tasks generated for a song version.
 */
export const VERSION_TASK_TYPES = [
  { type: 'Arrangement',    category: 'Production',      daysBeforeRelease: 90 },
  { type: 'Instrumentation',category: 'Recording',       daysBeforeRelease: 60 },
  { type: 'Mix',            category: 'Post-Production', daysBeforeRelease: 42 },
  { type: 'Master',         category: 'Post-Production', daysBeforeRelease: 21 },
  { type: 'Release',        category: 'Distribution',    daysBeforeRelease:  0 },
];

/**
 * Video task types.
 * Per APP_ARCHITECTURE.md Section 3.3 and Phase 1.8 specification.
 * All video types receive these 6 core tasks.
 */
export const VIDEO_TASK_TYPES = [
  { type: 'Plan Video',    category: 'Video',        daysBeforeRelease: 60, videoTypes: ['music', 'Full', 'lyric', 'enhancedLyric', 'visualizer', 'Lyric', 'Enhanced', 'Enhanced + Loop', 'custom', 'live', 'loop'] },
  { type: 'Hire Crew',     category: 'Video',        daysBeforeRelease: 45, videoTypes: ['music', 'Full', 'lyric', 'enhancedLyric', 'visualizer', 'Lyric', 'Enhanced', 'Enhanced + Loop', 'custom', 'live', 'loop'] },
  { type: 'Film Video',    category: 'Video',        daysBeforeRelease: 35, videoTypes: ['music', 'Full', 'lyric', 'enhancedLyric', 'visualizer', 'Lyric', 'Enhanced', 'Enhanced + Loop', 'custom', 'live', 'loop'] },
  { type: 'Edit Video',    category: 'Video',        daysBeforeRelease: 25, videoTypes: ['music', 'Full', 'lyric', 'enhancedLyric', 'visualizer', 'Lyric', 'Enhanced', 'Enhanced + Loop', 'custom', 'live', 'loop'] },
  { type: 'Submit Video',  category: 'Video',        daysBeforeRelease: 14, videoTypes: ['music', 'Full', 'lyric', 'enhancedLyric', 'visualizer', 'Lyric', 'Enhanced', 'Enhanced + Loop', 'custom', 'live', 'loop'] },
  { type: 'Release Video', category: 'Distribution', daysBeforeRelease:  0, videoTypes: ['music', 'Full', 'lyric', 'enhancedLyric', 'visualizer', 'Lyric', 'Enhanced', 'Enhanced + Loop', 'custom', 'live', 'loop'] },
];

/**
 * Core release task types.
 * Per APP_ARCHITECTURE.md Section 3.4 and Phase 3 specification.
 */
export const RELEASE_TASK_TYPES = [
  { type: 'Complete All Tracks', category: 'Production',   daysBeforeRelease: 60 },
  { type: 'Finalize Album Art',  category: 'Marketing',    daysBeforeRelease: 45 },
  { type: 'Submit Release',      category: 'Distribution', daysBeforeRelease: 14 },
  { type: 'Release',             category: 'Distribution', daysBeforeRelease:  0 },
];

/**
 * Physical-copy release task types (added when hasPhysicalCopies = true).
 * Per APP_ARCHITECTURE.md Phase 3.6.
 */
export const PHYSICAL_RELEASE_TASK_TYPES = [
  { type: 'Submit Physical Design',    category: 'Distribution', daysBeforeRelease: 90 },
  { type: 'Receive Physical Copies',   category: 'Distribution', daysBeforeRelease: 21 },
  { type: 'Distribute Physical Copies',category: 'Distribution', daysBeforeRelease:  7 },
];

/**
 * Event task types.
 * Per APP_ARCHITECTURE.md Section 3.5.
 */
export const EVENT_TASK_TYPES = [
  { type: 'Attend Event',        category: 'Events', daysBeforeEvent:  0, required: true  },
  { type: 'Prepare for Event',   category: 'Events', daysBeforeEvent:  7, required: false },
  { type: 'Rehearsal',           category: 'Events', daysBeforeEvent:  3, required: false },
  { type: 'Travel Arrangements', category: 'Events', daysBeforeEvent: 14, required: false },
  { type: 'Equipment Setup',     category: 'Events', daysBeforeEvent:  1, required: false },
  { type: 'Soundcheck',          category: 'Events', daysBeforeEvent:  0, required: false },
];

// ─── Internal task factory (no React / Firebase deps) ────────────────────────

/**
 * Lightweight task factory.
 * Does NOT import createUnifiedTask from Store.jsx to avoid circular deps.
 * Uses only underscore_case fields as the source of truth.
 *
 * @param {object} overrides  - Field overrides to apply on top of defaults.
 * @returns {object}          - New task object.
 */
const createTask = (overrides = {}) => {
  const rawDate = overrides.due_date || '';

  return {
    id:             crypto.randomUUID(),
    type:           overrides.type     || 'Custom',
    name:           overrides.type     || overrides.name || '',
    status:         'Not Started',
    due_date:       rawDate,
    category:       overrides.category  || 'Other',
    parentType:     overrides.parentType || null,
    estimated_cost: 0,
    quoted_cost:    0,
    amount_paid:    0,
    era_ids:        [],
    tag_ids:        [],
    isOverridden:   false,
    isArchived:     false,
    notes:          '',
    ...overrides,
    due_date: overrides.due_date || rawDate,
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Subtract `days` from a YYYY-MM-DD string and return a new YYYY-MM-DD string.
 * @param {string} dateStr   - ISO date string (YYYY-MM-DD or full ISO-8601).
 * @param {number} days      - Number of days to subtract.
 * @returns {string}         - Resulting date as YYYY-MM-DD.
 */
const subtractDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

/**
 * Check whether a task is considered "complete / done" for recalculation purposes.
 * @param {object} task
 * @returns {boolean}
 */
const isCompleteStatus = (task) =>
  task.status === 'Done' || task.status === 'Complete';

// ─── TaskEngine ───────────────────────────────────────────────────────────────

/**
 * Unified TaskEngine — dispatches task generation / recalculation across all
 * entity types, and wraps the helper functions from taskLogic.js.
 */
const TaskEngine = {
  // ── Generation ─────────────────────────────────────────────────────────────

  /**
   * Generate default tasks for an entity.
   *
   * @param {'song'|'version'|'video'|'release'|'event'} entityType
   * @param {object} entityData     - Entity data (holds dates, flags, etc.)
   * @param {object} [options]      - Extra generation options (merged with entityData).
   *   - releaseDate {string}       - YYYY-MM-DD release date (song / version / video / release)
   *   - eventDate   {string}       - YYYY-MM-DD event date   (event)
   *   - isSingle    {boolean}      - Whether this is a single (song)
   *   - stemsNeeded {boolean}      - Whether stems tasks should be included (song)
   *   - videoTypeKey {string}      - Video type key, e.g. 'music' (video)
   *   - hasPhysicalCopies {boolean}- Whether physical release tasks should be added (release)
   *   - includePreparation {boolean}- Whether optional event prep tasks should be included (event), default true
   *   - deadlineOffsets {object}   - Custom per-task day offsets, keyed by task type string
   * @returns {object[]} Generated task objects sorted by date.
   */
  generateTasks(entityType, entityData = {}, options = {}) {
    const opts = { ...entityData, ...options };

    switch (entityType) {
      case 'song':    return _generateSongTasks(opts);
      case 'version': return _generateVersionTasks(opts);
      case 'video':   return _generateVideoTasks(opts);
      case 'release': return _generateReleaseTasks(opts);
      case 'event':   return _generateEventTasks(opts);
      default:
        console.warn(`TaskEngine.generateTasks: unknown entityType "${entityType}"`);
        return [];
    }
  },

  // ── Recalculation ──────────────────────────────────────────────────────────

  /**
   * Recalculate due dates for non-overridden, non-complete tasks after a date change.
   *
   * @param {'song'|'version'|'video'|'release'|'event'} entityType
   * @param {object[]} existingTasks   - Current task array.
   * @param {string}   newDate         - New reference date (YYYY-MM-DD).
   * @param {object}   [options]       - Same options as generateTasks.
   *   - isSingle         {boolean}    - For song: apply single-specific tasks
   *   - videoTypeKey     {string}     - For video: video type key
   *   - deadlineOffsets  {object}     - Custom offsets
   * @returns {object[]} Updated (mutated copies) task array.
   */
  recalculateTasks(entityType, existingTasks = [], newDate, options = {}) {
    if (!newDate) return existingTasks;

    const offsets = _buildOffsetMap(entityType, options);

    return existingTasks.map(task => {
      if (task.isOverridden || isCompleteStatus(task)) return task;
      const offsetDays = offsets[task.type];
      if (offsetDays === undefined) return task;

      const recalcDate = subtractDays(newDate, offsetDays);
      return {
        ...task,
        due_date: recalcDate,
      };
    });
  },

  // ── Progress ───────────────────────────────────────────────────────────────

  /**
   * Calculate weighted progress for a task list.
   * Wraps `calculateTaskProgress` from taskLogic.js.
   *
   * @param {object[]} tasks
   * @returns {{ pointsEarned: number, totalTasks: number, progress: number }}
   */
  calculateProgress(tasks = []) {
    return calculateTaskProgress(tasks);
  },

  // ── Cost ───────────────────────────────────────────────────────────────────

  /**
   * Get the effective cost for an entity using the specified cost precedence model.
   * Wraps `getEffectiveCost` from taskLogic.js.
   *
   * @param {object} entity         - Entity with cost fields.
   * @param {string} [model]        - 'paid-first' | 'quoted-first' | 'estimated-first'
   * @returns {number}              - Resolved cost value.
   */
  calculateCost(entity = {}, model = 'paid-first') {
    return getEffectiveCost(entity, model);
  },
};

// ─── Private generator helpers ────────────────────────────────────────────────

/**
 * Build tasks from a type definition array using a reference date.
 * @param {object[]} typeArray     - Array of { type, category, daysBeforeRelease } descriptors.
 * @param {string}   dateStr       - YYYY-MM-DD reference date.
 * @param {string}   parentType    - Parent entity type label.
 * @param {object}   [offsets={}]  - Custom per-task day offsets.
 * @returns {object[]}
 */
function _buildTasks(typeArray, dateStr, parentType, offsets = {}) {
  return typeArray.map(def => {
    const days = offsets[def.type] ?? def.daysBeforeRelease ?? def.daysBeforeEvent ?? 0;
    const taskDate = subtractDays(dateStr, days);
    return createTask({
      type:      def.type,
      category:  def.category,
      due_date:  taskDate,
      parentType,
    });
  });
}

/**
 * Build an offset map for recalculation (type → daysBeforeReference).
 * @param {string} entityType
 * @param {object} options
 * @returns {Record<string, number>}
 */
function _buildOffsetMap(entityType, options = {}) {
  const { isSingle, videoTypeKey, deadlineOffsets = {} } = options;
  const map = {};

  const apply = (typeArray, filter) => {
    typeArray.forEach(def => {
      if (filter && !filter(def)) return;
      map[def.type] = deadlineOffsets[def.type] ?? def.daysBeforeRelease ?? def.daysBeforeEvent ?? 0;
    });
  };

  switch (entityType) {
    case 'song':
      apply(SONG_TASK_TYPES, def => def.appliesTo === 'all' || (def.appliesTo === 'single' && isSingle));
      apply(STEMS_TASK_TYPES);
      if (videoTypeKey) apply(VIDEO_TASK_TYPES, def => def.videoTypes.includes(videoTypeKey));
      break;
    case 'version':
      apply(VERSION_TASK_TYPES);
      break;
    case 'video':
      if (videoTypeKey) apply(VIDEO_TASK_TYPES, def => def.videoTypes.includes(videoTypeKey));
      else apply(VIDEO_TASK_TYPES);
      break;
    case 'release':
      apply(RELEASE_TASK_TYPES);
      apply(PHYSICAL_RELEASE_TASK_TYPES);
      break;
    case 'event':
      apply(EVENT_TASK_TYPES);
      break;
    default:
      break;
  }

  return map;
}

/** Generate tasks for a Song entity. */
function _generateSongTasks(opts) {
  const { releaseDate, isSingle, stemsNeeded, videoTypeKey, deadlineOffsets = {} } = opts;
  if (!releaseDate) return [];

  const tasks = [];

  // Core song production tasks
  SONG_TASK_TYPES.forEach(def => {
    if (def.appliesTo === 'single' && !isSingle) return;
    const days = deadlineOffsets[def.type] ?? def.daysBeforeRelease;
    const d = subtractDays(releaseDate, days);
    tasks.push(createTask({ type: def.type, category: def.category, due_date: d, parentType: 'song' }));
  });

  // Stems tasks
  if (stemsNeeded) {
    STEMS_TASK_TYPES.forEach(def => {
      const days = deadlineOffsets[def.type] ?? def.daysBeforeRelease;
      const d = subtractDays(releaseDate, days);
      tasks.push(createTask({ type: def.type, category: def.category, due_date: d, parentType: 'song' }));
    });
  }

  // Optional inline video tasks (when a video type is specified on the song)
  if (videoTypeKey && videoTypeKey !== 'None') {
    VIDEO_TASK_TYPES.forEach(def => {
      if (!def.videoTypes.includes(videoTypeKey)) return;
      const days = deadlineOffsets[def.type] ?? def.daysBeforeRelease;
      const d = subtractDays(releaseDate, days);
      tasks.push(createTask({ type: def.type, category: def.category, due_date: d, parentType: 'song' }));
    });
  }

  tasks.sort((a, b) => a.due_date.localeCompare(b.due_date));
  return tasks;
}

/** Generate tasks for a Version entity. */
function _generateVersionTasks(opts) {
  const { releaseDate, deadlineOffsets = {} } = opts;
  if (!releaseDate) return [];

  const tasks = _buildTasks(VERSION_TASK_TYPES, releaseDate, 'version', deadlineOffsets);
  tasks.sort((a, b) => a.due_date.localeCompare(b.due_date));
  return tasks;
}

/** Generate tasks for a Video entity. */
function _generateVideoTasks(opts) {
  const { releaseDate, videoTypeKey = 'music', deadlineOffsets = {} } = opts;
  if (!releaseDate) return [];

  const filtered = VIDEO_TASK_TYPES.filter(def => def.videoTypes.includes(videoTypeKey));
  const tasks = _buildTasks(filtered, releaseDate, 'video', deadlineOffsets);
  tasks.sort((a, b) => a.due_date.localeCompare(b.due_date));
  return tasks;
}

/** Generate tasks for a Release entity. */
function _generateReleaseTasks(opts) {
  const { releaseDate, hasPhysicalCopies, deadlineOffsets = {} } = opts;
  if (!releaseDate) return [];

  const typeArray = [
    ...RELEASE_TASK_TYPES,
    ...(hasPhysicalCopies ? PHYSICAL_RELEASE_TASK_TYPES : []),
  ];
  const tasks = _buildTasks(typeArray, releaseDate, 'release', deadlineOffsets);
  tasks.sort((a, b) => a.due_date.localeCompare(b.due_date));
  return tasks;
}

/** Generate tasks for an Event entity. */
function _generateEventTasks(opts) {
  const { eventDate, includePreparation = true, deadlineOffsets = {} } = opts;
  if (!eventDate) return [];

  const filtered = EVENT_TASK_TYPES.filter(def => def.required || includePreparation);
  const tasks = filtered.map(def => {
    const days = deadlineOffsets[def.type] ?? def.daysBeforeEvent ?? 0;
    const d = subtractDays(eventDate, days);
    return createTask({
      type:       def.type,
      category:   def.category,
      due_date:   d,
      parentType: 'event',
      isOptional: !def.required,
    });
  });

  tasks.sort((a, b) => a.due_date.localeCompare(b.due_date));
  return tasks;
}

// ─── Default export ───────────────────────────────────────────────────────────

export default TaskEngine;
