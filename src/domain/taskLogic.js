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

export const STATUS_OPTIONS = [
  'Not Started',
  'In-Progress',
  'Waiting on Someone Else',
  'Paid But Not Complete',
  'Complete But Not Paid',
  'Complete',
  'Other'
];

export const STATUS_POINTS = {
  Complete: 1,
  Done: 1,
  'In-Progress': 0.5,
  'In Progress': 0.5,
  'Waiting on Someone Else': 0.5,
  'Paid But Not Complete': 0.5,
  'Complete But Not Paid': 0.5,
  'Not Started': 0,
  Other: 0,
  Delayed: 0,
  default: 0
};

export const getStatusPoints = (status) => {
  if (!status) return 0;
  return STATUS_POINTS[status] ?? STATUS_POINTS.default;
};

export const calculateTaskProgress = (tasks = []) => {
  if (!tasks.length) return { pointsEarned: 0, totalTasks: 0, progress: 0 };

  const pointsEarned = tasks.reduce((sum, task) => sum + getStatusPoints(task.status), 0);
  const progress = Math.round((pointsEarned / tasks.length) * 100);

  return { pointsEarned, totalTasks: tasks.length, progress };
};

export const getTaskDueDate = (task = {}) => task.due_date || task.dueDate || task.date || '';

export const getPrimaryDate = (item = {}, releases = [], extraReleaseIds = [], releaseMap = null) => {
  if (!item) return '';
  if (item.primary_date) return item.primary_date;
  if (item.primaryDate) return item.primaryDate;
  if (item.primaryDateOverride) return item.primaryDateOverride;
  if (item.releaseDate) return item.releaseDate;

  const overrideDates = item.releaseOverrides ? Object.values(item.releaseOverrides).filter(Boolean) : [];
  if (overrideDates.length > 0) return overrideDates.sort()[0];

  const collectedReleaseIds = [
    ...(item.coreReleaseId ? [item.coreReleaseId] : []),
    ...(item.releaseIds || []),
    ...extraReleaseIds
  ];

  const map = releaseMap || new Map(releases.map(r => [r.id, r]));
  const releaseDates = collectedReleaseIds
    .map(id => map.get(id)?.releaseDate)
    .filter(Boolean)
    .sort();

  if (releaseDates.length > 0) return releaseDates[0];
  if (item.date) return item.date;
  if (item.exclusiveStartDate) return item.exclusiveStartDate;
  if (item.exclusiveEndDate) return item.exclusiveEndDate;
  return '';
};

export const resolveCostPrecedence = (entity = {}, model = 'paid-first') => {
  const normalizeCost = (...values) => {
    for (const value of values) {
      if (value === null || value === undefined || value === '') continue;
      const numericValue = typeof value === 'number' ? value : Number(value);
      if (Number.isFinite(numericValue)) return numericValue;
    }
    return 0;
  };

  const actual = normalizeCost(entity.actualCost, entity.actual_cost);
  const paid = normalizeCost(entity.amount_paid, entity.paidCost, entity.amountPaid);
  const partial = normalizeCost(entity.partially_paid, entity.partiallyPaidAmount, entity.partialPaidCost);
  const quoted = normalizeCost(entity.quoted_cost, entity.quotedCost);
  const estimated = normalizeCost(entity.estimated_cost, entity.estimatedCost);

  // Apply cost calculation model
  if (model === 'quoted-first') {
    // Quoted-first: Quoted > Paid > Partial > Estimated
    if (quoted > 0) return { value: quoted, source: 'quoted' };
    if (actual > 0) return { value: actual, source: 'actual' };
    if (paid > 0) return { value: paid, source: 'paid' };
    if (partial > 0) return { value: partial, source: 'partially_paid' };
    return { value: estimated, source: 'estimated' };
  } else if (model === 'estimated-first') {
    // Estimated-first: Estimated > Quoted > Paid > Partial
    if (estimated > 0) return { value: estimated, source: 'estimated' };
    if (quoted > 0) return { value: quoted, source: 'quoted' };
    if (actual > 0) return { value: actual, source: 'actual' };
    if (paid > 0) return { value: paid, source: 'paid' };
    if (partial > 0) return { value: partial, source: 'partially_paid' };
    return { value: 0, source: 'estimated' };
  } else {
    // Default: Paid-first (Paid > Partial > Quoted > Estimated)
    if (actual > 0) return { value: actual, source: 'actual' };
    if (paid > 0) return { value: paid, source: 'paid' };
    if (partial > 0) return { value: partial, source: 'partially_paid' };
    if (quoted > 0) return { value: quoted, source: 'quoted' };
    return { value: estimated, source: 'estimated' };
  }
};

export const getEffectiveCost = (entity = {}, model = 'paid-first') => resolveCostPrecedence(entity, model).value;
