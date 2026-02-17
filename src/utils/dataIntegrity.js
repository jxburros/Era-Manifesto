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
 * Data Integrity Diagnostics
 * 
 * Validates data consistency and identifies issues such as:
 * - Orphaned tasks (tasks without valid parent references)
 * - Invalid status values
 * - Broken relational links
 * - Missing required fields
 * 
 * Usage:
 * import { runDiagnostics, repairIssues } from './utils/dataIntegrity';
 * const report = runDiagnostics(data);
 * const repairedData = repairIssues(data, report, { autoFix: true });
 */

import { STATUS_OPTIONS } from '../domain/taskLogic.js';

/**
 * Validates that referenced entities exist
 */
const validateReference = (id, collection, collectionName) => {
  if (!id) return null;
  const found = collection.find(item => item.id === id);
  if (!found) {
    return {
      type: 'broken_reference',
      severity: 'warning',
      message: `Referenced ${collectionName} with ID "${id}" does not exist`,
      referenceId: id,
      collectionName
    };
  }
  return null;
};

/**
 * Check for orphaned tasks (tasks with invalid parent references)
 */
const _checkOrphanedParentRefs = (data) => {
  const issues = [];
  const { songs = [], releases = [], standaloneVideos = [], events = [] } = data;

  // Build parent lookup maps
  const songIds = new Set(songs.map(s => s.id));
  const releaseIds = new Set(releases.map(r => r.id));
  const videoIds = new Set(standaloneVideos.map(v => v.id));
  const eventIds = new Set(events.map(e => e.id));

  // Check song tasks
  songs.forEach(song => {
    (song.deadlines || []).forEach(task => {
      if (task.parentSongId && !songIds.has(task.parentSongId)) {
        issues.push({
          type: 'orphaned_task',
          severity: 'error',
          message: `Song task "${task.type || task.title}" references non-existent parent song`,
          taskId: task.id || `${song.id}-${task.type}`,
          parentId: task.parentSongId,
          parentType: 'song',
          suggestedFix: 'Remove parentSongId or delete task'
        });
      }
    });

    (song.customTasks || []).forEach(task => {
      if (task.parentSongId && !songIds.has(task.parentSongId)) {
        issues.push({
          type: 'orphaned_task',
          severity: 'error',
          message: `Song custom task "${task.title}" references non-existent parent song`,
          taskId: task.id,
          parentId: task.parentSongId,
          parentType: 'song',
          suggestedFix: 'Remove parentSongId or delete task'
        });
      }
    });

    // Check song versions
    (song.versions || []).forEach(version => {
      (version.tasks || []).forEach(task => {
        if (task.parentVersionId && !version.id) {
          issues.push({
            type: 'orphaned_task',
            severity: 'error',
            message: `Version task "${task.type}" references version without ID`,
            taskId: task.id || `${version.name}-${task.type}`,
            parentId: task.parentVersionId,
            parentType: 'version',
            suggestedFix: 'Assign version ID or delete task'
          });
        }
      });
    });
  });

  // Check release tasks
  releases.forEach(release => {
    (release.tasks || []).forEach(task => {
      if (task.parentReleaseId && !releaseIds.has(task.parentReleaseId)) {
        issues.push({
          type: 'orphaned_task',
          severity: 'error',
          message: `Release task "${task.type || task.title}" references non-existent parent release`,
          taskId: task.id || `${release.id}-${task.type}`,
          parentId: task.parentReleaseId,
          parentType: 'release',
          suggestedFix: 'Remove parentReleaseId or delete task'
        });
      }
    });

    (release.customTasks || []).forEach(task => {
      if (task.parentReleaseId && !releaseIds.has(task.parentReleaseId)) {
        issues.push({
          type: 'orphaned_task',
          severity: 'error',
          message: `Release custom task "${task.title}" references non-existent parent release`,
          taskId: task.id,
          parentId: task.parentReleaseId,
          parentType: 'release',
          suggestedFix: 'Remove parentReleaseId or delete task'
        });
      }
    });
  });

  // Check video tasks
  standaloneVideos.forEach(video => {
    (video.tasks || []).forEach(task => {
      if (task.parentVideoId && !videoIds.has(task.parentVideoId)) {
        issues.push({
          type: 'orphaned_task',
          severity: 'error',
          message: `Video task "${task.type || task.title}" references non-existent parent video`,
          taskId: task.id || `${video.id}-${task.type}`,
          parentId: task.parentVideoId,
          parentType: 'video',
          suggestedFix: 'Remove parentVideoId or delete task'
        });
      }
    });
  });

  // Check event tasks
  events.forEach(event => {
    (event.customTasks || []).forEach(task => {
      if (task.parentEventId && !eventIds.has(task.parentEventId)) {
        issues.push({
          type: 'orphaned_task',
          severity: 'error',
          message: `Event task "${task.title}" references non-existent parent event`,
          taskId: task.id,
          parentId: task.parentEventId,
          parentType: 'event',
          suggestedFix: 'Remove parentEventId or delete task'
        });
      }
    });
  });

  return issues;
};

/**
 * Check for invalid status values (legacy internal check)
 */
const _checkInvalidStatusValues = (data) => {
  const issues = [];
  const validStatuses = new Set(STATUS_OPTIONS);
  const { songs = [], releases = [], standaloneVideos = [], events = [], globalTasks = [] } = data;

  const checkTaskStatus = (task, location) => {
    if (task.status && !validStatuses.has(task.status)) {
      issues.push({
        type: 'invalid_status',
        severity: 'warning',
        message: `Invalid status "${task.status}" in ${location}`,
        taskId: task.id,
        currentStatus: task.status,
        suggestedFix: 'Set to "Not Started" or another valid status'
      });
    }
  };

  // Check all tasks
  songs.forEach(song => {
    (song.deadlines || []).forEach(task => checkTaskStatus(task, `song "${song.title}"`));
    (song.customTasks || []).forEach(task => checkTaskStatus(task, `song "${song.title}" custom tasks`));
    (song.versions || []).forEach(version => {
      (version.tasks || []).forEach(task => checkTaskStatus(task, `song "${song.title}" version "${version.name}"`));
    });
  });

  releases.forEach(release => {
    (release.tasks || []).forEach(task => checkTaskStatus(task, `release "${release.name}"`));
    (release.customTasks || []).forEach(task => checkTaskStatus(task, `release "${release.name}" custom tasks`));
  });

  standaloneVideos.forEach(video => {
    (video.tasks || []).forEach(task => checkTaskStatus(task, `video "${video.title}"`));
  });

  events.forEach(event => {
    (event.customTasks || []).forEach(task => checkTaskStatus(task, `event "${event.title}"`));
  });

  globalTasks.forEach(task => {
    checkTaskStatus(task, 'global tasks');
  });

  return issues;
};

/**
 * Check for broken reference links (eras, stages, tags, team members) - legacy internal
 */
const _checkBrokenReferences = (data) => {
  const issues = [];
  const { songs = [], releases = [], standaloneVideos = [], events = [], globalTasks = [], 
          eras = [], stages = [], tags = [], teamMembers = [] } = data;

  // Check era references
  songs.forEach(song => {
    (song.eraIds || []).forEach(eraId => {
      const issue = validateReference(eraId, eras, 'era');
      if (issue) {
        issues.push({ ...issue, entityType: 'song', entityId: song.id, entityName: song.title });
      }
    });
  });

  releases.forEach(release => {
    (release.eraIds || []).forEach(eraId => {
      const issue = validateReference(eraId, eras, 'era');
      if (issue) {
        issues.push({ ...issue, entityType: 'release', entityId: release.id, entityName: release.name });
      }
    });
  });

  // Check stage references
  songs.forEach(song => {
    (song.stageIds || []).forEach(stageId => {
      const issue = validateReference(stageId, stages, 'stage');
      if (issue) {
        issues.push({ ...issue, entityType: 'song', entityId: song.id, entityName: song.title });
      }
    });
  });

  // Check tag references
  const checkTags = (item, type) => {
    (item.tagIds || []).forEach(tagId => {
      const issue = validateReference(tagId, tags, 'tag');
      if (issue) {
        issues.push({ ...issue, entityType: type, entityId: item.id, entityName: item.title || item.name });
      }
    });
  };

  songs.forEach(song => checkTags(song, 'song'));
  releases.forEach(release => checkTags(release, 'release'));
  standaloneVideos.forEach(video => checkTags(video, 'video'));
  events.forEach(event => checkTags(event, 'event'));
  globalTasks.forEach(task => checkTags(task, 'global_task'));

  // Check team member references in tasks
  const checkTeamMembers = (task, location) => {
    (task.assignedMembers || []).forEach(assignment => {
      if (assignment.memberId) {
        const issue = validateReference(assignment.memberId, teamMembers, 'team member');
        if (issue) {
          issues.push({ 
            ...issue, 
            taskId: task.id, 
            location,
            suggestedFix: 'Remove assignment or add team member' 
          });
        }
      }
    });
  };

  songs.forEach(song => {
    (song.deadlines || []).forEach(task => checkTeamMembers(task, `song "${song.title}"`));
    (song.customTasks || []).forEach(task => checkTeamMembers(task, `song "${song.title}" custom tasks`));
    (song.versions || []).forEach(version => {
      (version.tasks || []).forEach(task => checkTeamMembers(task, `song "${song.title}" version "${version.name}"`));
    });
  });

  releases.forEach(release => {
    (release.tasks || []).forEach(task => checkTeamMembers(task, `release "${release.name}"`));
    (release.customTasks || []).forEach(task => checkTeamMembers(task, `release "${release.name}" custom tasks`));
  });

  globalTasks.forEach(task => checkTeamMembers(task, 'global tasks'));

  return issues;
};

/**
 * Check for missing required fields
 */
const checkMissingRequiredFields = (data) => {
  const issues = [];
  const { songs = [], releases = [], globalTasks = [] } = data;

  // Check songs
  songs.forEach((song, index) => {
    if (!song.id) {
      issues.push({
        type: 'missing_required_field',
        severity: 'error',
        message: `Song at index ${index} is missing required field: id`,
        entityType: 'song',
        entityIndex: index,
        field: 'id',
        suggestedFix: 'Generate a unique ID'
      });
    }
    if (!song.title || song.title.trim() === '') {
      issues.push({
        type: 'missing_required_field',
        severity: 'warning',
        message: `Song "${song.id}" is missing title`,
        entityType: 'song',
        entityId: song.id,
        field: 'title',
        suggestedFix: 'Add a title'
      });
    }
  });

  // Check releases
  releases.forEach((release, index) => {
    if (!release.id) {
      issues.push({
        type: 'missing_required_field',
        severity: 'error',
        message: `Release at index ${index} is missing required field: id`,
        entityType: 'release',
        entityIndex: index,
        field: 'id',
        suggestedFix: 'Generate a unique ID'
      });
    }
    if (!release.name || release.name.trim() === '') {
      issues.push({
        type: 'missing_required_field',
        severity: 'warning',
        message: `Release "${release.id}" is missing name`,
        entityType: 'release',
        entityId: release.id,
        field: 'name',
        suggestedFix: 'Add a name'
      });
    }
  });

  // Check global tasks
  globalTasks.forEach((task, index) => {
    if (!task.id) {
      issues.push({
        type: 'missing_required_field',
        severity: 'error',
        message: `Global task at index ${index} is missing required field: id`,
        entityType: 'global_task',
        entityIndex: index,
        field: 'id',
        suggestedFix: 'Generate a unique ID'
      });
    }
    if (!task.taskName || task.taskName.trim() === '') {
      issues.push({
        type: 'missing_required_field',
        severity: 'warning',
        message: `Global task "${task.id}" is missing taskName`,
        entityType: 'global_task',
        entityId: task.id,
        field: 'taskName',
        suggestedFix: 'Add a task name'
      });
    }
  });

  return issues;
};

/**
 * Legacy diagnostic runner (internal use only)
 * @param {Object} data - The application data
 * @returns {Object} Diagnostic report with issues grouped by type and severity
 */
const _runDiagnosticsLegacy = (data) => {
  const issues = [
    ..._checkOrphanedParentRefs(data),
    ..._checkInvalidStatusValues(data),
    ..._checkBrokenReferences(data),
    ...checkMissingRequiredFields(data)
  ];

  // Group issues by type and severity
  const byType = {};
  const bySeverity = { error: [], warning: [], info: [] };

  issues.forEach(issue => {
    // Group by type
    if (!byType[issue.type]) {
      byType[issue.type] = [];
    }
    byType[issue.type].push(issue);

    // Group by severity
    bySeverity[issue.severity].push(issue);
  });

  return {
    totalIssues: issues.length,
    errorCount: bySeverity.error.length,
    warningCount: bySeverity.warning.length,
    infoCount: bySeverity.info.length,
    issues,
    byType,
    bySeverity,
    timestamp: new Date().toISOString()
  };
};

/**
 * Repair data issues based on diagnostic report
 * @param {Object} data - The application data
 * @param {Object} report - Diagnostic report from runDiagnostics
 * @param {Object} options - Repair options { autoFix: boolean, removeOrphans: boolean }
 * @returns {Object} Repaired data and repair log
 */
export const repairIssues = (data, report, options = {}) => {
  const { autoFix = false, removeOrphans = false } = options;
  const repairLog = [];
  const repairedData = JSON.parse(JSON.stringify(data)); // Deep clone

  if (!autoFix) {
    return {
      data: repairedData,
      repairLog: [{
        action: 'none',
        message: 'Auto-repair is disabled. No changes made.',
        timestamp: new Date().toISOString()
      }]
    };
  }

  // Repair invalid statuses
  report.bySeverity.warning
    .filter(issue => issue.type === 'invalid_status')
    .forEach(issue => {
      // Find and fix the task
      const fixTask = (task) => {
        if (task.id === issue.taskId) {
          task.status = 'Not Started';
          repairLog.push({
            action: 'fix_status',
            message: `Changed status from "${issue.currentStatus}" to "Not Started" for task ${issue.taskId}`,
            taskId: issue.taskId,
            oldValue: issue.currentStatus,
            newValue: 'Not Started',
            timestamp: new Date().toISOString()
          });
        }
      };

      // Search through all collections
      (repairedData.songs || []).forEach(song => {
        (song.deadlines || []).forEach(fixTask);
        (song.customTasks || []).forEach(fixTask);
        (song.versions || []).forEach(version => {
          (version.tasks || []).forEach(fixTask);
        });
      });
      (repairedData.releases || []).forEach(release => {
        (release.tasks || []).forEach(fixTask);
        (release.customTasks || []).forEach(fixTask);
      });
      (repairedData.standaloneVideos || []).forEach(video => {
        (video.tasks || []).forEach(fixTask);
      });
      (repairedData.events || []).forEach(event => {
        (event.customTasks || []).forEach(fixTask);
      });
      (repairedData.globalTasks || []).forEach(fixTask);
    });

  // Remove orphaned tasks if requested
  if (removeOrphans) {
    report.bySeverity.error
      .filter(issue => issue.type === 'orphaned_task')
      .forEach(issue => {
        // Remove orphaned tasks by filtering them out
        (repairedData.songs || []).forEach(song => {
          const beforeCount = (song.deadlines || []).length + (song.customTasks || []).length;
          song.deadlines = (song.deadlines || []).filter(task => 
            (task.id || `${song.id}-${task.type}`) !== issue.taskId
          );
          song.customTasks = (song.customTasks || []).filter(task => 
            task.id !== issue.taskId
          );
          const afterCount = song.deadlines.length + song.customTasks.length;
          
          if (beforeCount !== afterCount) {
            repairLog.push({
              action: 'remove_orphan',
              message: `Removed orphaned task ${issue.taskId} from song ${song.id}`,
              taskId: issue.taskId,
              parentId: song.id,
              timestamp: new Date().toISOString()
            });
          }
        });

        // Similar for releases, videos, events
        (repairedData.releases || []).forEach(release => {
          const beforeCount = (release.tasks || []).length + (release.customTasks || []).length;
          release.tasks = (release.tasks || []).filter(task => 
            (task.id || `${release.id}-${task.type}`) !== issue.taskId
          );
          release.customTasks = (release.customTasks || []).filter(task => 
            task.id !== issue.taskId
          );
          const afterCount = release.tasks.length + release.customTasks.length;
          
          if (beforeCount !== afterCount) {
            repairLog.push({
              action: 'remove_orphan',
              message: `Removed orphaned task ${issue.taskId} from release ${release.id}`,
              taskId: issue.taskId,
              parentId: release.id,
              timestamp: new Date().toISOString()
            });
          }
        });
      });
  }

  // Remove broken references (eras, stages, tags)
  report.bySeverity.warning
    .filter(issue => issue.type === 'broken_reference')
    .forEach(issue => {
      const removeRef = (item) => {
        if (issue.collectionName === 'era' && item.eraIds) {
          const before = item.eraIds.length;
          item.eraIds = item.eraIds.filter(id => id !== issue.referenceId);
          if (before !== item.eraIds.length) {
            repairLog.push({
              action: 'remove_broken_ref',
              message: `Removed broken era reference ${issue.referenceId}`,
              entityId: item.id,
              refId: issue.referenceId,
              timestamp: new Date().toISOString()
            });
          }
        }
        if (issue.collectionName === 'stage' && item.stageIds) {
          const before = item.stageIds.length;
          item.stageIds = item.stageIds.filter(id => id !== issue.referenceId);
          if (before !== item.stageIds.length) {
            repairLog.push({
              action: 'remove_broken_ref',
              message: `Removed broken stage reference ${issue.referenceId}`,
              entityId: item.id,
              refId: issue.referenceId,
              timestamp: new Date().toISOString()
            });
          }
        }
        if (issue.collectionName === 'tag' && item.tagIds) {
          const before = item.tagIds.length;
          item.tagIds = item.tagIds.filter(id => id !== issue.referenceId);
          if (before !== item.tagIds.length) {
            repairLog.push({
              action: 'remove_broken_ref',
              message: `Removed broken tag reference ${issue.referenceId}`,
              entityId: item.id,
              refId: issue.referenceId,
              timestamp: new Date().toISOString()
            });
          }
        }
      };

      (repairedData.songs || []).forEach(removeRef);
      (repairedData.releases || []).forEach(removeRef);
      (repairedData.standaloneVideos || []).forEach(removeRef);
      (repairedData.events || []).forEach(removeRef);
      (repairedData.globalTasks || []).forEach(removeRef);
    });

  return {
    data: repairedData,
    repairLog,
    timestamp: new Date().toISOString()
  };
};

// ---------------------------------------------------------------------------
// Public API — functions expected by the test suite and external consumers
// ---------------------------------------------------------------------------

const VALID_STATUSES = new Set([
  'Not Started', 'In-Progress', 'In Progress', 'Waiting on Someone Else',
  'Paid But Not Complete', 'Complete But Not Paid', 'Complete', 'Done', 'Other'
]);

/**
 * Check for tasks that are missing an ID field.
 * @param {Object} data - Application data
 * @returns {Array} Issues with type 'missing_id' and severity 'high'
 */
export const checkOrphanedTasks = (data) => {
  const issues = [];
  const collections = ['songs', 'releases', 'videos', 'events', 'globalTasks'];

  const scanTasks = (tasks, entity, entityType) => {
    (tasks || []).forEach(task => {
      if (!task.id) {
        issues.push({
          type: 'missing_id',
          severity: 'high',
          message: `Task in ${entityType} "${entity.id || entity.name || entity.title}" is missing an ID`,
          entity: entityType,
          entityId: entity.id,
          task
        });
      }
    });
  };

  (data.songs || []).forEach(song => {
    scanTasks(song.tasks, song, 'song');
    (song.versions || []).forEach(v => scanTasks(v.tasks, song, 'song'));
  });
  (data.releases || []).forEach(r => scanTasks(r.tasks, r, 'release'));
  (data.videos || []).forEach(v => scanTasks(v.tasks, v, 'video'));
  (data.events || []).forEach(e => scanTasks(e.tasks, e, 'event'));
  (data.globalTasks || []).forEach(task => {
    if (!task.id) {
      issues.push({
        type: 'missing_id',
        severity: 'high',
        message: `Global task is missing an ID`,
        entity: 'globalTask',
        task
      });
    }
  });

  return issues;
};

/**
 * Check for tasks with invalid status values.
 * @param {Object} data - Application data
 * @returns {Array} Issues with type 'invalid_status' and severity 'medium'
 */
export const checkInvalidStatuses = (data) => {
  const issues = [];

  const scanTasks = (tasks, entityType, entityId) => {
    (tasks || []).forEach(task => {
      if (task.status && !VALID_STATUSES.has(task.status)) {
        issues.push({
          type: 'invalid_status',
          severity: 'medium',
          message: `Task "${task.id}" has invalid status "${task.status}"`,
          entity: entityType,
          entityId,
          taskId: task.id,
          currentStatus: task.status,
          suggestedFix: 'Set to "Not Started" or another valid status'
        });
      }
    });
  };

  (data.songs || []).forEach(s => {
    scanTasks(s.tasks, 'song', s.id);
    (s.versions || []).forEach(v => scanTasks(v.tasks, 'song', s.id));
  });
  (data.releases || []).forEach(r => scanTasks(r.tasks, 'release', r.id));
  (data.videos || []).forEach(v => scanTasks(v.tasks, 'video', v.id));
  (data.events || []).forEach(e => scanTasks(e.tasks, 'event', e.id));
  scanTasks(data.globalTasks, 'globalTask', null);

  return issues;
};

/**
 * Check for broken era and team member references.
 * @param {Object} data - Application data
 * @returns {Array} Issues with broken link types and severities
 */
export const checkBrokenLinks = (data) => {
  const issues = [];
  const eraIds = new Set((data.eras || []).map(e => e.id));
  const memberIds = new Set((data.teamMembers || []).map(m => m.id));

  const collections = ['songs', 'releases', 'videos', 'events', 'globalTasks'];
  collections.forEach(col => {
    (data[col] || []).forEach(item => {
      (item.era_ids || []).forEach(id => {
        if (!eraIds.has(id)) {
          issues.push({
            type: 'broken_era_link',
            severity: 'low',
            message: `${col} "${item.id}" references non-existent era "${id}"`,
            entity: col,
            entityId: item.id,
            brokenId: id
          });
        }
      });
      (item.team_member_ids || []).forEach(id => {
        if (!memberIds.has(id)) {
          issues.push({
            type: 'broken_team_member_link',
            severity: 'medium',
            message: `${col} "${item.id}" references non-existent team member "${id}"`,
            entity: col,
            entityId: item.id,
            brokenId: id
          });
        }
      });
    });
  });

  return issues;
};

/**
 * Run all diagnostics and return issues with a summary.
 * @param {Object} data - Application data
 * @returns {{ issues: Array, summary: Object, timestamp: string }}
 */
export const runDiagnostics = (data) => {
  const issues = [
    ...checkOrphanedTasks(data),
    ...checkInvalidStatuses(data),
    ...checkBrokenLinks(data)
  ];

  const summary = {
    total: issues.length,
    high: issues.filter(i => i.severity === 'high').length,
    medium: issues.filter(i => i.severity === 'medium').length,
    low: issues.filter(i => i.severity === 'low').length
  };

  return { issues, summary, timestamp: new Date().toISOString() };
};

/**
 * Auto-repair a list of issues, returning repaired data and a repair log.
 * @param {Object} data - Application data
 * @param {Array} issues - Issues from checkOrphanedTasks / checkInvalidStatuses / checkBrokenLinks
 * @returns {{ repairedData: Object, repairedCount: number, errorCount: number, repairLog: Array }}
 */
export const autoRepair = (data, issues = []) => {
  const repairedData = JSON.parse(JSON.stringify(data));
  const repairLog = [];
  let repairedCount = 0;
  let errorCount = 0;

  const generateId = () =>
    `repaired-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  issues.forEach(issue => {
    try {
      if (issue.type === 'missing_id') {
        // Generate IDs for tasks that lack them
        const fixTasksIn = (tasks) => {
          (tasks || []).forEach(task => {
            if (!task.id) {
              task.id = generateId();
              repairLog.push({ type: 'generated_id', taskId: task.id, issue });
              repairedCount++;
            }
          });
        };

        (repairedData.songs || []).forEach(s => {
          fixTasksIn(s.tasks);
          (s.versions || []).forEach(v => fixTasksIn(v.tasks));
        });
        (repairedData.releases || []).forEach(r => fixTasksIn(r.tasks));
        (repairedData.videos || []).forEach(v => fixTasksIn(v.tasks));
        (repairedData.events || []).forEach(e => fixTasksIn(e.tasks));
        fixTasksIn(repairedData.globalTasks);

      } else if (issue.type === 'invalid_status') {
        // Reset invalid statuses to 'Not Started'
        const fixTasksIn = (tasks) => {
          (tasks || []).forEach(task => {
            if (task.id === issue.taskId && !VALID_STATUSES.has(task.status)) {
              task.status = 'Not Started';
              repairLog.push({ type: 'fixed_status', taskId: task.id, issue });
              repairedCount++;
            }
          });
        };

        (repairedData.songs || []).forEach(s => {
          fixTasksIn(s.tasks);
          (s.versions || []).forEach(v => fixTasksIn(v.tasks));
        });
        (repairedData.releases || []).forEach(r => fixTasksIn(r.tasks));
        (repairedData.videos || []).forEach(v => fixTasksIn(v.tasks));
        (repairedData.events || []).forEach(e => fixTasksIn(e.tasks));
        fixTasksIn(repairedData.globalTasks);

      } else if (issue.type === 'broken_era_link') {
        // Remove the broken era ID from the entity
        const removeFrom = (collections) => {
          collections.forEach(col => {
            (repairedData[col] || []).forEach(item => {
              if (item.era_ids && item.era_ids.includes(issue.brokenId)) {
                item.era_ids = item.era_ids.filter(id => id !== issue.brokenId);
                repairLog.push({ type: 'removed_broken_link', entityId: item.id, brokenId: issue.brokenId, issue });
                repairedCount++;
              }
            });
          });
        };
        removeFrom(['songs', 'releases', 'videos', 'events', 'globalTasks']);

      } else if (issue.type === 'broken_team_member_link') {
        const removeFrom = (collections) => {
          collections.forEach(col => {
            (repairedData[col] || []).forEach(item => {
              if (item.team_member_ids && item.team_member_ids.includes(issue.brokenId)) {
                item.team_member_ids = item.team_member_ids.filter(id => id !== issue.brokenId);
                repairLog.push({ type: 'removed_broken_link', entityId: item.id, brokenId: issue.brokenId, issue });
                repairedCount++;
              }
            });
          });
        };
        removeFrom(['songs', 'releases', 'videos', 'events', 'globalTasks']);
      }
    } catch (err) {
      errorCount++;
      repairLog.push({ type: 'error', error: err.message, issue });
    }
  });

  return { repairedData, repairedCount, errorCount, repairLog };
};

/**
 * Compute summary statistics from a diagnostics object.
 * @param {{ summary: Object, issues: Array }} diagnostics
 * @returns {{ totalIssues, highSeverity, issuesByType, issuesByEntity }}
 */
export const getDiagnosticStats = (diagnostics) => {
  const issuesByType = {};
  const issuesByEntity = {};

  (diagnostics.issues || []).forEach(issue => {
    issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
    if (issue.entity) {
      issuesByEntity[issue.entity] = (issuesByEntity[issue.entity] || 0) + 1;
    }
  });

  return {
    totalIssues: diagnostics.summary?.total ?? (diagnostics.issues?.length ?? 0),
    highSeverity: diagnostics.summary?.high ?? 0,
    issuesByType,
    issuesByEntity
  };
};
