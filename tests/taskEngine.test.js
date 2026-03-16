import test from 'node:test';
import assert from 'node:assert/strict';
import TaskEngine, {
  SONG_TASK_TYPES,
  STEMS_TASK_TYPES,
  VIDEO_TASK_TYPES,
  RELEASE_TASK_TYPES,
  PHYSICAL_RELEASE_TASK_TYPES,
  EVENT_TASK_TYPES,
  STATUS_OPTIONS,
  STATUS_POINTS,
  getStatusPoints,
  calculateTaskProgress,
  getEffectiveCost,
  resolveCostPrecedence,
} from '../src/domain/taskEngine.js';

// ─── Re-export constants ──────────────────────────────────────────────────────

test('re-exports task type arrays from taskEngine', () => {
  assert.ok(Array.isArray(SONG_TASK_TYPES),             'SONG_TASK_TYPES is an array');
  assert.ok(SONG_TASK_TYPES.length > 0,                 'SONG_TASK_TYPES is non-empty');
  assert.ok(Array.isArray(STEMS_TASK_TYPES),            'STEMS_TASK_TYPES is an array');
  assert.ok(Array.isArray(VIDEO_TASK_TYPES),            'VIDEO_TASK_TYPES is an array');
  assert.ok(Array.isArray(RELEASE_TASK_TYPES),          'RELEASE_TASK_TYPES is an array');
  assert.ok(Array.isArray(PHYSICAL_RELEASE_TASK_TYPES), 'PHYSICAL_RELEASE_TASK_TYPES is an array');
  assert.ok(Array.isArray(EVENT_TASK_TYPES),            'EVENT_TASK_TYPES is an array');
});

test('re-exports status constants and helpers from taskLogic', () => {
  assert.ok(Array.isArray(STATUS_OPTIONS),       'STATUS_OPTIONS is an array');
  assert.ok(typeof STATUS_POINTS === 'object',   'STATUS_POINTS is an object');
  assert.equal(typeof getStatusPoints,   'function');
  assert.equal(typeof calculateTaskProgress, 'function');
  assert.equal(typeof getEffectiveCost,  'function');
  assert.equal(typeof resolveCostPrecedence, 'function');
});

// ─── 1. generateTasks – song ──────────────────────────────────────────────────

test('generateTasks("song") generates basic song tasks', () => {
  const tasks = TaskEngine.generateTasks('song', { releaseDate: '2026-08-01' });

  assert.ok(tasks.length > 0, 'should generate at least one task');

  // Every task should have the expected shape
  for (const task of tasks) {
    assert.ok(task.id,       'task has id');
    assert.ok(task.type,     'task has type');
    assert.ok(task.date,     'task has date');
    assert.ok(task.due_date, 'task has due_date');
    assert.ok(task.dueDate,  'task has dueDate');
    assert.equal(task.status, 'Not Started');
    assert.equal(task.parentType, 'song');
  }

  // Must include a Release task
  const releaseTask = tasks.find(t => t.type === 'Release');
  assert.ok(releaseTask, 'should include a Release task');
  assert.equal(releaseTask.date, '2026-08-01', 'Release task date equals releaseDate');

  // Should NOT include stems tasks by default
  const stems = tasks.filter(t => t.type === 'Receive Stems' || t.type === 'Release Stems');
  assert.equal(stems.length, 0, 'should not include stems tasks without stemsNeeded');

  // Tasks must be sorted ascending by date
  for (let i = 1; i < tasks.length; i++) {
    assert.ok(
      tasks[i].date >= tasks[i - 1].date,
      `tasks[${i}] date (${tasks[i].date}) should be >= tasks[${i - 1}].date (${tasks[i - 1].date})`
    );
  }
});

// ─── 2. generateTasks – song with stemsNeeded ────────────────────────────────

test('generateTasks("song", { stemsNeeded: true }) includes stems tasks', () => {
  const tasks = TaskEngine.generateTasks('song', { releaseDate: '2026-08-01', stemsNeeded: true });

  const receiveStems = tasks.find(t => t.type === 'Receive Stems');
  const releaseStems = tasks.find(t => t.type === 'Release Stems');

  assert.ok(receiveStems, 'should include Receive Stems task');
  assert.ok(releaseStems, 'should include Release Stems task');

  // Receive Stems is 35 days before release → 2026-06-27
  assert.equal(receiveStems.date, '2026-06-27', 'Receive Stems date offset is correct');
  // Release Stems is 7 days before release → 2026-07-25
  assert.equal(releaseStems.date, '2026-07-25', 'Release Stems date offset is correct');
});

// ─── 3. generateTasks – release with physical copies ────────────────────────

test('generateTasks("release", { hasPhysicalCopies: true }) includes physical tasks', () => {
  const tasksNoPhysical = TaskEngine.generateTasks('release', { releaseDate: '2026-08-01' });
  const tasksWithPhysical = TaskEngine.generateTasks('release', {
    releaseDate: '2026-08-01',
    hasPhysicalCopies: true,
  });

  assert.ok(tasksWithPhysical.length > tasksNoPhysical.length, 'physical adds extra tasks');

  const physicalTypes = PHYSICAL_RELEASE_TASK_TYPES.map(t => t.type);
  for (const physType of physicalTypes) {
    assert.ok(
      tasksWithPhysical.some(t => t.type === physType),
      `should include physical task: ${physType}`
    );
    assert.ok(
      !tasksNoPhysical.some(t => t.type === physType),
      `should NOT include ${physType} without hasPhysicalCopies`
    );
  }

  // All tasks have parentType = 'release'
  for (const task of tasksWithPhysical) {
    assert.equal(task.parentType, 'release');
  }
});

// ─── 4. generateTasks – video ────────────────────────────────────────────────

test('generateTasks("video", { videoTypeKey: "music" }) generates video tasks', () => {
  const tasks = TaskEngine.generateTasks('video', {
    releaseDate: '2026-08-01',
    videoTypeKey: 'music',
  });

  assert.ok(tasks.length > 0, 'should generate video tasks');

  const expectedTypes = VIDEO_TASK_TYPES.map(t => t.type);
  for (const expType of expectedTypes) {
    assert.ok(
      tasks.some(t => t.type === expType),
      `should include video task: ${expType}`
    );
  }

  // All tasks have parentType = 'video'
  for (const task of tasks) {
    assert.equal(task.parentType, 'video');
  }

  // Release Video should be on the release date
  const releaseVideo = tasks.find(t => t.type === 'Release Video');
  assert.ok(releaseVideo, 'should include Release Video task');
  assert.equal(releaseVideo.date, '2026-08-01');

  // Sorted ascending
  for (let i = 1; i < tasks.length; i++) {
    assert.ok(tasks[i].date >= tasks[i - 1].date);
  }
});

// ─── 5. generateTasks – event ────────────────────────────────────────────────

test('generateTasks("event", { eventDate: "2026-08-01" }) generates event tasks', () => {
  const tasks = TaskEngine.generateTasks('event', { eventDate: '2026-08-01' });

  assert.ok(tasks.length > 0, 'should generate event tasks');

  // Required task must always be present
  const attendTask = tasks.find(t => t.type === 'Attend Event');
  assert.ok(attendTask, 'should always include Attend Event task');
  assert.equal(attendTask.date, '2026-08-01', 'Attend Event date equals eventDate');

  // All tasks should have parentType = 'event'
  for (const task of tasks) {
    assert.equal(task.parentType, 'event');
  }

  // Sorted ascending
  for (let i = 1; i < tasks.length; i++) {
    assert.ok(tasks[i].date >= tasks[i - 1].date);
  }
});

test('generateTasks("event") with includePreparation=false only includes required tasks', () => {
  const allTasks      = TaskEngine.generateTasks('event', { eventDate: '2026-08-01', includePreparation: true });
  const requiredOnly  = TaskEngine.generateTasks('event', { eventDate: '2026-08-01', includePreparation: false });

  assert.ok(requiredOnly.length <= allTasks.length, 'required-only has <= tasks');
  // All returned tasks should be required
  for (const task of requiredOnly) {
    const def = EVENT_TASK_TYPES.find(d => d.type === task.type);
    assert.ok(def && def.required, `task "${task.type}" should be required`);
  }
});

// ─── 6. calculateProgress ────────────────────────────────────────────────────

test('TaskEngine.calculateProgress returns correct weighted percentage', () => {
  const tasks = [
    { status: 'Complete' },
    { status: 'Not Started' },
  ];
  const result = TaskEngine.calculateProgress(tasks);

  assert.equal(result.totalTasks,    2);
  assert.equal(result.pointsEarned,  1);
  assert.equal(result.progress,     50);
});

test('TaskEngine.calculateProgress handles empty array', () => {
  const result = TaskEngine.calculateProgress([]);
  assert.equal(result.progress,    0);
  assert.equal(result.totalTasks,  0);
});

test('TaskEngine.calculateProgress matches direct calculateTaskProgress', () => {
  const tasks = [
    { status: 'Complete' },
    { status: 'In-Progress' },
    { status: 'Not Started' },
  ];
  const direct  = calculateTaskProgress(tasks);
  const wrapped = TaskEngine.calculateProgress(tasks);
  assert.deepEqual(wrapped, direct);
});

// ─── 7. calculateCost ────────────────────────────────────────────────────────

test('TaskEngine.calculateCost returns estimatedCost when only estimate provided', () => {
  assert.equal(TaskEngine.calculateCost({ estimatedCost: 100 }), 100);
});

test('TaskEngine.calculateCost uses paid-first model by default', () => {
  const entity = { estimatedCost: 100, quotedCost: 120, paidCost: 150, actualCost: 180 };
  assert.equal(TaskEngine.calculateCost(entity), 180, 'actual takes precedence in paid-first');
});

test('TaskEngine.calculateCost supports quoted-first model', () => {
  const entity = { estimatedCost: 100, quotedCost: 120, paidCost: 150 };
  assert.equal(TaskEngine.calculateCost(entity, 'quoted-first'), 120);
});

test('TaskEngine.calculateCost supports estimated-first model', () => {
  const entity = { estimatedCost: 100, quotedCost: 120, paidCost: 150 };
  assert.equal(TaskEngine.calculateCost(entity, 'estimated-first'), 100);
});

test('TaskEngine.calculateCost matches getEffectiveCost', () => {
  const entity = { estimatedCost: 75, quotedCost: 90 };
  assert.equal(TaskEngine.calculateCost(entity), getEffectiveCost(entity));
  assert.equal(TaskEngine.calculateCost(entity, 'quoted-first'), getEffectiveCost(entity, 'quoted-first'));
});

// ─── 8. recalculateTasks ─────────────────────────────────────────────────────

test('TaskEngine.recalculateTasks("song") updates non-overridden task dates', () => {
  // Seed tasks using initial date
  const initialTasks = TaskEngine.generateTasks('song', {
    releaseDate: '2026-08-01',
    isSingle: true,
  });

  const newReleaseDate = '2026-09-01';
  const updated = TaskEngine.recalculateTasks('song', initialTasks, newReleaseDate, { isSingle: true });

  // Release task should now be on the new date
  const releaseTask = updated.find(t => t.type === 'Release');
  assert.ok(releaseTask, 'Release task should still exist');
  assert.equal(releaseTask.date, newReleaseDate, 'Release task date updated to new releaseDate');

  // Mix task (42 days before release) should be 2026-07-21
  const mixTask = updated.find(t => t.type === 'Mix');
  assert.ok(mixTask, 'Mix task should exist');
  assert.equal(mixTask.date, '2026-07-21', 'Mix task recalculated correctly');
});

test('TaskEngine.recalculateTasks does NOT change overridden tasks', () => {
  const tasks = TaskEngine.generateTasks('song', { releaseDate: '2026-08-01' });

  // Mark the Mix task as overridden with a custom date
  const mixIdx = tasks.findIndex(t => t.type === 'Mix');
  assert.ok(mixIdx >= 0, 'Mix task must exist');
  tasks[mixIdx] = { ...tasks[mixIdx], isOverridden: true, date: '2026-06-01', due_date: '2026-06-01', dueDate: '2026-06-01' };

  const updated = TaskEngine.recalculateTasks('song', tasks, '2026-09-01', {});
  const mixAfter = updated.find(t => t.type === 'Mix');

  assert.equal(mixAfter.date, '2026-06-01', 'overridden task date should remain unchanged');
});

test('TaskEngine.recalculateTasks does NOT change completed tasks', () => {
  const tasks = TaskEngine.generateTasks('song', { releaseDate: '2026-08-01' });

  // Mark the Mix task as Complete
  const mixIdx = tasks.findIndex(t => t.type === 'Mix');
  assert.ok(mixIdx >= 0);
  const originalDate = tasks[mixIdx].date;
  tasks[mixIdx] = { ...tasks[mixIdx], status: 'Complete' };

  const updated = TaskEngine.recalculateTasks('song', tasks, '2026-10-01', {});
  const mixAfter = updated.find(t => t.type === 'Mix');

  assert.equal(mixAfter.date, originalDate, 'completed task date should remain unchanged');
});

test('TaskEngine.recalculateTasks("release") updates release task dates', () => {
  const tasks = TaskEngine.generateTasks('release', { releaseDate: '2026-08-01' });
  const updated = TaskEngine.recalculateTasks('release', tasks, '2026-10-01', {});

  const releaseTask = updated.find(t => t.type === 'Release');
  assert.equal(releaseTask.date, '2026-10-01');

  const submitTask = updated.find(t => t.type === 'Submit Release');
  assert.equal(submitTask.date, '2026-09-17', 'Submit Release is 14 days before new release date');
});

test('TaskEngine.recalculateTasks returns existingTasks unchanged when no date provided', () => {
  const tasks = TaskEngine.generateTasks('song', { releaseDate: '2026-08-01' });
  const result = TaskEngine.recalculateTasks('song', tasks, null, {});
  assert.deepEqual(result, tasks);
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

test('generateTasks returns empty array for unknown entity type', () => {
  const tasks = TaskEngine.generateTasks('unknown_entity', { releaseDate: '2026-08-01' });
  assert.deepEqual(tasks, []);
});

test('generateTasks returns empty array when required date is missing', () => {
  assert.deepEqual(TaskEngine.generateTasks('song',    {}), []);
  assert.deepEqual(TaskEngine.generateTasks('release', {}), []);
  assert.deepEqual(TaskEngine.generateTasks('video',   {}), []);
  assert.deepEqual(TaskEngine.generateTasks('event',   {}), []);
  assert.deepEqual(TaskEngine.generateTasks('version', {}), []);
});

test('every generated task has all required fields', () => {
  const allTasks = [
    ...TaskEngine.generateTasks('song',    { releaseDate: '2026-08-01', isSingle: true, stemsNeeded: true }),
    ...TaskEngine.generateTasks('version', { releaseDate: '2026-08-01' }),
    ...TaskEngine.generateTasks('video',   { releaseDate: '2026-08-01', videoTypeKey: 'lyric' }),
    ...TaskEngine.generateTasks('release', { releaseDate: '2026-08-01', hasPhysicalCopies: true }),
    ...TaskEngine.generateTasks('event',   { eventDate:   '2026-08-01' }),
  ];

  for (const task of allTasks) {
    assert.ok(task.id,             `task ${task.type} has id`);
    assert.ok(task.type,           `task has type`);
    assert.equal(task.status, 'Not Started', `task ${task.type} starts as Not Started`);
    assert.ok(typeof task.estimatedCost === 'number', `task ${task.type} has numeric estimatedCost`);
    assert.ok(Array.isArray(task.eraIds),  `task ${task.type} has eraIds array`);
    assert.ok(Array.isArray(task.tagIds),  `task ${task.type} has tagIds array`);
    assert.equal(task.isOverridden, false, `task ${task.type} starts non-overridden`);
    assert.equal(task.isArchived,   false, `task ${task.type} starts non-archived`);
  }
});
