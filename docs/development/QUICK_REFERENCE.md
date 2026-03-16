# Quick Reference: Enhanced Today & Dashboard Views

## New Features At a Glance

### Today View (`/today`)
```
┌─────────────────────────────────────┐
│  📊 STATS (4 cards)                 │
│  ├─ Total Tasks                     │
│  ├─ Overdue (red)                   │
│  ├─ Due This Week (yellow)          │
│  └─ Songs Count                     │
├─────────────────────────────────────┤
│  🎛️ SOURCE FILTERS                  │
│  🎵 Song • 💿 Release • 🎬 Video   │
│  📅 Event • ✅ Task                 │
├─────────────────────────────────────┤
│  ⚠️ OVERDUE TASKS (if any)          │
│  [Clickable task cards]             │
├─────────────────────────────────────┤
│  📅 DUE THIS WEEK                   │
│  [Clickable task cards with dates]  │
├─────────────────────────────────────┤
│  ➕ QUICK ACTIONS                   │
│  New Song • Release • Event • Task  │
└─────────────────────────────────────┘
```

### Dashboard View (`/dashboard`)
```
┌─────────────────────────────────────┐
│  📊 STATS (8 cards)                 │
│  Total • Active • Due • Overdue     │
│  Done • Paid • Remaining • Est.     │
├─────────────────────────────────────┤
│  📊 TASKS BY SOURCE                 │
│  [6 interactive cards with stats]   │
│  Song • Version • Release • Video   │
│  Event • Global Task                │
├─────────────────────────────────────┤
│  🎛️ FILTERS + VIEW TABS             │
│  Source • Stage • View              │
├─────────────────────────────────────┤
│  📋 TASK LIST / OVERVIEW            │
│  [Filtered table or category view]  │
└─────────────────────────────────────┘
```

## Key Code Patterns

### Import Task Collection
```javascript
import { collectAllTasks } from './Store';

const tasks = collectAllTasks(data);
// Returns array of all tasks with:
// { id, title, status, date, source, sourceName, sourceId }
```

### Source Badge Helper
```javascript
const getSourceBadge = (source) => ({
  'Song': { icon: 'Music', label: '🎵 Song', color: 'bg-blue-100...' },
  'Release': { icon: 'Disc', label: '💿 Release', color: 'bg-purple-100...' },
  // ... etc
})[source];
```

### Navigation Pattern
```javascript
const navigateToSource = (task) => {
  const routes = {
    'Song': `/songs/${task.sourceId}`,
    'Release': `/releases/${task.sourceId}`,
    'Event': `/events/${task.sourceId}`,
    'Global Task': `/tasks/${task.sourceId}`,
  };
  navigate(routes[task.source] || '/');
};
```

### Filter Pattern
```javascript
const [sourceFilters, setSourceFilters] = useState({
  'Song': true,
  'Release': true,
  // ... all default to true
});

const filteredTasks = tasks.filter(t => sourceFilters[t.source]);
```

### Dark Mode Conditional
```javascript
const isDark = data.settings?.themeMode === 'dark';

className={cn(
  "base-classes",
  isDark ? "dark-classes" : "light-classes"
)}
```

## Source Types & Icons

| Source       | Icon          | Color   | Emoji |
|--------------|---------------|---------|-------|
| Song         | Music         | Blue    | 🎵    |
| Version      | Music2        | Blue    | 🎵    |
| Release      | Disc          | Purple  | 💿    |
| Video        | Video         | Pink    | 🎬    |
| Event        | Calendar      | Green   | 📅    |
| Global Task  | CheckCircle   | Yellow  | ✅    |

## Task States & Colors

| Status         | Color        | Background        |
|----------------|--------------|-------------------|
| Not Started    | Gray         | bg-gray-100       |
| In Progress    | Blue         | bg-blue-100       |
| Complete/Done  | Green        | bg-green-100      |
| Delayed        | Red          | bg-red-100        |
| Overdue        | Red          | bg-red-50/bg-red-900 |
| Due Soon       | Yellow       | bg-yellow-50/bg-yellow-900 |

## Color Scheme (Dark Mode Compatible)

```javascript
// Light Mode
bg-blue-100 text-blue-800 border-blue-500

// Dark Mode  
bg-blue-900 text-blue-200 border-blue-500

// Pattern for other colors: purple, pink, green, yellow, red
```

## Useful Store Functions

```javascript
// From Store.jsx
collectAllTasks(data)        // Get all tasks from all sources
getEffectiveCost(task)        // Get best cost value
resolveCostPrecedence(task)   // Get cost source priority
calculateTaskProgress(tasks)  // Calculate % complete
getTaskDueDate(task)          // Resolve due date
```

## Component Structure

### TodayView
```
TodayView
├─ Stats Cards (4)
├─ Source Filters
├─ Overdue Section
│  └─ Task Cards (clickable)
├─ Upcoming Section
│  └─ Task Cards (clickable)
└─ Quick Actions (4 buttons)
```

### TaskDashboardView
```
TaskDashboardView
├─ Stats Cards (8)
├─ Tasks by Source
│  └─ Source Cards (6, clickable)
├─ Filters + View Tabs
└─ Content (view-dependent)
   ├─ Task Table (Upcoming/InProgress)
   └─ Overview (Category + Status)
```

## Responsive Breakpoints

```css
/* Mobile First */
default: 1 column, stacked
md:      2 columns (768px+)
lg:      3+ columns (1024px+)

/* Specific grids */
Stats:   grid-cols-2 md:grid-cols-4
Source:  grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

## Common Tailwind Classes

```javascript
// Card
THEME.punk.card // Base card styling

// Button
THEME.punk.btn  // Base button styling

// Input
THEME.punk.input // Base input styling

// Text
THEME.punk.textStyle // "uppercase font-black tracking-widest"

// Utility
cn(...classes) // Merge classes with conflict resolution
```

## Date Utilities

```javascript
const today = new Date().toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  .toISOString().split('T')[0];

const isOverdue = (date) => date && date < today;
const isDueSoon = (date) => date && date >= today && date <= nextWeek;
```

## Performance Tips

1. **Use useMemo for expensive calculations**
```javascript
const stats = useMemo(() => {
  // Calculate stats from allTasks
}, [allTasks]);
```

2. **Filter in layers**
```javascript
// First filter by source
const sourceFiltered = tasks.filter(t => sourceFilters[t.source]);
// Then filter by date/status
const finalFiltered = sourceFiltered.filter(t => /* date logic */);
```

3. **Limit display count**
```javascript
overdue.slice(0, 10) // Show max 10, add "View All" button
```

## Testing Checklist

- [ ] All sources display tasks correctly
- [ ] Filters work (Today + Dashboard)
- [ ] Navigation from tasks works
- [ ] Dark mode looks good
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Task counts accurate
- [ ] Empty states handled
- [ ] Long names truncate properly

## Common Issues & Solutions

### Issue: Tasks not showing
**Check:** Is `collectAllTasks(data)` being called?
**Check:** Are filters excluding the tasks?

### Issue: Navigation not working
**Check:** Is `useNavigate()` from react-router imported?
**Check:** Is the route path correct?

### Issue: Dark mode colors wrong
**Check:** Using `isDark` conditional?
**Check:** Both light and dark classes provided?

### Issue: Layout broken on mobile
**Check:** Using responsive classes (md:, lg:)?
**Check:** Is there overflow-x-auto for tables?

## Files Modified

1. **src/App.jsx**
   - Lines ~618-840: Enhanced TodayView

2. **src/SpecViews.jsx**  
   - Lines ~3838-4442: Enhanced TaskDashboardView

## Dependencies

- React hooks: useState, useMemo, useEffect
- React Router: useNavigate
- Lucide icons: Music, Disc, Video, Calendar, CheckCircle, etc.
- Store: useStore, collectAllTasks
- Utils: THEME, cn, formatMoney, getEffectiveCost

## Git Commit Message Template

```
feat: enhance Today and Dashboard views with comprehensive task display

- Add source-based filtering in Today view
- Add clickable task cards with navigation to source
- Add "Tasks by Source" breakdown in Dashboard
- Add source filter dropdown in Dashboard
- Improve task list table with source badges
- Full dark mode support for all new components
- Mobile responsive design
- Show overdue/upcoming tasks with visual indicators

Closes #[issue-number]
```

## Quick Commands

```bash
# View Today
Navigate to: /today

# View Dashboard  
Navigate to: /dashboard

# Test with data
- Create test songs with tasks
- Create test releases with tasks
- Set some tasks to overdue dates
- Set some tasks to today/this week
```

## Contact

For questions about this enhancement:
- See: [../history/phases/ENHANCEMENT_SUMMARY.md](../history/phases/ENHANCEMENT_SUMMARY.md)
- See: [../qa/TESTING_GUIDE.md](../qa/TESTING_GUIDE.md)
- Check: [../architecture/APP_ARCHITECTURE.md](../architecture/APP_ARCHITECTURE.md)
- Check: [../../PROJECT_DIRECTION.md](../../PROJECT_DIRECTION.md)
