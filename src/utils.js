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

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatMoney = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Phase 10: Dark mode variants
export const THEME = {
  punk: {
    font: "font-mono",
    border: "border-4 border-black dark:border-slate-600",
    rounded: "rounded-none",
    shadow: "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(100,116,139,1)]",
    textStyle: "uppercase font-black tracking-widest",
      btn: "border-[3px] border-black dark:border-slate-600 font-black uppercase tracking-widest hover:-translate-y-1 active:translate-y-0 transition-transform bg-white dark:bg-slate-700 dark:text-slate-50 hover:bg-[var(--accent-soft)] dark:hover:bg-slate-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]",
      input: "border-[3px] border-black dark:border-slate-600 font-bold px-3 py-2.5 rounded-none focus:ring-0 focus:border-[var(--accent-strong)] dark:focus:border-[var(--accent)] outline-none bg-white dark:bg-slate-800 dark:text-slate-50 placeholder:opacity-60 disabled:opacity-60 disabled:cursor-not-allowed transition-colors",
      inputCompact: "border-[3px] border-black dark:border-slate-600 font-bold px-2 py-1.5 rounded-none focus:ring-0 focus:border-[var(--accent-strong)] dark:focus:border-[var(--accent)] outline-none bg-white dark:bg-slate-800 dark:text-slate-50 placeholder:opacity-60 disabled:opacity-60 disabled:cursor-not-allowed transition-colors",
      card: "bg-[var(--accent-soft)] dark:bg-slate-800 border-[3px] border-black dark:border-slate-600 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-[6px_6px_0px_0px_rgba(100,116,139,0.85)]"
    }
  };

export const COLORS = {
  pink: 'bg-pink-500 border-pink-500 text-pink-500',
  cyan: 'bg-cyan-400 border-cyan-400 text-cyan-400',
  lime: 'bg-lime-400 border-lime-400 text-lime-600',
  violet: 'bg-violet-500 border-violet-500 text-violet-500',
};

export const COLOR_VALUES = {
  pink: { base: '#ec4899', strong: '#be185d', soft: '#fdf2f8' },
  cyan: { base: '#22d3ee', strong: '#0ea5e9', soft: '#ecfeff' },
  lime: { base: '#a3e635', strong: '#65a30d', soft: '#f7fee7' },
  violet: { base: '#8b5cf6', strong: '#6d28d9', soft: '#f5f3ff' },
};

export const STAGES = {
  todo: { label: 'Not Started', icon: 'Circle' },
  in_progress: { label: 'In Progress', icon: 'PlayCircle' },
  review: { label: 'Review', icon: 'Activity' },
  done: { label: 'Done', icon: 'CheckCircle' }
};

// Task budget resolver - returns the best available cost value
// Priority: paidCost > actualCost > quotedCost > estimatedCost
export const getTaskBudget = (task = {}) => {
  if (task.paidCost !== undefined && task.paidCost > 0) return task.paidCost;
  if (task.actualCost !== undefined && task.actualCost > 0) return task.actualCost;
  if (task.quotedCost !== undefined && task.quotedCost > 0) return task.quotedCost;
  return task.estimatedCost || 0;
};

// Status filter helper - combine multiple filter criteria into single pass
export const filterTasksByStatus = (tasks = [], activeStatus = 'all', archivedFilter = 'all') => {
  if (!Array.isArray(tasks)) return [];

  return tasks.filter(t => {
    // Filter archived status
    if (archivedFilter === 'active' && (t.isArchived || t.status === 'Done' || t.status === 'Complete')) {
      return false;
    }
    // Filter by specific status
    if (activeStatus !== 'all' && t.status !== activeStatus) {
      return false;
    }
    return true;
  });
};

/**
 * Scroll Position Persistence Utility
 * Saves and restores scroll positions for specific routes/views
 * 
 * Note: Enhanced version available in utils/navigationPersistence.js
 * This is kept for backwards compatibility
 */

// In-memory fallback for environments without sessionStorage
const SCROLL_POSITIONS = new Map();
const FORM_DRAFTS = new Map();

/**
 * Save scroll position to sessionStorage and memory
 * @param {string} key - Unique key for the scroll position (e.g., route path + entity ID)
 * @param {number} position - Scroll position in pixels
 */
export const saveScrollPosition = (key, position) => {
  SCROLL_POSITIONS.set(key, position);
  try {
    sessionStorage.setItem(`scroll:${key}`, String(position));
  } catch (e) {
    // sessionStorage not available or quota exceeded
    console.warn('Failed to save scroll position to sessionStorage:', e);
  }
};

/**
 * Get scroll position from sessionStorage or memory
 * @param {string} key - Unique key for the scroll position
 * @returns {number} Scroll position in pixels
 */
export const getScrollPosition = (key) => {
  // Try sessionStorage first
  try {
    const stored = sessionStorage.getItem(`scroll:${key}`);
    if (stored !== null) {
      const position = Number(stored);
      if (Number.isFinite(position)) {
        SCROLL_POSITIONS.set(key, position); // Update memory cache
        return position;
      }
    }
  } catch (e) {
    // sessionStorage not available
  }
  
  // Fallback to memory
  return SCROLL_POSITIONS.get(key) || 0;
};

/**
 * Clear scroll position from both sessionStorage and memory
 * @param {string} key - Unique key for the scroll position
 */
export const clearScrollPosition = (key) => {
  SCROLL_POSITIONS.delete(key);
  try {
    sessionStorage.removeItem(`scroll:${key}`);
  } catch (e) {
    // Ignore
  }
};

/**
 * Save form draft state to sessionStorage and memory
 * @param {string} key - Unique key for the form (e.g., 'song-detail-123')
 * @param {Object} formData - Form state to save
 */
export const saveFormDraft = (key, formData) => {
  const serialized = JSON.stringify(formData);
  FORM_DRAFTS.set(key, serialized);
  try {
    sessionStorage.setItem(`draft:${key}`, serialized);
  } catch (e) {
    console.warn('Failed to save form draft to sessionStorage:', e);
  }
};

/**
 * Get form draft state from sessionStorage or memory
 * @param {string} key - Unique key for the form
 * @returns {Object|null} Form state or null if not found
 */
export const getFormDraft = (key) => {
  // Try sessionStorage first
  try {
    const stored = sessionStorage.getItem(`draft:${key}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      FORM_DRAFTS.set(key, stored); // Update memory cache
      return parsed;
    }
  } catch (e) {
    // sessionStorage not available or invalid JSON
    console.warn('Failed to get form draft from sessionStorage:', e);
  }
  
  // Fallback to memory
  try {
    const cached = FORM_DRAFTS.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    return null;
  }
};

/**
 * Clear form draft from both sessionStorage and memory
 * @param {string} key - Unique key for the form
 */
export const clearFormDraft = (key) => {
  FORM_DRAFTS.delete(key);
  try {
    sessionStorage.removeItem(`draft:${key}`);
  } catch (e) {
    // Ignore
  }
};

/**
 * Clear all form drafts for a specific route/pattern
 * @param {string} pattern - Pattern to match (e.g., 'song-detail-' clears all song detail drafts)
 */
export const clearFormDraftsPattern = (pattern) => {
  // Clear from memory
  const keysToDelete = [];
  for (const key of FORM_DRAFTS.keys()) {
    if (key.startsWith(pattern)) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(key => FORM_DRAFTS.delete(key));
  
  // Clear from sessionStorage
  try {
    const toRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(`draft:${pattern}`)) {
        toRemove.push(key);
      }
    }
    toRemove.forEach(key => sessionStorage.removeItem(key));
  } catch (e) {
    // Ignore
  }
};

/**
 * Check if a form draft exists for a key
 * @param {string} key - Unique key for the form
 * @returns {boolean} True if draft exists
 */
export const hasFormDraft = (key) => {
  try {
    return sessionStorage.getItem(`draft:${key}`) !== null || FORM_DRAFTS.has(key);
  } catch (e) {
    return FORM_DRAFTS.has(key);
  }
};

/**
 * Semantic Color Overlays for Task Status
 * Provides consistent color scheme based on task status and due date
 * Returns object with border, background, and text color classes
 */
export const getTaskStatusColors = (status, dueDate) => {
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = dueDate && dueDate < today;
  const isComplete = status === 'Done' || status === 'Complete';
  
  // Priority 1: Overdue (Red)
  if (isOverdue && !isComplete) {
    return {
      border: 'border-red-500 dark:border-red-600',
      borderThick: 'border-l-4 border-red-500 dark:border-red-600',
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-800 dark:text-red-200',
      badge: 'bg-red-100 text-red-800 border-red-500',
      ring: 'ring-red-500'
    };
  }
  
  // Priority 2: Complete (Green)
  if (isComplete) {
    return {
      border: 'border-green-500 dark:border-green-600',
      borderThick: 'border-l-4 border-green-500 dark:border-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-800 dark:text-green-200',
      badge: 'bg-green-100 text-green-800 border-green-500',
      ring: 'ring-green-500'
    };
  }
  
  // Priority 3: In Progress (Blue)
  if (status === 'In Progress' || status === 'In-Progress') {
    return {
      border: 'border-blue-500 dark:border-blue-600',
      borderThick: 'border-l-4 border-blue-500 dark:border-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-800 dark:text-blue-200',
      badge: 'bg-blue-100 text-blue-800 border-blue-500',
      ring: 'ring-blue-500'
    };
  }
  
  // Priority 4: Delayed (Orange)
  if (status === 'Delayed') {
    return {
      border: 'border-orange-500 dark:border-orange-600',
      borderThick: 'border-l-4 border-orange-500 dark:border-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-800 dark:text-orange-200',
      badge: 'bg-orange-100 text-orange-800 border-orange-500',
      ring: 'ring-orange-500'
    };
  }
  
  // Default: Not Started (Gray)
  return {
    border: 'border-gray-300 dark:border-gray-600',
    borderThick: 'border-l-4 border-gray-300 dark:border-gray-600',
    bg: 'bg-gray-50 dark:bg-gray-800/20',
    text: 'text-gray-800 dark:text-gray-200',
    badge: 'bg-gray-100 text-gray-800 border-gray-400',
    ring: 'ring-gray-400'
  };
};
