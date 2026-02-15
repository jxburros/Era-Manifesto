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

export const resolveCostPrecedence = (entity = {}) => {
  const actual = entity.actualCost || 0;
  const paid = entity.amount_paid || entity.paidCost || entity.amountPaid || 0;
  const partial = entity.partially_paid || entity.partiallyPaidAmount || entity.partialPaidCost || 0;
  const quoted = entity.quoted_cost || entity.quotedCost || 0;
  const estimated = entity.estimated_cost || entity.estimatedCost || 0;

  if (actual > 0) return { value: actual, source: 'actual' };
  if (paid > 0) return { value: paid, source: 'paid' };
  if (partial > 0) return { value: partial, source: 'partially_paid' };
  if (quoted > 0) return { value: quoted, source: 'quoted' };
  return { value: estimated, source: 'estimated' };
};

export const getEffectiveCost = (entity = {}) => resolveCostPrecedence(entity).value;
