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
 * Memoization Utilities for Performance Optimization
 * 
 * Provides memoized selectors for expensive calculations:
 * - Total budget calculations
 * - Aggregate progress metrics
 * - Financial summaries
 * - Task statistics
 * 
 * Prevents unnecessary recomputation on unrelated state updates.
 */

import { getEffectiveCost, calculateTaskProgress } from '../domain/taskLogic.js';

// Simple memoization cache with dependency tracking
class MemoCache {
  constructor() {
    this.cache = new Map();
  }

  get(key, dependencies, computeFn) {
    const cached = this.cache.get(key);
    
    if (cached && this.dependenciesMatch(cached.dependencies, dependencies)) {
      return cached.value;
    }
    
    const value = computeFn();
    this.cache.set(key, { value, dependencies: [...dependencies] });
    return value;
  }

  dependenciesMatch(deps1, deps2) {
    if (deps1.length !== deps2.length) return false;
    return deps1.every((dep, i) => dep === deps2[i]);
  }

  clear() {
    this.cache.clear();
  }

  clearKey(key) {
    this.cache.delete(key);
  }
}

const memoCache = new MemoCache();

/**
 * Calculate total budget across all entities
 * @param {Object} data - Application data
 * @param {string} costModel - Cost model to use
 * @returns {Object} Budget totals by category
 */
export const calculateTotalBudget = (data = {}, costModel = 'actual-first') => {
  const cacheKey = 'totalBudget';
  const dependencies = [
    JSON.stringify(data.songs?.map(s => s.id + s.estimated_cost + s.amount_paid)),
    JSON.stringify(data.releases?.map(r => r.id + r.estimated_cost + r.amount_paid)),
    JSON.stringify(data.videos?.map(v => v.id + v.estimated_cost + v.amount_paid)),
    JSON.stringify(data.events?.map(e => e.id + e.estimated_cost + e.amount_paid)),
    JSON.stringify(data.globalTasks?.map(t => t.id + t.estimated_cost + t.amount_paid)),
    JSON.stringify(data.expenses?.map(e => e.id + e.estimated_cost + e.amount_paid)),
    costModel
  ];

  return memoCache.get(cacheKey, dependencies, () => {
    const categories = {
      songs: 0,
      releases: 0,
      videos: 0,
      events: 0,
      globalTasks: 0,
      expenses: 0,
      total: 0
    };

    const processEntity = (entity) => getEffectiveCost(entity);

    categories.songs = (data.songs || []).reduce((sum, song) => sum + processEntity(song), 0);
    categories.releases = (data.releases || []).reduce((sum, release) => sum + processEntity(release), 0);
    categories.videos = (data.videos || []).reduce((sum, video) => sum + processEntity(video), 0);
    categories.events = (data.events || []).reduce((sum, event) => sum + processEntity(event), 0);
    categories.globalTasks = (data.globalTasks || []).reduce((sum, task) => sum + processEntity(task), 0);
    categories.expenses = (data.expenses || []).reduce((sum, expense) => sum + processEntity(expense), 0);

    categories.total = Object.values(categories).reduce((sum, val) => sum + val, 0) - categories.total;

    return categories;
  });
};

/**
 * Calculate aggregate progress across all tasks
 * @param {Object} data - Application data
 * @returns {Object} Progress metrics
 */
export const calculateAggregateProgress = (data = {}) => {
  const cacheKey = 'aggregateProgress';
  const dependencies = [
    JSON.stringify(data.songs?.map(s => s.id + JSON.stringify(s.tasks?.map(t => t.status)))),
    JSON.stringify(data.releases?.map(r => r.id + JSON.stringify(r.tasks?.map(t => t.status)))),
    JSON.stringify(data.videos?.map(v => v.id + JSON.stringify(v.tasks?.map(t => t.status)))),
    JSON.stringify(data.events?.map(e => e.id + JSON.stringify(e.tasks?.map(t => t.status)))),
    JSON.stringify(data.globalTasks?.map(t => t.id + t.status))
  ];

  return memoCache.get(cacheKey, dependencies, () => {
    const allTasks = [];

    // Collect all tasks from all entities
    (data.songs || []).forEach(song => {
      if (song.tasks) allTasks.push(...song.tasks);
      if (song.versions) {
        song.versions.forEach(version => {
          if (version.tasks) allTasks.push(...version.tasks);
        });
      }
    });

    (data.releases || []).forEach(release => {
      if (release.tasks) allTasks.push(...release.tasks);
    });

    (data.videos || []).forEach(video => {
      if (video.tasks) allTasks.push(...video.tasks);
    });

    (data.events || []).forEach(event => {
      if (event.tasks) allTasks.push(...event.tasks);
    });

    if (data.globalTasks) {
      allTasks.push(...data.globalTasks);
    }

    const progressData = calculateTaskProgress(allTasks);

    return {
      ...progressData,
      completedTasks: allTasks.filter(t => t.status === 'Complete' || t.status === 'Done').length,
      inProgressTasks: allTasks.filter(t => t.status === 'In-Progress' || t.status === 'In Progress').length,
      notStartedTasks: allTasks.filter(t => t.status === 'Not Started').length
    };
  });
};

/**
 * Calculate financial summary with budget vs actual comparison
 * @param {Object} data - Application data
 * @param {string} costModel - Cost model to use
 * @returns {Object} Financial summary
 */
export const calculateFinancialSummary = (data = {}, costModel = 'actual-first') => {
  const cacheKey = 'financialSummary';
  const dependencies = [
    JSON.stringify(data.songs?.map(s => s.id + s.estimated_cost + s.quoted_cost + s.amount_paid)),
    JSON.stringify(data.releases?.map(r => r.id + r.estimated_cost + r.quoted_cost + r.amount_paid)),
    JSON.stringify(data.videos?.map(v => v.id + v.estimated_cost + v.quoted_cost + v.amount_paid)),
    JSON.stringify(data.events?.map(e => e.id + e.estimated_cost + e.quoted_cost + e.amount_paid)),
    JSON.stringify(data.globalTasks?.map(t => t.id + t.estimated_cost + t.quoted_cost + t.amount_paid)),
    JSON.stringify(data.expenses?.map(e => e.id + e.estimated_cost + e.quoted_cost + e.amount_paid)),
    costModel
  ];

  return memoCache.get(cacheKey, dependencies, () => {
    const entities = [
      ...(data.songs || []),
      ...(data.releases || []),
      ...(data.videos || []),
      ...(data.events || []),
      ...(data.globalTasks || []),
      ...(data.expenses || [])
    ];

    const summary = {
      totalEstimated: 0,
      totalQuoted: 0,
      totalPaid: 0,
      totalEffective: 0,
      variance: 0,
      variancePercent: 0,
      itemCount: entities.length
    };

    entities.forEach(entity => {
      const estimated = entity.estimated_cost || entity.estimatedCost || 0;
      const quoted = entity.quoted_cost || entity.quotedCost || 0;
      const paid = entity.amount_paid || entity.paidCost || entity.amountPaid || 0;

      summary.totalEstimated += estimated;
      summary.totalQuoted += quoted;
      summary.totalPaid += paid;
      summary.totalEffective += getEffectiveCost(entity);
    });

    summary.variance = summary.totalEffective - summary.totalEstimated;
    summary.variancePercent = summary.totalEstimated > 0
      ? Math.round((summary.variance / summary.totalEstimated) * 100)
      : 0;

    return summary;
  });
};

/**
 * Calculate task statistics by status
 * @param {Object} data - Application data
 * @returns {Object} Task statistics
 */
export const calculateTaskStatistics = (data = {}) => {
  const cacheKey = 'taskStatistics';
  const dependencies = [
    JSON.stringify(data.songs?.map(s => s.id + JSON.stringify(s.tasks?.map(t => t.status)))),
    JSON.stringify(data.releases?.map(r => r.id + JSON.stringify(r.tasks?.map(t => t.status)))),
    JSON.stringify(data.videos?.map(v => v.id + JSON.stringify(v.tasks?.map(t => t.status)))),
    JSON.stringify(data.events?.map(e => e.id + JSON.stringify(e.tasks?.map(t => t.status)))),
    JSON.stringify(data.globalTasks?.map(t => t.id + t.status))
  ];

  return memoCache.get(cacheKey, dependencies, () => {
    const allTasks = [];

    // Collect all tasks
    (data.songs || []).forEach(song => {
      if (song.tasks) allTasks.push(...song.tasks);
      if (song.versions) {
        song.versions.forEach(version => {
          if (version.tasks) allTasks.push(...version.tasks);
        });
      }
    });

    (data.releases || []).forEach(release => {
      if (release.tasks) allTasks.push(...release.tasks);
    });

    (data.videos || []).forEach(video => {
      if (video.tasks) allTasks.push(...video.tasks);
    });

    (data.events || []).forEach(event => {
      if (event.tasks) allTasks.push(...event.tasks);
    });

    if (data.globalTasks) {
      allTasks.push(...data.globalTasks);
    }

    const stats = {
      total: allTasks.length,
      complete: 0,
      inProgress: 0,
      notStarted: 0,
      waiting: 0,
      delayed: 0,
      other: 0,
      byStatus: {}
    };

    allTasks.forEach(task => {
      const status = task.status || 'Not Started';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      if (status === 'Complete' || status === 'Done') stats.complete++;
      else if (status === 'In-Progress' || status === 'In Progress') stats.inProgress++;
      else if (status === 'Not Started') stats.notStarted++;
      else if (status === 'Waiting on Someone Else') stats.waiting++;
      else if (status === 'Delayed') stats.delayed++;
      else stats.other++;
    });

    return stats;
  });
};

/**
 * Calculate entity counts by type
 * @param {Object} data - Application data
 * @returns {Object} Entity counts
 */
export const calculateEntityCounts = (data = {}) => {
  const cacheKey = 'entityCounts';
  const dependencies = [
    data.songs?.length || 0,
    data.releases?.length || 0,
    data.videos?.length || 0,
    data.events?.length || 0,
    data.globalTasks?.length || 0,
    data.expenses?.length || 0,
    data.teamMembers?.length || 0,
    data.eras?.length || 0
  ];

  return memoCache.get(cacheKey, dependencies, () => ({
    songs: data.songs?.length || 0,
    releases: data.releases?.length || 0,
    videos: data.videos?.length || 0,
    events: data.events?.length || 0,
    globalTasks: data.globalTasks?.length || 0,
    expenses: data.expenses?.length || 0,
    teamMembers: data.teamMembers?.length || 0,
    eras: data.eras?.length || 0
  }));
};

/**
 * Clear all memoization caches
 * Call this when you want to force recomputation
 */
export const clearMemoizationCache = () => {
  memoCache.clear();
};

/**
 * Clear specific memoization cache
 * @param {string} key - Cache key to clear
 */
export const clearMemoizationCacheKey = (key) => {
  memoCache.clearKey(key);
};
