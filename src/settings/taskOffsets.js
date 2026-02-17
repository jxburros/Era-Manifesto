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
 * Manages deadline offset templates for different project types (Single, EP, Album).
 * Replaces hardcoded offset values with user-configurable templates.
 * 
 * Usage:
 * import { getTaskOffsets, DEFAULT_TEMPLATES } from './settings/taskOffsets';
 * const offsets = getTaskOffsets(userSettings, 'single');
 */

// Default template for Single releases
export const SINGLE_TEMPLATE = {
  id: 'single',
  name: 'Single',
  description: 'Optimized timeline for single song releases',
  offsets: {
    // Song Production
    'Demo': 100,
    'Arrangement': 90,
    'Record': 70,
    'Vocal Recording': 60,
    'Instrument Recording': 55,
    'Mix': 42,
    'Master': 21,
    'DSP Upload': 14,
    'Release': 0,
    // Stems
    'Receive Stems': 35,
    'Release Stems': 7,
    // Video
    'Plan Video': 60,
    'Hire Crew': 45,
    'Film Video': 35,
    'Edit Video': 25,
    'Submit Video': 14,
    'Release Video': 0
  }
};

// Default template for EP releases
export const EP_TEMPLATE = {
  id: 'ep',
  name: 'EP',
  description: 'Extended timeline for EP releases (3-6 tracks)',
  offsets: {
    // Song Production (slightly longer for multiple tracks)
    'Demo': 120,
    'Arrangement': 105,
    'Record': 85,
    'Vocal Recording': 75,
    'Instrument Recording': 70,
    'Mix': 50,
    'Master': 28,
    'DSP Upload': 14,
    'Release': 0,
    // Stems
    'Receive Stems': 42,
    'Release Stems': 7,
    // Video
    'Plan Video': 75,
    'Hire Crew': 60,
    'Film Video': 45,
    'Edit Video': 35,
    'Submit Video': 14,
    'Release Video': 0,
    // Release Tasks
    'Complete All Tracks': 70,
    'Finalize Album Art': 50,
    'Submit Release': 14,
    // Physical (optional)
    'Submit Physical Design': 100,
    'Receive Physical Copies': 28,
    'Distribute Physical Copies': 10
  }
};

// Default template for Album releases
export const ALBUM_TEMPLATE = {
  id: 'album',
  name: 'Album',
  description: 'Full timeline for album releases (7+ tracks)',
  offsets: {
    // Song Production (longest timeline for full album)
    'Demo': 150,
    'Arrangement': 135,
    'Record': 105,
    'Vocal Recording': 90,
    'Instrument Recording': 85,
    'Mix': 60,
    'Master': 35,
    'DSP Upload': 14,
    'Release': 0,
    // Stems
    'Receive Stems': 50,
    'Release Stems': 7,
    // Video
    'Plan Video': 90,
    'Hire Crew': 75,
    'Film Video': 60,
    'Edit Video': 45,
    'Submit Video': 14,
    'Release Video': 0,
    // Release Tasks
    'Complete All Tracks': 90,
    'Finalize Album Art': 60,
    'Submit Release': 14,
    // Physical (optional)
    'Submit Physical Design': 120,
    'Receive Physical Copies': 35,
    'Distribute Physical Copies': 14
  }
};

// Version-specific tasks template
export const VERSION_TEMPLATE = {
  id: 'version',
  name: 'Song Version',
  description: 'Timeline for alternate song versions',
  offsets: {
    'Arrangement': 60,
    'Instrumentation': 50,
    'Mix': 30,
    'Master': 14,
    'Release': 0
  }
};

// All default templates
export const DEFAULT_TEMPLATES = {
  single: SINGLE_TEMPLATE,
  ep: EP_TEMPLATE,
  album: ALBUM_TEMPLATE,
  version: VERSION_TEMPLATE
};

/**
 * Get task offsets for a specific project type with user overrides
 * @param {Object} userSettings - User settings object containing custom offset overrides
 * @param {string} projectType - Project type: 'single', 'ep', 'album', 'version'
 * @returns {Object} Merged offset configuration
 */
export const getTaskOffsets = (userSettings = {}, projectType = 'single') => {
  // Get base template
  const baseTemplate = DEFAULT_TEMPLATES[projectType] || SINGLE_TEMPLATE;
  
  // Get user overrides for this project type
  const userTemplateOffsets = userSettings?.templateOffsets?.[projectType] || {};
  
  // Get global user overrides (legacy deadlineOffsets)
  const globalUserOffsets = userSettings?.deadlineOffsets || {};
  
  // Merge: base template < template-specific overrides < global overrides
  return {
    ...baseTemplate.offsets,
    ...userTemplateOffsets,
    ...globalUserOffsets
  };
};

/**
 * Get all available templates with user customizations applied
 * @param {Object} userSettings - User settings object
 * @returns {Array} Array of template objects with current offsets
 */
export const getAllTemplates = (userSettings = {}) => {
  return Object.keys(DEFAULT_TEMPLATES).map(key => {
    const template = DEFAULT_TEMPLATES[key];
    const offsets = getTaskOffsets(userSettings, key);
    return {
      ...template,
      offsets,
      isCustomized: JSON.stringify(offsets) !== JSON.stringify(template.offsets)
    };
  });
};

/**
 * Save template offsets to user settings
 * @param {Object} currentSettings - Current user settings
 * @param {string} templateId - Template ID (single, ep, album, version)
 * @param {Object} newOffsets - New offset values
 * @returns {Object} Updated settings object
 */
export const saveTemplateOffsets = (currentSettings = {}, templateId, newOffsets) => {
  return {
    ...currentSettings,
    templateOffsets: {
      ...(currentSettings.templateOffsets || {}),
      [templateId]: newOffsets
    }
  };
};

/**
 * Reset a template to default values
 * @param {Object} currentSettings - Current user settings
 * @param {string} templateId - Template ID to reset
 * @returns {Object} Updated settings object
 */
export const resetTemplate = (currentSettings = {}, templateId) => {
  const templateOffsets = { ...(currentSettings.templateOffsets || {}) };
  delete templateOffsets[templateId];
  
  return {
    ...currentSettings,
    templateOffsets
  };
};

/**
 * Detect appropriate template based on release metadata
 * @param {Object} release - Release object with tracks, type, etc.
 * @returns {string} Suggested template ID
 */
export const detectProjectType = (release) => {
  if (!release) return 'single';
  
  // Check explicit release type if available
  if (release.releaseType) {
    const type = release.releaseType.toLowerCase();
    if (type.includes('album')) return 'album';
    if (type.includes('ep')) return 'ep';
    if (type.includes('single')) return 'single';
  }
  
  // Infer from track count
  const trackCount = release.attachedSongIds?.length || release.requiredRecordings?.length || 0;
  
  if (trackCount >= 7) return 'album';
  if (trackCount >= 3) return 'ep';
  return 'single';
};
