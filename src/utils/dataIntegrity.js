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
 * Data Integrity Diagnostics Module
 * 
 * Provides automated validation and repair for:
 * - Orphaned tasks (tasks without valid parents)
 * - Invalid statuses
 * - Broken relational links
 * - Inconsistent data
 */

// Valid status options (from Store.jsx)
const VALID_STATUSES = [
  'Not Started',
  'In-Progress',
  'Waiting on Someone Else',
  'Paid But Not Complete',
  'Complete But Not Paid',
  'Complete',
  'Other',
  'Delayed',
  'Done', // Legacy alias
  'In Progress' // Legacy alias
];

// Valid task categories
const VALID_TASK_CATEGORIES = [
  'Branding', 'Web', 'Legal', 'Visuals', 'Marketing', 
  'Events', 'Audio', 'Video', 'Merch', 'Other',
  'Production', 'Recording', 'Post-Production', 'Distribution'
];

/**
 * Check for orphaned tasks (tasks without valid parent references)
 * @param {Object} data - Application data
 * @returns {Array} List of orphaned task issues
 */
export const checkOrphanedTasks = (data = {}) => {
  const issues = [];
  const { songs = [], releases = [], videos = [], events = [], globalTasks = [] } = data;
  
  // Create lookup maps for parent entities
  const songIds = new Set(songs.map(s => s.id));
  const releaseIds = new Set(releases.map(r => r.id));
  const videoIds = new Set(videos.map(v => v.id));
  const eventIds = new Set(events.map(e => e.id));
  
  // Check songs for orphaned tasks
  songs.forEach(song => {
    if (song.tasks && Array.isArray(song.tasks)) {
      song.tasks.forEach((task, index) => {
        if (!task.id) {
          issues.push({
            type: 'missing_id',
            severity: 'high',
            entity: 'song',
            entityId: song.id,
            entityName: song.name || song.title || 'Unnamed Song',
            taskIndex: index,
            message: `Task at index ${index} in song "${song.name || song.title}" is missing an ID`
          });
        }
      });
    }
    
    // Check for versions with invalid parent references
    if (song.versions && Array.isArray(song.versions)) {
      song.versions.forEach(version => {
        if (version.tasks && Array.isArray(version.tasks)) {
          version.tasks.forEach((task, index) => {
            if (!task.id) {
              issues.push({
                type: 'missing_id',
                severity: 'high',
                entity: 'version',
                entityId: version.id,
                entityName: version.name || 'Unnamed Version',
                parentId: song.id,
                parentName: song.name || song.title,
                taskIndex: index,
                message: `Task at index ${index} in version "${version.name}" is missing an ID`
              });
            }
          });
        }
      });
    }
  });
  
  // Check releases for orphaned tasks
  releases.forEach(release => {
    if (release.tasks && Array.isArray(release.tasks)) {
      release.tasks.forEach((task, index) => {
        if (!task.id) {
          issues.push({
            type: 'missing_id',
            severity: 'high',
            entity: 'release',
            entityId: release.id,
            entityName: release.name || release.title || 'Unnamed Release',
            taskIndex: index,
            message: `Task at index ${index} in release "${release.name || release.title}" is missing an ID`
          });
        }
      });
    }
  });
  
  // Check videos for orphaned tasks
  videos.forEach(video => {
    if (video.tasks && Array.isArray(video.tasks)) {
      video.tasks.forEach((task, index) => {
        if (!task.id) {
          issues.push({
            type: 'missing_id',
            severity: 'high',
            entity: 'video',
            entityId: video.id,
            entityName: video.name || video.title || 'Unnamed Video',
            taskIndex: index,
            message: `Task at index ${index} in video "${video.name || video.title}" is missing an ID`
          });
        }
      });
    }
  });
  
  // Check events for orphaned tasks
  events.forEach(event => {
    if (event.tasks && Array.isArray(event.tasks)) {
      event.tasks.forEach((task, index) => {
        if (!task.id) {
          issues.push({
            type: 'missing_id',
            severity: 'high',
            entity: 'event',
            entityId: event.id,
            entityName: event.name || event.title || 'Unnamed Event',
            taskIndex: index,
            message: `Task at index ${index} in event "${event.name || event.title}" is missing an ID`
          });
        }
      });
    }
  });
  
  return issues;
};

/**
 * Check for invalid statuses
 * @param {Object} data - Application data
 * @returns {Array} List of invalid status issues
 */
export const checkInvalidStatuses = (data = {}) => {
  const issues = [];
  const { songs = [], releases = [], videos = [], events = [], globalTasks = [] } = data;
  
  const checkTaskStatus = (task, parentType, parentId, parentName) => {
    if (task.status && !VALID_STATUSES.includes(task.status)) {
      issues.push({
        type: 'invalid_status',
        severity: 'medium',
        entity: parentType,
        entityId: parentId,
        entityName: parentName,
        taskId: task.id,
        taskName: task.name || task.title || 'Unnamed Task',
        currentStatus: task.status,
        message: `Task "${task.name || task.title}" has invalid status: "${task.status}"`
      });
    }
  };
  
  // Check songs
  songs.forEach(song => {
    if (song.tasks) {
      song.tasks.forEach(task => checkTaskStatus(task, 'song', song.id, song.name || song.title));
    }
    if (song.versions) {
      song.versions.forEach(version => {
        if (version.tasks) {
          version.tasks.forEach(task => checkTaskStatus(task, 'version', version.id, version.name));
        }
      });
    }
  });
  
  // Check releases
  releases.forEach(release => {
    if (release.tasks) {
      release.tasks.forEach(task => checkTaskStatus(task, 'release', release.id, release.name || release.title));
    }
  });
  
  // Check videos
  videos.forEach(video => {
    if (video.tasks) {
      video.tasks.forEach(task => checkTaskStatus(task, 'video', video.id, video.name || video.title));
    }
  });
  
  // Check events
  events.forEach(event => {
    if (event.tasks) {
      event.tasks.forEach(task => checkTaskStatus(task, 'event', event.id, event.name || event.title));
    }
  });
  
  // Check global tasks
  globalTasks.forEach(task => {
    if (task.status && !VALID_STATUSES.includes(task.status)) {
      issues.push({
        type: 'invalid_status',
        severity: 'medium',
        entity: 'globalTask',
        entityId: task.id,
        taskName: task.name || task.title || 'Unnamed Task',
        currentStatus: task.status,
        message: `Global task "${task.name || task.title}" has invalid status: "${task.status}"`
      });
    }
  });
  
  return issues;
};

/**
 * Check for broken relational links
 * @param {Object} data - Application data
 * @returns {Array} List of broken link issues
 */
export const checkBrokenLinks = (data = {}) => {
  const issues = [];
  const {
    songs = [],
    releases = [],
    videos = [],
    events = [],
    eras = [],
    stages = [],
    tags = [],
    teamMembers = [],
    artists = []
  } = data;
  
  // Create lookup sets
  const eraIds = new Set(eras.map(e => e.id));
  const stageIds = new Set(stages.map(s => s.id));
  const tagIds = new Set(tags.map(t => t.id));
  const teamMemberIds = new Set(teamMembers.map(tm => tm.id));
  const artistIds = new Set(artists.map(a => a.id));
  const releaseIds = new Set(releases.map(r => r.id));
  
  const checkEntityLinks = (entity, entityType) => {
    // Check era references
    if (entity.era_ids || entity.eraIds) {
      const eraList = entity.era_ids || entity.eraIds || [];
      eraList.forEach(eraId => {
        if (eraId && !eraIds.has(eraId)) {
          issues.push({
            type: 'broken_era_link',
            severity: 'low',
            entity: entityType,
            entityId: entity.id,
            entityName: entity.name || entity.title || 'Unnamed',
            brokenId: eraId,
            message: `${entityType} "${entity.name || entity.title}" references non-existent era: ${eraId}`
          });
        }
      });
    }
    
    // Check stage references
    if (entity.stage_ids || entity.stageIds) {
      const stageList = entity.stage_ids || entity.stageIds || [];
      stageList.forEach(stageId => {
        if (stageId && !stageIds.has(stageId)) {
          issues.push({
            type: 'broken_stage_link',
            severity: 'low',
            entity: entityType,
            entityId: entity.id,
            entityName: entity.name || entity.title || 'Unnamed',
            brokenId: stageId,
            message: `${entityType} "${entity.name || entity.title}" references non-existent stage: ${stageId}`
          });
        }
      });
    }
    
    // Check tag references
    if (entity.tag_ids || entity.tagIds) {
      const tagList = entity.tag_ids || entity.tagIds || [];
      tagList.forEach(tagId => {
        if (tagId && !tagIds.has(tagId)) {
          issues.push({
            type: 'broken_tag_link',
            severity: 'low',
            entity: entityType,
            entityId: entity.id,
            entityName: entity.name || entity.title || 'Unnamed',
            brokenId: tagId,
            message: `${entityType} "${entity.name || entity.title}" references non-existent tag: ${tagId}`
          });
        }
      });
    }
    
    // Check team member references
    if (entity.team_member_ids || entity.teamMemberIds || entity.assignedMembers) {
      const memberList = entity.team_member_ids || entity.teamMemberIds || entity.assignedMembers || [];
      memberList.forEach(memberId => {
        const id = typeof memberId === 'object' ? (memberId.memberId || memberId.id) : memberId;
        if (id && !teamMemberIds.has(id)) {
          issues.push({
            type: 'broken_team_member_link',
            severity: 'medium',
            entity: entityType,
            entityId: entity.id,
            entityName: entity.name || entity.title || 'Unnamed',
            brokenId: id,
            message: `${entityType} "${entity.name || entity.title}" references non-existent team member: ${id}`
          });
        }
      });
    }
  };
  
  // Check all entities
  songs.forEach(song => checkEntityLinks(song, 'song'));
  releases.forEach(release => checkEntityLinks(release, 'release'));
  videos.forEach(video => checkEntityLinks(video, 'video'));
  events.forEach(event => checkEntityLinks(event, 'event'));
  
  return issues;
};

/**
 * Run all diagnostic checks
 * @param {Object} data - Application data
 * @returns {Object} Diagnostic report with all issues
 */
export const runDiagnostics = (data = {}) => {
  const orphanedTasks = checkOrphanedTasks(data);
  const invalidStatuses = checkInvalidStatuses(data);
  const brokenLinks = checkBrokenLinks(data);
  
  const allIssues = [...orphanedTasks, ...invalidStatuses, ...brokenLinks];
  
  const summary = {
    total: allIssues.length,
    high: allIssues.filter(i => i.severity === 'high').length,
    medium: allIssues.filter(i => i.severity === 'medium').length,
    low: allIssues.filter(i => i.severity === 'low').length
  };
  
  return {
    summary,
    issues: allIssues,
    orphanedTasks,
    invalidStatuses,
    brokenLinks,
    timestamp: new Date().toISOString()
  };
};

/**
 * Auto-repair data issues
 * @param {Object} data - Application data
 * @param {Array} issues - Issues to repair
 * @returns {Object} Repaired data and repair log
 */
export const autoRepair = (data = {}, issues = []) => {
  const repairLog = [];
  let repairedData = JSON.parse(JSON.stringify(data)); // Deep clone
  
  issues.forEach(issue => {
    try {
      if (issue.type === 'missing_id') {
        // Generate IDs for tasks missing them
        const id = crypto.randomUUID();
        
        // Find and repair the task
        if (issue.entity === 'song' && repairedData.songs) {
          const song = repairedData.songs.find(s => s.id === issue.entityId);
          if (song && song.tasks && song.tasks[issue.taskIndex]) {
            song.tasks[issue.taskIndex].id = id;
            repairLog.push({
              type: 'generated_id',
              entity: issue.entity,
              entityId: issue.entityId,
              taskIndex: issue.taskIndex,
              generatedId: id,
              message: `Generated ID for task in ${issue.entity} "${issue.entityName}"`
            });
          }
        } else if (issue.entity === 'version' && repairedData.songs) {
          const song = repairedData.songs.find(s => s.id === issue.parentId);
          if (song && song.versions) {
            const version = song.versions.find(v => v.id === issue.entityId);
            if (version && version.tasks && version.tasks[issue.taskIndex]) {
              version.tasks[issue.taskIndex].id = id;
              repairLog.push({
                type: 'generated_id',
                entity: issue.entity,
                entityId: issue.entityId,
                taskIndex: issue.taskIndex,
                generatedId: id,
                message: `Generated ID for task in version "${issue.entityName}"`
              });
            }
          }
        }
        // Similar logic for releases, videos, events...
      } else if (issue.type === 'invalid_status') {
        // Reset invalid statuses to 'Not Started'
        const defaultStatus = 'Not Started';
        
        // Find and repair the entity
        const collections = {
          song: 'songs',
          release: 'releases',
          video: 'videos',
          event: 'events',
          globalTask: 'globalTasks'
        };
        
        const collectionKey = collections[issue.entity];
        if (collectionKey && repairedData[collectionKey]) {
          const entity = repairedData[collectionKey].find(e => e.id === issue.entityId);
          if (entity) {
            if (issue.taskId) {
              // Task-level status
              if (entity.tasks) {
                const task = entity.tasks.find(t => t.id === issue.taskId);
                if (task) {
                  task.status = defaultStatus;
                  repairLog.push({
                    type: 'fixed_status',
                    entity: issue.entity,
                    entityId: issue.entityId,
                    taskId: issue.taskId,
                    oldStatus: issue.currentStatus,
                    newStatus: defaultStatus,
                    message: `Reset invalid status "${issue.currentStatus}" to "${defaultStatus}"`
                  });
                }
              }
            } else {
              // Entity-level status
              entity.status = defaultStatus;
              repairLog.push({
                type: 'fixed_status',
                entity: issue.entity,
                entityId: issue.entityId,
                oldStatus: issue.currentStatus,
                newStatus: defaultStatus,
                message: `Reset invalid status "${issue.currentStatus}" to "${defaultStatus}"`
              });
            }
          }
        }
      } else if (issue.type.startsWith('broken_')) {
        // Remove broken references
        const collections = {
          song: 'songs',
          release: 'releases',
          video: 'videos',
          event: 'events'
        };
        
        const collectionKey = collections[issue.entity];
        if (collectionKey && repairedData[collectionKey]) {
          const entity = repairedData[collectionKey].find(e => e.id === issue.entityId);
          if (entity) {
            // Remove broken ID from appropriate array
            const fieldMappings = {
              broken_era_link: ['era_ids', 'eraIds'],
              broken_stage_link: ['stage_ids', 'stageIds'],
              broken_tag_link: ['tag_ids', 'tagIds'],
              broken_team_member_link: ['team_member_ids', 'teamMemberIds', 'assignedMembers']
            };
            
            const fields = fieldMappings[issue.type] || [];
            fields.forEach(field => {
              if (entity[field] && Array.isArray(entity[field])) {
                const originalLength = entity[field].length;
                entity[field] = entity[field].filter(id => {
                  const checkId = typeof id === 'object' ? (id.memberId || id.id) : id;
                  return checkId !== issue.brokenId;
                });
                
                if (entity[field].length < originalLength) {
                  repairLog.push({
                    type: 'removed_broken_link',
                    entity: issue.entity,
                    entityId: issue.entityId,
                    field,
                    brokenId: issue.brokenId,
                    message: `Removed broken reference ${issue.brokenId} from ${field}`
                  });
                }
              }
            });
          }
        }
      }
    } catch (error) {
      repairLog.push({
        type: 'repair_error',
        issue,
        error: error.message,
        message: `Failed to repair issue: ${error.message}`
      });
    }
  });
  
  return {
    repairedData,
    repairLog,
    repairedCount: repairLog.filter(r => r.type !== 'repair_error').length,
    errorCount: repairLog.filter(r => r.type === 'repair_error').length
  };
};

/**
 * Get diagnostic summary statistics
 * @param {Object} diagnostics - Diagnostic report
 * @returns {Object} Summary statistics
 */
export const getDiagnosticStats = (diagnostics = {}) => {
  const { summary = {}, issues = [] } = diagnostics;
  
  return {
    totalIssues: summary.total || 0,
    highSeverity: summary.high || 0,
    mediumSeverity: summary.medium || 0,
    lowSeverity: summary.low || 0,
    issuesByType: issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {}),
    issuesByEntity: issues.reduce((acc, issue) => {
      acc[issue.entity] = (acc[issue.entity] || 0) + 1;
      return acc;
    }, {})
  };
};
