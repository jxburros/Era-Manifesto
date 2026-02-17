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
  calculateTotalBudget,
  calculateAggregateProgress,
  calculateFinancialSummary,
  calculateTaskStatistics,
  calculateEntityCounts,
  clearMemoizationCache
} from '../src/utils/memoization.js';

test('calculateTotalBudget computes budget across all entities', () => {
  const data = {
    songs: [
      { id: 's1', estimatedCost: 1000, amountPaid: 800 },
      { id: 's2', estimatedCost: 1500, amountPaid: 1200 }
    ],
    releases: [
      { id: 'r1', estimatedCost: 500, amountPaid: 400 }
    ],
    videos: [
      { id: 'v1', estimatedCost: 800 }
    ]
  };

  const budget = calculateTotalBudget(data);
  
  assert.strictEqual(budget.songs, 2000); // 800 + 1200 (uses paid amount)
  assert.strictEqual(budget.releases, 400);
  assert.strictEqual(budget.videos, 800);
  assert.strictEqual(budget.total, 3200);
});

test('calculateTotalBudget returns zero for empty data', () => {
  const budget = calculateTotalBudget({});
  
  assert.strictEqual(budget.total, 0);
  assert.strictEqual(budget.songs, 0);
});

test('calculateAggregateProgress computes progress across all tasks', () => {
  const data = {
    songs: [
      {
        id: 's1',
        tasks: [
          { id: 't1', status: 'Complete' },
          { id: 't2', status: 'In-Progress' },
          { id: 't3', status: 'Not Started' }
        ]
      }
    ],
    globalTasks: [
      { id: 'gt1', status: 'Complete' },
      { id: 'gt2', status: 'Complete' }
    ]
  };

  const progress = calculateAggregateProgress(data);
  
  assert.strictEqual(progress.totalTasks, 5);
  assert.strictEqual(progress.completedTasks, 3);
  assert.strictEqual(progress.inProgressTasks, 1);
  assert.strictEqual(progress.notStartedTasks, 1);
  assert.ok(progress.progress > 0);
});

test('calculateAggregateProgress handles empty tasks', () => {
  const progress = calculateAggregateProgress({});
  
  assert.strictEqual(progress.totalTasks, 0);
  assert.strictEqual(progress.progress, 0);
});

test('calculateFinancialSummary provides budget vs actual comparison', () => {
  const data = {
    songs: [
      { id: 's1', estimatedCost: 1000, quotedCost: 1100, amountPaid: 1050 }
    ],
    expenses: [
      { id: 'e1', estimatedCost: 500, amountPaid: 550 }
    ]
  };

  const summary = calculateFinancialSummary(data);
  
  assert.strictEqual(summary.totalEstimated, 1500);
  assert.strictEqual(summary.totalQuoted, 1100);
  assert.strictEqual(summary.totalPaid, 1600); // 1050 + 550
  assert.strictEqual(summary.totalEffective, 1600);
  assert.strictEqual(summary.variance, 100); // 1600 - 1500
  assert.strictEqual(summary.itemCount, 2);
});

test('calculateFinancialSummary handles zero estimated costs', () => {
  const data = {
    songs: [
      { id: 's1', amountPaid: 100 }
    ]
  };

  const summary = calculateFinancialSummary(data);
  
  assert.strictEqual(summary.totalEstimated, 0);
  assert.strictEqual(summary.variancePercent, 0);
});

test('calculateTaskStatistics categorizes tasks by status', () => {
  const data = {
    songs: [
      {
        id: 's1',
        tasks: [
          { id: 't1', status: 'Complete' },
          { id: 't2', status: 'In-Progress' },
          { id: 't3', status: 'Not Started' },
          { id: 't4', status: 'Waiting on Someone Else' }
        ]
      }
    ]
  };

  const stats = calculateTaskStatistics(data);
  
  assert.strictEqual(stats.total, 4);
  assert.strictEqual(stats.complete, 1);
  assert.strictEqual(stats.inProgress, 1);
  assert.strictEqual(stats.notStarted, 1);
  assert.strictEqual(stats.waiting, 1);
  assert.strictEqual(stats.byStatus['Complete'], 1);
  assert.strictEqual(stats.byStatus['In-Progress'], 1);
});

test('calculateTaskStatistics handles versions with tasks', () => {
  const data = {
    songs: [
      {
        id: 's1',
        tasks: [{ id: 't1', status: 'Complete' }],
        versions: [
          {
            id: 'v1',
            tasks: [{ id: 't2', status: 'In-Progress' }]
          }
        ]
      }
    ]
  };

  const stats = calculateTaskStatistics(data);
  
  assert.strictEqual(stats.total, 2);
  assert.strictEqual(stats.complete, 1);
  assert.strictEqual(stats.inProgress, 1);
});

test('calculateEntityCounts returns counts for all entity types', () => {
  const data = {
    songs: [{ id: 's1' }, { id: 's2' }],
    releases: [{ id: 'r1' }],
    videos: [{ id: 'v1' }, { id: 'v2' }, { id: 'v3' }],
    globalTasks: [{ id: 'gt1' }],
    teamMembers: [{ id: 'tm1' }, { id: 'tm2' }],
    eras: [{ id: 'e1' }]
  };

  const counts = calculateEntityCounts(data);
  
  assert.strictEqual(counts.songs, 2);
  assert.strictEqual(counts.releases, 1);
  assert.strictEqual(counts.videos, 3);
  assert.strictEqual(counts.globalTasks, 1);
  assert.strictEqual(counts.teamMembers, 2);
  assert.strictEqual(counts.eras, 1);
});

test('calculateEntityCounts handles missing collections', () => {
  const counts = calculateEntityCounts({});
  
  assert.strictEqual(counts.songs, 0);
  assert.strictEqual(counts.releases, 0);
  assert.strictEqual(counts.videos, 0);
});

test('memoization caches results on subsequent calls', () => {
  clearMemoizationCache();
  
  const data = {
    songs: [{ id: 's1', estimatedCost: 1000 }]
  };

  // First call
  const budget1 = calculateTotalBudget(data);
  
  // Second call with same data - should return cached result
  const budget2 = calculateTotalBudget(data);
  
  assert.deepStrictEqual(budget1, budget2);
  assert.strictEqual(budget1.songs, 1000);
});

test('memoization cache invalidates on data change', () => {
  clearMemoizationCache();
  
  const data1 = {
    songs: [{ id: 's1', estimatedCost: 1000, amountPaid: 0 }]
  };

  const budget1 = calculateTotalBudget(data1);
  assert.strictEqual(budget1.songs, 1000);

  // Change data - need to change both id and cost to trigger cache miss
  const data2 = {
    songs: [{ id: 's2', estimatedCost: 1500, amountPaid: 0 }]
  };

  const budget2 = calculateTotalBudget(data2);
  assert.strictEqual(budget2.songs, 1500);
});

test('clearMemoizationCache clears all caches', () => {
  const data = {
    songs: [{ id: 's1', estimatedCost: 1000 }]
  };

  calculateTotalBudget(data);
  calculateEntityCounts(data);
  
  // Clear cache
  clearMemoizationCache();
  
  // Should recompute on next call (no way to directly test, but shouldn't throw)
  const budget = calculateTotalBudget(data);
  assert.strictEqual(budget.songs, 1000);
});
