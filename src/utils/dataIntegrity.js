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
const checkOrphanedTasks = (data) => {
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
 * Check for invalid status values
 */
const checkInvalidStatuses = (data) => {
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
 * Check for broken reference links (eras, stages, tags, team members)
 */
const checkBrokenReferences = (data) => {
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
 * Run all diagnostics and return a comprehensive report
 * @param {Object} data - The application data
 * @returns {Object} Diagnostic report with issues grouped by type and severity
 */
export const runDiagnostics = (data) => {
  const issues = [
    ...checkOrphanedTasks(data),
    ...checkInvalidStatuses(data),
    ...checkBrokenReferences(data),
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
