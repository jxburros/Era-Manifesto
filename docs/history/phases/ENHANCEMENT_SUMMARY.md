# Today and Dashboard Views Enhancement Summary

## Overview
Enhanced the Today view and Task Dashboard view to display comprehensive task information from all sources with improved filtering, navigation, and visual presentation.

## Changes Made

### 1. TodayView Component (`src/App.jsx`)

#### New Features:
- **Source-Based Filtering**: Added filter controls to show/hide tasks by source type
  - 🎵 Songs
  - 🎵 Versions  
  - 💿 Releases
  - 🎬 Videos
  - 📅 Events
  - ✅ Global Tasks

- **Enhanced Task Display**:
  - Shows all overdue tasks (not just count) with full details
  - Displays upcoming tasks for the week with source badges
  - Added "TODAY" indicator for tasks due today
  - Task cards are clickable and navigate to their source

- **Improved Stats Cards**:
  - Total Tasks count
  - Overdue tasks (red highlight)
  - Due This Week (yellow highlight)
  - Songs count

- **Quick Actions Section**:
  - Quick buttons to create new Song, Release, Event, or Task

- **Visual Enhancements**:
  - Color-coded source badges with icons
  - Task counts per source type shown in filter buttons
  - Improved responsive design for mobile
  - Full dark mode support

#### Implementation Details:
- Uses `collectAllTasks()` from Store.jsx to aggregate tasks from all sources
- Source navigation uses React Router to navigate to detail pages
- Filter state managed with `useState` for source toggles
- Maintains existing THEME.punk styling system

### 2. TaskDashboardView Component (`src/SpecViews.jsx`)

#### New Features:
- **Tasks by Source Breakdown Section**:
  - Visual cards showing task counts per source type
  - Progress bars showing completion percentage
  - Statistics: Done, Active (In Progress), Overdue
  - Interactive cards - click to filter by that source

- **Source Filtering Dropdown**:
  - Added "All Sources" filter alongside existing Stage filter
  - Filters: All, Songs, Versions, Releases, Videos, Events, Global Tasks

- **Enhanced Task List Table**:
  - Added "Source" column with icon badges
  - Separate "From" column showing the source item name
  - Color-coded source badges matching the breakdown section
  - Improved table row hover states

- **Improved Dark Mode Support**:
  - All new UI elements support dark mode
  - Consistent color scheme across light/dark themes
  - Proper contrast ratios for accessibility

#### Implementation Details:
- New `sourceGroups` useMemo hook to calculate stats by source
- Source filter state: `sourceFilter` with values 'all' or specific source names
- Reused existing `sourceInfo` structure with icon and color mapping
- Updated task filtering logic to include source filter

## Technical Details

### Data Flow:
1. `collectAllTasks(data)` aggregates tasks from:
   - Songs (deadlines + customTasks)
   - Versions (tasks)
   - Releases (tasks + customTasks)
   - Videos (tasks + customTasks)
   - Events (tasks + customTasks)
   - Global Tasks (standalone tasks)

2. Each task includes:
   - `id`, `title`, `status`, `date` (due date)
   - `source`: Source type (Song, Release, etc.)
   - `sourceName`: Name of the parent item
   - `sourceId`: ID of the parent item for navigation

### Navigation:
- Songs/Versions → `/songs/{id}`
- Releases → `/releases/{id}`
- Videos → `/videos` (list view)
- Events → `/events/{id}`
- Global Tasks → `/tasks/{id}`

### Styling:
- Uses `THEME.punk` constants for consistent brutalist styling
- Color scheme maintains existing pink/cyan/lime/violet accent system
- Border styles: `border-[3px]` or `border-4` for punk aesthetic
- Shadows: `shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]`
- Uppercase, bold text for headers and labels

## Testing Checklist

- [x] Tasks from all sources appear correctly
- [x] Source filtering works in both views
- [x] Navigation from tasks to sources works
- [x] Responsive design on mobile devices
- [x] Dark mode compatibility verified
- [x] Task counts are accurate
- [x] Overdue tasks highlighted properly
- [x] Quick action buttons navigate correctly
- [x] Source badges display correct icons
- [x] Progress calculations accurate in dashboard

## Files Modified

1. `/home/runner/work/Era-Manifesto/Era-Manifesto/src/App.jsx`
   - Enhanced TodayView component (lines ~618-653)
   - Added source filtering, task navigation, enhanced UI

2. `/home/runner/work/Era-Manifesto/Era-Manifesto/src/SpecViews.jsx`
   - Enhanced TaskDashboardView component (lines ~3838-4442)
   - Added source breakdown section
   - Added source filtering
   - Enhanced task list table with source badges

## Dependencies Used

- Existing components: `Icon`, `collectAllTasks`, `useStore`
- React hooks: `useState`, `useMemo`, `useEffect`
- React Router: `useNavigate` for navigation
- Lucide icons: Music, Music2, Disc, Video, Calendar, CheckCircle, etc.
- Utils: `THEME`, `cn`, `formatMoney`, `getEffectiveCost`

## Design Patterns Followed

1. **State Management**: Used Store context pattern
2. **Styling**: Maintained brutalist/punk theme system
3. **Dark Mode**: Applied consistent dark mode support
4. **Responsive**: Mobile-first grid layouts
5. **Accessibility**: Proper contrast, hover states, keyboard navigation
6. **Data Flow**: Leveraged existing data aggregation functions

## Future Enhancements (Optional)

- Add ability to complete tasks directly from Today view
- Add task search/filter by name
- Add date range picker for custom task viewing
- Add export tasks to CSV/PDF functionality
- Add task sorting options (by date, status, source)
- Add task priority indicators
- Add keyboard shortcuts for quick navigation

## Notes

- All changes maintain backward compatibility
- No breaking changes to existing functionality
- Follows established component patterns in codebase
- Uses existing utility functions and helpers
- Maintains performance with useMemo for expensive calculations
