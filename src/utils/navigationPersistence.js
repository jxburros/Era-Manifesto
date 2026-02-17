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
 * Navigation Persistence Layer
 * 
 * Provides comprehensive state persistence for navigation:
 * - Scroll position per route (in-memory + sessionStorage)
 * - Form draft state (sessionStorage)
 * - Navigation history management
 * 
 * Prevents loss of user input and position during navigation.
 */

const STORAGE_PREFIX = 'era_nav_';
const SCROLL_KEY = `${STORAGE_PREFIX}scroll`;
const FORM_KEY = `${STORAGE_PREFIX}form`;

// In-memory cache for fast access
const scrollCache = new Map();
const formCache = new Map();

/**
 * Save scroll position for a route
 * @param {string} routeKey - Unique route identifier
 * @param {number} position - Scroll position
 * @param {boolean} persistToSession - Whether to persist to sessionStorage
 */
export const saveScrollPosition = (routeKey, position, persistToSession = true) => {
  scrollCache.set(routeKey, position);
  
  if (persistToSession) {
    try {
      const allScrolls = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}');
      allScrolls[routeKey] = position;
      sessionStorage.setItem(SCROLL_KEY, JSON.stringify(allScrolls));
    } catch (error) {
      console.warn('Failed to persist scroll position to sessionStorage:', error);
    }
  }
};

/**
 * Get saved scroll position for a route
 * @param {string} routeKey - Unique route identifier
 * @returns {number} Scroll position (0 if not found)
 */
export const getScrollPosition = (routeKey) => {
  // Check in-memory cache first
  if (scrollCache.has(routeKey)) {
    return scrollCache.get(routeKey);
  }
  
  // Check sessionStorage
  try {
    const allScrolls = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}');
    const position = allScrolls[routeKey] || 0;
    if (position > 0) {
      scrollCache.set(routeKey, position);
    }
    return position;
  } catch (error) {
    return 0;
  }
};

/**
 * Clear scroll position for a route
 * @param {string} routeKey - Unique route identifier
 */
export const clearScrollPosition = (routeKey) => {
  scrollCache.delete(routeKey);
  
  try {
    const allScrolls = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}');
    delete allScrolls[routeKey];
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(allScrolls));
  } catch (error) {
    console.warn('Failed to clear scroll position from sessionStorage:', error);
  }
};

/**
 * Clear all scroll positions
 */
export const clearAllScrollPositions = () => {
  scrollCache.clear();
  try {
    sessionStorage.removeItem(SCROLL_KEY);
  } catch (error) {
    console.warn('Failed to clear all scroll positions:', error);
  }
};

/**
 * Save form draft state
 * @param {string} formKey - Unique form identifier (e.g., 'song-create', 'song-edit-123')
 * @param {Object} formData - Form data to save
 * @param {number} ttl - Time to live in milliseconds (default: 1 hour)
 */
export const saveFormDraft = (formKey, formData, ttl = 3600000) => {
  const draft = {
    data: formData,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttl
  };
  
  formCache.set(formKey, draft);
  
  try {
    const allForms = JSON.parse(sessionStorage.getItem(FORM_KEY) || '{}');
    allForms[formKey] = draft;
    sessionStorage.setItem(FORM_KEY, JSON.stringify(allForms));
  } catch (error) {
    console.warn('Failed to persist form draft to sessionStorage:', error);
  }
};

/**
 * Get saved form draft
 * @param {string} formKey - Unique form identifier
 * @returns {Object|null} Form data or null if not found/expired
 */
export const getFormDraft = (formKey) => {
  // Check in-memory cache first
  if (formCache.has(formKey)) {
    const draft = formCache.get(formKey);
    if (Date.now() < draft.expiresAt) {
      return draft.data;
    } else {
      // Expired, remove it
      formCache.delete(formKey);
    }
  }
  
  // Check sessionStorage
  try {
    const allForms = JSON.parse(sessionStorage.getItem(FORM_KEY) || '{}');
    const draft = allForms[formKey];
    
    if (draft && Date.now() < draft.expiresAt) {
      formCache.set(formKey, draft);
      return draft.data;
    } else if (draft) {
      // Expired, clean up
      delete allForms[formKey];
      sessionStorage.setItem(FORM_KEY, JSON.stringify(allForms));
    }
  } catch (error) {
    console.warn('Failed to retrieve form draft from sessionStorage:', error);
  }
  
  return null;
};

/**
 * Clear form draft
 * @param {string} formKey - Unique form identifier
 */
export const clearFormDraft = (formKey) => {
  formCache.delete(formKey);
  
  try {
    const allForms = JSON.parse(sessionStorage.getItem(FORM_KEY) || '{}');
    delete allForms[formKey];
    sessionStorage.setItem(FORM_KEY, JSON.stringify(allForms));
  } catch (error) {
    console.warn('Failed to clear form draft from sessionStorage:', error);
  }
};

/**
 * Check if a form draft exists
 * @param {string} formKey - Unique form identifier
 * @returns {boolean} True if draft exists and is not expired
 */
export const hasFormDraft = (formKey) => {
  const draft = getFormDraft(formKey);
  return draft !== null;
};

/**
 * Get all active form drafts
 * @returns {Object} Map of form keys to draft data
 */
export const getAllFormDrafts = () => {
  const activeDrafts = {};
  
  try {
    const allForms = JSON.parse(sessionStorage.getItem(FORM_KEY) || '{}');
    const now = Date.now();
    
    for (const [key, draft] of Object.entries(allForms)) {
      if (draft && now < draft.expiresAt) {
        activeDrafts[key] = draft.data;
      }
    }
  } catch (error) {
    console.warn('Failed to retrieve form drafts:', error);
  }
  
  return activeDrafts;
};

/**
 * Clear all expired form drafts
 * @returns {number} Number of drafts cleared
 */
export const clearExpiredFormDrafts = () => {
  let clearedCount = 0;
  
  try {
    const allForms = JSON.parse(sessionStorage.getItem(FORM_KEY) || '{}');
    const now = Date.now();
    const updatedForms = {};
    
    for (const [key, draft] of Object.entries(allForms)) {
      if (draft && now < draft.expiresAt) {
        updatedForms[key] = draft;
      } else {
        clearedCount++;
        formCache.delete(key);
      }
    }
    
    sessionStorage.setItem(FORM_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.warn('Failed to clear expired form drafts:', error);
  }
  
  return clearedCount;
};

/**
 * Clear all form drafts
 */
export const clearAllFormDrafts = () => {
  formCache.clear();
  try {
    sessionStorage.removeItem(FORM_KEY);
  } catch (error) {
    console.warn('Failed to clear all form drafts:', error);
  }
};

/**
 * Create a unique form key for an entity
 * @param {string} entityType - Type of entity (e.g., 'song', 'release')
 * @param {string} action - Action type ('create', 'edit')
 * @param {string} id - Entity ID (for edit actions)
 * @returns {string} Unique form key
 */
export const createFormKey = (entityType, action, id = null) => {
  return id ? `${entityType}-${action}-${id}` : `${entityType}-${action}`;
};

/**
 * Auto-save form data with debouncing
 * @param {string} formKey - Form identifier
 * @param {Object} formData - Current form data
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 500ms)
 * @returns {Function} Cleanup function
 */
let autoSaveTimers = new Map();

export const autoSaveForm = (formKey, formData, debounceMs = 500) => {
  // Clear existing timer for this form
  if (autoSaveTimers.has(formKey)) {
    clearTimeout(autoSaveTimers.get(formKey));
  }
  
  // Set new timer
  const timer = setTimeout(() => {
    saveFormDraft(formKey, formData);
    autoSaveTimers.delete(formKey);
  }, debounceMs);
  
  autoSaveTimers.set(formKey, timer);
  
  // Return cleanup function
  return () => {
    if (autoSaveTimers.has(formKey)) {
      clearTimeout(autoSaveTimers.get(formKey));
      autoSaveTimers.delete(formKey);
    }
  };
};

/**
 * Navigation state persistence (for maintaining tab states, filter selections, etc.)
 */
const NAV_STATE_KEY = `${STORAGE_PREFIX}nav_state`;
const navStateCache = new Map();

/**
 * Save navigation state for a route
 * @param {string} routeKey - Route identifier
 * @param {Object} state - State to save
 */
export const saveNavigationState = (routeKey, state) => {
  navStateCache.set(routeKey, state);
  
  try {
    const allStates = JSON.parse(sessionStorage.getItem(NAV_STATE_KEY) || '{}');
    allStates[routeKey] = state;
    sessionStorage.setItem(NAV_STATE_KEY, JSON.stringify(allStates));
  } catch (error) {
    console.warn('Failed to persist navigation state:', error);
  }
};

/**
 * Get navigation state for a route
 * @param {string} routeKey - Route identifier
 * @returns {Object|null} Saved state or null
 */
export const getNavigationState = (routeKey) => {
  if (navStateCache.has(routeKey)) {
    return navStateCache.get(routeKey);
  }
  
  try {
    const allStates = JSON.parse(sessionStorage.getItem(NAV_STATE_KEY) || '{}');
    const state = allStates[routeKey] || null;
    if (state) {
      navStateCache.set(routeKey, state);
    }
    return state;
  } catch (error) {
    return null;
  }
};

/**
 * Clear navigation state for a route
 * @param {string} routeKey - Route identifier
 */
export const clearNavigationState = (routeKey) => {
  navStateCache.delete(routeKey);
  
  try {
    const allStates = JSON.parse(sessionStorage.getItem(NAV_STATE_KEY) || '{}');
    delete allStates[routeKey];
    sessionStorage.setItem(NAV_STATE_KEY, JSON.stringify(allStates));
  } catch (error) {
    console.warn('Failed to clear navigation state:', error);
  }
};

/**
 * Initialize navigation persistence
 * Call this on app mount to clean up expired data
 */
export const initNavigationPersistence = () => {
  clearExpiredFormDrafts();
};
