/**
 * E2E Test Fixtures for Era Manifesto
 * 
 * Test data generators for creating consistent test scenarios
 */

/**
 * Generate a unique ID for test data
 */
export function generateId(prefix = 'test') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate test song data
 * @param {Object} overrides - Override default values
 * @returns {Object} Song data
 */
export function createTestSong(overrides = {}) {
  const id = overrides.id || generateId('song');
  return {
    id,
    title: overrides.title || `Test Song ${id.slice(-8)}`,
    category: overrides.category || 'Single',
    releaseDate: overrides.releaseDate || '2026-06-15',
    notes: overrides.notes || 'E2E test song',
    estimatedCost: overrides.estimatedCost ?? 0,
    quotedCost: overrides.quotedCost ?? 0,
    paidCost: overrides.paidCost ?? 0,
    ...overrides
  };
}

/**
 * Generate test version data
 * @param {string} songId - Parent song ID
 * @param {Object} overrides - Override default values
 * @returns {Object} Version data
 */
export function createTestVersion(songId, overrides = {}) {
  const id = overrides.id || generateId('ver');
  return {
    id,
    name: overrides.name || 'Core Version',
    songId,
    releaseDate: overrides.releaseDate || '',
    estimatedCost: overrides.estimatedCost ?? 0,
    quotedCost: overrides.quotedCost ?? 0,
    paidCost: overrides.paidCost ?? 0,
    ...overrides
  };
}

/**
 * Generate test release data
 * @param {Object} overrides - Override default values
 * @returns {Object} Release data
 */
export function createTestRelease(overrides = {}) {
  const id = overrides.id || generateId('release');
  return {
    id,
    name: overrides.name || `Test Release ${id.slice(-8)}`,
    type: overrides.type || 'Single',
    releaseDate: overrides.releaseDate || '2026-07-01',
    attachedSongIds: overrides.attachedSongIds || [],
    estimatedCost: overrides.estimatedCost ?? 0,
    quotedCost: overrides.quotedCost ?? 0,
    paidCost: overrides.paidCost ?? 0,
    ...overrides
  };
}

/**
 * Generate test task data
 * @param {Object} overrides - Override default values
 * @returns {Object} Task data
 */
export function createTestTask(overrides = {}) {
  const id = overrides.id || generateId('task');
  return {
    id,
    taskName: overrides.taskName || `Test Task ${id.slice(-8)}`,
    status: overrides.status || 'Not Started',
    date: overrides.date || '2026-06-01',
    category: overrides.category || 'General',
    estimatedCost: overrides.estimatedCost ?? 0,
    quotedCost: overrides.quotedCost ?? 0,
    paidCost: overrides.paidCost ?? 0,
    assignedMembers: overrides.assignedMembers || [],
    ...overrides
  };
}

/**
 * Generate test team member data
 * @param {Object} overrides - Override default values
 * @returns {Object} Team member data
 */
export function createTestTeamMember(overrides = {}) {
  const id = overrides.id || generateId('tm');
  return {
    id,
    name: overrides.name || `Test Member ${id.slice(-8)}`,
    type: overrides.type || 'Individual',
    role: overrides.role || 'Collaborator',
    isMusician: overrides.isMusician ?? false,
    instruments: overrides.instruments || [],
    email: overrides.email || `test-${id.slice(-8)}@example.com`,
    ...overrides
  };
}

/**
 * Generate test video data
 * @param {Object} overrides - Override default values
 * @returns {Object} Video data
 */
export function createTestVideo(overrides = {}) {
  const id = overrides.id || generateId('video');
  return {
    id,
    name: overrides.name || `Test Video ${id.slice(-8)}`,
    videoTypes: overrides.videoTypes || ['Music Video'],
    releaseDate: overrides.releaseDate || '2026-06-20',
    songId: overrides.songId || null,
    versionId: overrides.versionId || null,
    estimatedCost: overrides.estimatedCost ?? 0,
    quotedCost: overrides.quotedCost ?? 0,
    paidCost: overrides.paidCost ?? 0,
    ...overrides
  };
}

/**
 * Generate test event data
 * @param {Object} overrides - Override default values
 * @returns {Object} Event data
 */
export function createTestEvent(overrides = {}) {
  const id = overrides.id || generateId('event');
  return {
    id,
    name: overrides.name || `Test Event ${id.slice(-8)}`,
    date: overrides.date || '2026-07-15',
    location: overrides.location || 'Test Venue',
    ...overrides
  };
}

/**
 * Generate test expense data
 * @param {Object} overrides - Override default values
 * @returns {Object} Expense data
 */
export function createTestExpense(overrides = {}) {
  const id = overrides.id || generateId('expense');
  return {
    id,
    name: overrides.name || `Test Expense ${id.slice(-8)}`,
    amount: overrides.amount ?? 100,
    date: overrides.date || new Date().toISOString().split('T')[0],
    category: overrides.category || 'General',
    ...overrides
  };
}

/**
 * Create a complete test scenario with song, version, and release
 * @returns {Object} Complete scenario data
 */
export function createCompleteScenario() {
  const song = createTestSong({
    title: 'Complete Test Song',
    estimatedCost: 1000
  });
  
  const version = createTestVersion(song.id, {
    name: 'Core Version',
    estimatedCost: 500
  });
  
  const release = createTestRelease({
    name: 'Complete Test Release',
    attachedSongIds: [song.id],
    estimatedCost: 300
  });
  
  const teamMember = createTestTeamMember({
    name: 'Test Producer',
    isMusician: true,
    instruments: ['Synth']
  });
  
  const task = createTestTask({
    taskName: 'Mix Track',
    parentType: 'song',
    parentId: song.id,
    estimatedCost: 250,
    assignedMembers: [{ memberId: teamMember.id, cost: 250 }]
  });
  
  return {
    song,
    version,
    release,
    teamMember,
    task
  };
}

/**
 * Create cost precedence test scenario
 * @returns {Object} Scenario with different cost states
 */
export function createCostPrecedenceScenario() {
  return {
    estimatedOnly: createTestTask({
      taskName: 'Estimated Only Task',
      estimatedCost: 100,
      quotedCost: 0,
      paidCost: 0
    }),
    quotedOverEstimated: createTestTask({
      taskName: 'Quoted Over Estimated',
      estimatedCost: 100,
      quotedCost: 150,
      paidCost: 0
    }),
    paidOverAll: createTestTask({
      taskName: 'Paid Over All',
      estimatedCost: 100,
      quotedCost: 150,
      paidCost: 175
    })
  };
}

/**
 * Create team assignment test scenario
 * @returns {Object} Scenario with multiple team members
 */
export function createTeamAssignmentScenario() {
  const member1 = createTestTeamMember({
    name: 'Producer',
    role: 'Producer'
  });
  
  const member2 = createTestTeamMember({
    name: 'Engineer',
    role: 'Engineer'
  });
  
  const member3 = createTestTeamMember({
    name: 'Musician',
    role: 'Session Musician',
    isMusician: true,
    instruments: ['Guitar', 'Bass']
  });
  
  const globalTask = createTestTask({
    taskName: 'Studio Session',
    estimatedCost: 1000,
    assignedMembers: [
      { memberId: member1.id, cost: 400 },
      { memberId: member2.id, cost: 300 },
      { memberId: member3.id, cost: 300 }
    ]
  });
  
  return {
    members: [member1, member2, member3],
    task: globalTask
  };
}

/**
 * Generate date string for relative days from now
 * @param {number} daysFromNow - Number of days (positive for future, negative for past)
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export function getRelativeDate(daysFromNow = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

/**
 * Create auto-task generation test scenario
 * @returns {Object} Scenario for testing auto-generated tasks
 */
export function createAutoTaskScenario() {
  const releaseDate = getRelativeDate(30); // 30 days from now
  
  const song = createTestSong({
    title: 'Auto Task Test Song',
    releaseDate
  });
  
  const release = createTestRelease({
    name: 'Auto Task Test Release',
    releaseDate,
    attachedSongIds: [song.id]
  });
  
  return {
    song,
    release,
    releaseDate
  };
}

/**
 * Create backup/restore test data
 * @returns {Object} Sample data for backup testing
 */
export function createBackupTestData() {
  const songs = [
    createTestSong({ title: 'Backup Test Song 1' }),
    createTestSong({ title: 'Backup Test Song 2' })
  ];
  
  const teamMembers = [
    createTestTeamMember({ name: 'Backup Test Member 1' }),
    createTestTeamMember({ name: 'Backup Test Member 2' })
  ];
  
  const tasks = [
    createTestTask({ taskName: 'Backup Test Task 1' }),
    createTestTask({ taskName: 'Backup Test Task 2' })
  ];
  
  return {
    songs,
    teamMembers,
    tasks
  };
}
