import test from 'node:test';
import assert from 'node:assert/strict';

// Import only the functions we can test in Node.js without React dependencies
// formatMoney, getTaskBudget, and filterTasksByStatus have external dependencies
// So we'll test the domain logic functions instead

import {
  getStatusPoints,
  calculateTaskProgress,
  getTaskDueDate,
  getPrimaryDate,
  resolveCostPrecedence,
  getEffectiveCost,
} from '../src/domain/taskLogic.js';

// Existing tests from taskLogic.test.js
test('status points handles canonical and legacy statuses', () => {
  assert.equal(getStatusPoints('Complete'), 1);
  assert.equal(getStatusPoints('Done'), 1);
  assert.equal(getStatusPoints('In Progress'), 0.5);
  assert.equal(getStatusPoints('Delayed'), 0);
  assert.equal(getStatusPoints('Unknown'), 0);
});

test('calculateTaskProgress computes weighted percent', () => {
  const result = calculateTaskProgress([
    { status: 'Complete' },
    { status: 'In-Progress' },
    { status: 'Not Started' },
  ]);

  assert.deepEqual(result, {
    pointsEarned: 1.5,
    totalTasks: 3,
    progress: 50,
  });
});

test('getTaskDueDate supports legacy and unified fields', () => {
  assert.equal(getTaskDueDate({ due_date: '2026-01-01' }), '2026-01-01');
  assert.equal(getTaskDueDate({ dueDate: '2026-01-02' }), '2026-01-02');
  assert.equal(getTaskDueDate({ date: '2026-01-03' }), '2026-01-03');
});

test('getPrimaryDate resolves overrides and release lookup', () => {
  const releases = [
    { id: 'r1', releaseDate: '2026-08-01' },
    { id: 'r2', releaseDate: '2026-07-15' },
  ];

  const item = {
    releaseIds: ['r1', 'r2'],
    releaseOverrides: { r2: '2026-07-01' },
  };

  assert.equal(getPrimaryDate(item, releases), '2026-07-01');
});

test('cost precedence prefers actual > paid > partial > quoted > estimated', () => {
  const entity1 = { actualCost: 500, paidCost: 400, quotedCost: 300, estimatedCost: 200 };
  assert.deepEqual(resolveCostPrecedence(entity1), { value: 500, source: 'actual' });

  const entity2 = { paidCost: 400, quotedCost: 300, estimatedCost: 200 };
  assert.deepEqual(resolveCostPrecedence(entity2), { value: 400, source: 'paid' });

  const entity3 = { partially_paid: 350, quotedCost: 300, estimatedCost: 200 };
  assert.deepEqual(resolveCostPrecedence(entity3), { value: 350, source: 'partially_paid' });

  const entity4 = { quotedCost: 300, estimatedCost: 200 };
  assert.deepEqual(resolveCostPrecedence(entity4), { value: 300, source: 'quoted' });

  const entity5 = { estimatedCost: 200 };
  assert.deepEqual(resolveCostPrecedence(entity5), { value: 200, source: 'estimated' });
});

// Additional tests for better coverage
test('calculateTaskProgress handles empty array', () => {
  const result = calculateTaskProgress([]);
  assert.deepEqual(result, {
    pointsEarned: 0,
    totalTasks: 0,
    progress: 0,
  });
});

test('getStatusPoints returns 0 for null or undefined', () => {
  assert.equal(getStatusPoints(null), 0);
  assert.equal(getStatusPoints(undefined), 0);
  assert.equal(getStatusPoints(''), 0);
});

test('getStatusPoints handles all status options', () => {
  assert.equal(getStatusPoints('Not Started'), 0);
  assert.equal(getStatusPoints('In-Progress'), 0.5);
  assert.equal(getStatusPoints('Waiting on Someone Else'), 0.5);
  assert.equal(getStatusPoints('Paid But Not Complete'), 0.5);
  assert.equal(getStatusPoints('Complete But Not Paid'), 0.5);
  assert.equal(getStatusPoints('Complete'), 1);
  assert.equal(getStatusPoints('Other'), 0);
});

test('getTaskDueDate returns empty string for empty task', () => {
  assert.equal(getTaskDueDate({}), '');
  assert.equal(getTaskDueDate(), '');
});

test('getPrimaryDate returns empty string when no dates available', () => {
  assert.equal(getPrimaryDate({}), '');
  assert.equal(getPrimaryDate({ releaseIds: [] }, []), '');
});

test('getPrimaryDate prioritizes primary_date first', () => {
  const item = {
    primary_date: '2026-01-01',
    primaryDate: '2026-01-02',
    releaseDate: '2026-01-03',
  };
  assert.equal(getPrimaryDate(item), '2026-01-01');
});

test('getPrimaryDate falls back through date hierarchy', () => {
  const item1 = { primaryDate: '2026-01-02' };
  assert.equal(getPrimaryDate(item1), '2026-01-02');

  const item2 = { primaryDateOverride: '2026-01-03' };
  assert.equal(getPrimaryDate(item2), '2026-01-03');

  const item3 = { releaseDate: '2026-01-04' };
  assert.equal(getPrimaryDate(item3), '2026-01-04');
});

test('resolveCostPrecedence handles string numeric values', () => {
  const entity = { quotedCost: '500', estimatedCost: '200' };
  const result = resolveCostPrecedence(entity);
  assert.equal(result.value, 500);
  assert.equal(result.source, 'quoted');
});

test('resolveCostPrecedence handles zero values correctly', () => {
  const entity = { actualCost: 0, paidCost: 100 };
  const result = resolveCostPrecedence(entity);
  assert.equal(result.value, 100);
  assert.equal(result.source, 'paid');
});

test('getEffectiveCost returns numeric value', () => {
  const entity = { paidCost: 500 };
  assert.equal(getEffectiveCost(entity), 500);
});

test('getEffectiveCost returns 0 for empty entity', () => {
  assert.equal(getEffectiveCost({}), 0);
  assert.equal(getEffectiveCost(), 0);
});

test('calculateTaskProgress rounds to whole number', () => {
  const result = calculateTaskProgress([
    { status: 'Complete' },
    { status: 'In-Progress' },
    { status: 'Not Started' },
    { status: 'Not Started' },
  ]);
  // 1.5 / 4 = 0.375 = 37.5% = rounds to 38%
  assert.equal(result.progress, 38);
});
