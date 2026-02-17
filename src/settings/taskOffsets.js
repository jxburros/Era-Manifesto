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
 * Task Offset Configuration Module
 * 
 * Provides default and user-configurable deadline offset formulas for:
 * - Song production tasks
 * - Stems tasks
 * - Video tasks
 * - Release tasks
 * - Event tasks
 * 
 * Supports user-defined offsets per Stage, Task Type, and Project Type.
 */

// Default offset configurations for song tasks (in days before release)
export const DEFAULT_SONG_OFFSETS = {
  'Demo': 100,
  'Arrangement': 90,
  'Record': 70,
  'Vocal Recording': 60,
  'Instrument Recording': 55,
  'Mix': 42,
  'Master': 21,
  'DSP Upload': 14,
  'Release': 0
};

// Default offset configurations for stems tasks
export const DEFAULT_STEMS_OFFSETS = {
  'Receive Stems': 35,
  'Release Stems': 7
};

// Default offset configurations for video tasks
export const DEFAULT_VIDEO_OFFSETS = {
  'Plan Video': 60,
  'Hire Crew': 45,
  'Film Video': 35,
  'Edit Video': 25,
  'Submit Video': 14,
  'Release Video': 0
};

// Default offset configurations for release tasks
export const DEFAULT_RELEASE_OFFSETS = {
  'Complete All Tracks': 60,
  'Finalize Album Art': 45,
  'Submit Release': 14,
  'Release': 0
};

// Default offset configurations for physical release tasks
export const DEFAULT_PHYSICAL_RELEASE_OFFSETS = {
  'Submit Physical Design': 90,
  'Receive Physical Copies': 21,
  'Distribute Physical Copies': 7
};

// Default offset configurations for event tasks
export const DEFAULT_EVENT_OFFSETS = {
  'Attend Event': 0,
  'Prepare for Event': 7,
  'Rehearsal': 3,
  'Travel Arrangements': 14,
  'Equipment Setup': 1,
  'Soundcheck': 0
};

// Project type-specific offsets (override defaults for specific project types)
export const DEFAULT_PROJECT_TYPE_OFFSETS = {
  'Single': {
    // Singles have shorter timelines
    'Demo': 60,
    'Arrangement': 50,
    'Record': 40,
    'Mix': 28,
    'Master': 14
  },
  'EP': {
    // EPs use standard timelines
  },
  'Album': {
    // Albums may need longer timelines
    'Demo': 120,
    'Arrangement': 105,
    'Record': 90,
    'Vocal Recording': 75,
    'Instrument Recording': 70
  }
};

/**
 * Get effective offset for a task type, considering user settings and defaults
 * @param {string} taskType - The task type (e.g., 'Mix', 'Master')
 * @param {string} category - Task category ('song', 'video', 'release', 'event', 'stems', 'physical')
 * @param {Object} userOffsets - User-defined custom offsets
 * @param {string} projectType - Optional project type for type-specific overrides
 * @returns {number} Days before release/event date
 */
export const getEffectiveOffset = (taskType, category, userOffsets = {}, projectType = null) => {
  // Priority 1: User-defined offset for specific project type
  if (projectType && userOffsets.projectTypes?.[projectType]?.[taskType] !== undefined) {
    return userOffsets.projectTypes[projectType][taskType];
  }

  // Priority 2: User-defined offset for task type
  if (userOffsets[category]?.[taskType] !== undefined) {
    return userOffsets[category][taskType];
  }

  // Priority 3: Default project type offset
  if (projectType && DEFAULT_PROJECT_TYPE_OFFSETS[projectType]?.[taskType] !== undefined) {
    return DEFAULT_PROJECT_TYPE_OFFSETS[projectType][taskType];
  }

  // Priority 4: Default offset for category
  const defaultOffsets = {
    song: DEFAULT_SONG_OFFSETS,
    stems: DEFAULT_STEMS_OFFSETS,
    video: DEFAULT_VIDEO_OFFSETS,
    release: DEFAULT_RELEASE_OFFSETS,
    physical: DEFAULT_PHYSICAL_RELEASE_OFFSETS,
    event: DEFAULT_EVENT_OFFSETS
  };

  return defaultOffsets[category]?.[taskType] ?? 0;
};

/**
 * Get all default offsets for a category
 * @param {string} category - Task category
 * @returns {Object} Default offsets for the category
 */
export const getDefaultOffsets = (category) => {
  const defaults = {
    song: DEFAULT_SONG_OFFSETS,
    stems: DEFAULT_STEMS_OFFSETS,
    video: DEFAULT_VIDEO_OFFSETS,
    release: DEFAULT_RELEASE_OFFSETS,
    physical: DEFAULT_PHYSICAL_RELEASE_OFFSETS,
    event: DEFAULT_EVENT_OFFSETS
  };
  return defaults[category] || {};
};

/**
 * Validate and sanitize user-provided offsets
 * @param {Object} offsets - User offsets to validate
 * @returns {Object} Validated offsets
 */
export const validateOffsets = (offsets) => {
  if (!offsets || typeof offsets !== 'object') return {};

  const validated = {};
  
  for (const [key, value] of Object.entries(offsets)) {
    if (typeof value === 'object' && value !== null) {
      validated[key] = {};
      for (const [taskType, offset] of Object.entries(value)) {
        const numOffset = Number(offset);
        if (Number.isFinite(numOffset) && numOffset >= 0) {
          validated[key][taskType] = numOffset;
        }
      }
    }
  }

  return validated;
};

/**
 * Merge user offsets with defaults
 * @param {Object} userOffsets - User-defined offsets
 * @returns {Object} Complete offset configuration
 */
export const mergeOffsets = (userOffsets = {}) => {
  return {
    song: { ...DEFAULT_SONG_OFFSETS, ...userOffsets.song },
    stems: { ...DEFAULT_STEMS_OFFSETS, ...userOffsets.stems },
    video: { ...DEFAULT_VIDEO_OFFSETS, ...userOffsets.video },
    release: { ...DEFAULT_RELEASE_OFFSETS, ...userOffsets.release },
    physical: { ...DEFAULT_PHYSICAL_RELEASE_OFFSETS, ...userOffsets.physical },
    event: { ...DEFAULT_EVENT_OFFSETS, ...userOffsets.event },
    projectTypes: { ...DEFAULT_PROJECT_TYPE_OFFSETS, ...userOffsets.projectTypes }
  };
};
