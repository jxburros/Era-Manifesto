import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getStatusPoints,
  calculateTaskProgress,
  getTaskDueDate,
  getPrimaryDate,
  resolveCostPrecedence,
  getEffectiveCost,
} from '../src/domain/taskLogic.js';

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
  assert.equal(getPrimaryDate({ releaseIds: ['r1', 'r2'] }, releases), '2026-07-15');
});

test('cost precedence prefers actual > paid > partial > quoted > estimated', () => {
  assert.deepEqual(resolveCostPrecedence({ estimatedCost: 100 }), { value: 100, source: 'estimated' });
  assert.deepEqual(resolveCostPrecedence({ estimatedCost: 100, quotedCost: 120 }), { value: 120, source: 'quoted' });
  assert.deepEqual(resolveCostPrecedence({ quotedCost: 120, partially_paid: 50 }), { value: 50, source: 'partially_paid' });
  assert.deepEqual(resolveCostPrecedence({ quotedCost: 120, paidCost: 150 }), { value: 150, source: 'paid' });
  assert.deepEqual(resolveCostPrecedence({ paidCost: 150, actualCost: 180 }), { value: 180, source: 'actual' });
  assert.equal(getEffectiveCost({ estimated_cost: 99 }), 99);
});

test('cost precedence handles string values and prefers explicit zero values over legacy aliases', () => {
  assert.deepEqual(
    resolveCostPrecedence({ amount_paid: '0', paidCost: '75', quotedCost: '40' }),
    { value: 40, source: 'quoted' }
  );

  assert.deepEqual(
    resolveCostPrecedence({ actualCost: '250.50', paidCost: '100' }),
    { value: 250.5, source: 'actual' }
  );
});

test('cost precedence supports quoted-first model', () => {
  const entity = { estimatedCost: 100, quotedCost: 120, paidCost: 150 };
  
  // Quoted-first: quoted > paid > estimated
  assert.deepEqual(resolveCostPrecedence(entity, 'quoted-first'), { value: 120, source: 'quoted' });
  
  // When no quoted, falls back to paid
  assert.deepEqual(resolveCostPrecedence({ estimatedCost: 100, paidCost: 150 }, 'quoted-first'), { value: 150, source: 'paid' });
  
  // When only estimated
  assert.deepEqual(resolveCostPrecedence({ estimatedCost: 100 }, 'quoted-first'), { value: 100, source: 'estimated' });
});

test('cost precedence supports estimated-first model', () => {
  const entity = { estimatedCost: 100, quotedCost: 120, paidCost: 150 };
  
  // Estimated-first: estimated > quoted > paid
  assert.deepEqual(resolveCostPrecedence(entity, 'estimated-first'), { value: 100, source: 'estimated' });
  
  // When no estimated, falls back to quoted
  assert.deepEqual(resolveCostPrecedence({ quotedCost: 120, paidCost: 150 }, 'estimated-first'), { value: 120, source: 'quoted' });
  
  // When only paid
  assert.deepEqual(resolveCostPrecedence({ paidCost: 150 }, 'estimated-first'), { value: 150, source: 'paid' });
});

test('cost precedence defaults to paid-first model', () => {
  const entity = { estimatedCost: 100, quotedCost: 120, paidCost: 150, actualCost: 180 };
  
  // Default (paid-first): actual > paid > quoted > estimated
  assert.deepEqual(resolveCostPrecedence(entity), { value: 180, source: 'actual' });
  assert.deepEqual(resolveCostPrecedence(entity, 'paid-first'), { value: 180, source: 'actual' });
  
  // getEffectiveCost uses the model parameter correctly
  assert.equal(getEffectiveCost(entity, 'paid-first'), 180);
  assert.equal(getEffectiveCost(entity, 'quoted-first'), 120);
  assert.equal(getEffectiveCost(entity, 'estimated-first'), 100);
});
