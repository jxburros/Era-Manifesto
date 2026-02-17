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
  checkOrphanedTasks,
  checkInvalidStatuses,
  checkBrokenLinks,
  runDiagnostics,
  autoRepair,
  getDiagnosticStats
} from '../src/utils/dataIntegrity.js';

test('checkOrphanedTasks detects tasks without IDs', () => {
  const data = {
    songs: [
      {
        id: 'song1',
        name: 'Test Song',
        tasks: [
          { id: 'task1', name: 'Mix' },
          { name: 'Master' } // Missing ID
        ]
      }
    ]
  };
  
  const issues = checkOrphanedTasks(data);
  assert.strictEqual(issues.length, 1);
  assert.strictEqual(issues[0].type, 'missing_id');
  assert.strictEqual(issues[0].severity, 'high');
});

test('checkOrphanedTasks returns empty array for valid data', () => {
  const data = {
    songs: [
      {
        id: 'song1',
        name: 'Test Song',
        tasks: [
          { id: 'task1', name: 'Mix' },
          { id: 'task2', name: 'Master' }
        ]
      }
    ]
  };
  
  const issues = checkOrphanedTasks(data);
  assert.strictEqual(issues.length, 0);
});

test('checkInvalidStatuses detects invalid status values', () => {
  const data = {
    songs: [
      {
        id: 'song1',
        name: 'Test Song',
        tasks: [
          { id: 'task1', name: 'Mix', status: 'Complete' },
          { id: 'task2', name: 'Master', status: 'InvalidStatus' }
        ]
      }
    ]
  };
  
  const issues = checkInvalidStatuses(data);
  assert.strictEqual(issues.length, 1);
  assert.strictEqual(issues[0].type, 'invalid_status');
  assert.strictEqual(issues[0].currentStatus, 'InvalidStatus');
});

test('checkInvalidStatuses accepts all valid statuses', () => {
  const validStatuses = [
    'Not Started',
    'In-Progress',
    'Waiting on Someone Else',
    'Complete',
    'Done',
    'In Progress'
  ];
  
  const data = {
    songs: [
      {
        id: 'song1',
        name: 'Test Song',
        tasks: validStatuses.map((status, i) => ({
          id: `task${i}`,
          name: `Task ${i}`,
          status
        }))
      }
    ]
  };
  
  const issues = checkInvalidStatuses(data);
  assert.strictEqual(issues.length, 0);
});

test('checkBrokenLinks detects broken era references', () => {
  const data = {
    songs: [
      {
        id: 'song1',
        name: 'Test Song',
        era_ids: ['era1', 'era2']
      }
    ],
    eras: [
      { id: 'era1', name: 'Era 1' }
      // era2 is missing
    ]
  };
  
  const issues = checkBrokenLinks(data);
  assert.strictEqual(issues.length, 1);
  assert.strictEqual(issues[0].type, 'broken_era_link');
  assert.strictEqual(issues[0].brokenId, 'era2');
});

test('checkBrokenLinks detects broken team member references', () => {
  const data = {
    songs: [
      {
        id: 'song1',
        name: 'Test Song',
        team_member_ids: ['member1', 'member2']
      }
    ],
    teamMembers: [
      { id: 'member1', name: 'Member 1' }
      // member2 is missing
    ]
  };
  
  const issues = checkBrokenLinks(data);
  assert.strictEqual(issues.length, 1);
  assert.strictEqual(issues[0].type, 'broken_team_member_link');
  assert.strictEqual(issues[0].brokenId, 'member2');
  assert.strictEqual(issues[0].severity, 'medium');
});

test('runDiagnostics combines all checks', () => {
  const data = {
    songs: [
      {
        id: 'song1',
        name: 'Test Song',
        tasks: [
          { name: 'Mix' }, // Missing ID
          { id: 'task2', name: 'Master', status: 'InvalidStatus' }
        ],
        era_ids: ['nonexistent']
      }
    ],
    eras: []
  };
  
  const diagnostics = runDiagnostics(data);
  assert.strictEqual(diagnostics.issues.length, 3);
  assert.strictEqual(diagnostics.summary.total, 3);
  assert.strictEqual(diagnostics.summary.high, 1);
  assert.strictEqual(diagnostics.summary.medium, 1);
  assert.strictEqual(diagnostics.summary.low, 1);
});

test('autoRepair generates IDs for tasks missing them', () => {
  const data = {
    songs: [
      {
        id: 'song1',
        name: 'Test Song',
        tasks: [
          { name: 'Mix' } // Missing ID
        ]
      }
    ]
  };
  
  const issues = checkOrphanedTasks(data);
  const result = autoRepair(data, issues);
  
  assert.strictEqual(result.repairedCount, 1);
  assert.ok(result.repairedData.songs[0].tasks[0].id);
  assert.strictEqual(result.repairLog[0].type, 'generated_id');
});

test('autoRepair resets invalid statuses', () => {
  const data = {
    globalTasks: [
      { id: 'task1', name: 'Task 1', status: 'InvalidStatus' }
    ]
  };
  
  const issues = checkInvalidStatuses(data);
  const result = autoRepair(data, issues);
  
  assert.strictEqual(result.repairedCount, 1);
  assert.strictEqual(result.repairedData.globalTasks[0].status, 'Not Started');
  assert.strictEqual(result.repairLog[0].type, 'fixed_status');
});

test('autoRepair removes broken references', () => {
  const data = {
    songs: [
      {
        id: 'song1',
        name: 'Test Song',
        era_ids: ['era1', 'era2']
      }
    ],
    eras: [
      { id: 'era1', name: 'Era 1' }
    ]
  };
  
  const issues = checkBrokenLinks(data);
  const result = autoRepair(data, issues);
  
  assert.strictEqual(result.repairedCount, 1);
  assert.deepStrictEqual(result.repairedData.songs[0].era_ids, ['era1']);
  assert.strictEqual(result.repairLog[0].type, 'removed_broken_link');
});

test('getDiagnosticStats provides summary statistics', () => {
  const diagnostics = {
    summary: {
      total: 5,
      high: 2,
      medium: 2,
      low: 1
    },
    issues: [
      { type: 'missing_id', entity: 'song' },
      { type: 'missing_id', entity: 'song' },
      { type: 'invalid_status', entity: 'release' },
      { type: 'broken_era_link', entity: 'video' },
      { type: 'broken_era_link', entity: 'video' }
    ]
  };
  
  const stats = getDiagnosticStats(diagnostics);
  
  assert.strictEqual(stats.totalIssues, 5);
  assert.strictEqual(stats.highSeverity, 2);
  assert.strictEqual(stats.issuesByType['missing_id'], 2);
  assert.strictEqual(stats.issuesByType['broken_era_link'], 2);
  assert.strictEqual(stats.issuesByEntity['song'], 2);
  assert.strictEqual(stats.issuesByEntity['video'], 2);
});

test('runDiagnostics includes timestamp', () => {
  const data = {};
  const diagnostics = runDiagnostics(data);
  
  assert.ok(diagnostics.timestamp);
  assert.ok(new Date(diagnostics.timestamp).getTime() > 0);
});

test('autoRepair handles empty issues array', () => {
  const data = { songs: [] };
  const result = autoRepair(data, []);
  
  assert.strictEqual(result.repairedCount, 0);
  assert.strictEqual(result.errorCount, 0);
  assert.strictEqual(result.repairLog.length, 0);
});
