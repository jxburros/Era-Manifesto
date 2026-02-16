# Testing Guide: Today and Dashboard Views Enhancement

## Pre-Testing Setup

1. **Ensure test data exists:**
   - At least 3 songs with tasks
   - At least 2 releases with tasks
   - At least 1 video with tasks
   - At least 1 event with tasks
   - At least 2 global tasks
   - Mix of task statuses (Not Started, In Progress, Complete, Delayed)
   - Mix of dates (overdue, today, this week, future)

2. **Test both themes:**
   - Light mode
   - Dark mode (Settings → Toggle Dark Mode)

3. **Test responsive design:**
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

## Today View Testing

### Test 1: Basic Display
**Steps:**
1. Navigate to Today view (sidebar or `/today`)
2. Verify stats cards display correct counts
3. Check that all 4 stat cards are visible

**Expected Results:**
- Total Tasks shows count of incomplete tasks
- Overdue shows count with red background
- Due This Week shows count with yellow background
- Songs shows total song count
- All cards are clickable

### Test 2: Source Filters
**Steps:**
1. On Today view, locate "Filter by Source" section
2. Click each source filter button
3. Verify task counts update in real-time

**Expected Results:**
- Each source button shows icon and count
- Active filters are highlighted with color
- Inactive filters are grayed out
- Tasks in sections below update when filters change
- All filters can be toggled independently

### Test 3: Overdue Tasks Section
**Steps:**
1. Ensure you have at least 1 overdue task
2. Scroll to "Overdue Tasks" section
3. Click on an overdue task

**Expected Results:**
- Section only appears if overdue tasks exist
- Shows up to 10 overdue tasks
- Each task shows: title, source name, source badge, date, status
- Tasks have red background/border
- Clicking task navigates to source detail page
- If >10 overdue, "View All" button appears

### Test 4: Upcoming Tasks Section
**Steps:**
1. Review "Due This Week" section
2. Look for tasks due today
3. Click "View All" if present
4. Click on an upcoming task

**Expected Results:**
- Shows tasks due within 7 days
- Tasks due TODAY have yellow background and "📍 TODAY" badge
- Other tasks show their due date
- Source badges display with correct colors
- Clicking navigates to source
- Empty state message if no upcoming tasks

### Test 5: Quick Actions
**Steps:**
1. Scroll to bottom of Today view
2. Click each of the 4 quick action buttons

**Expected Results:**
- "New Song" navigates to Songs view
- "New Release" navigates to Releases view
- "New Event" navigates to Events view
- "New Task" navigates to Global Tasks view
- All buttons have icons and labels

### Test 6: Navigation from Tasks
**Steps:**
1. Find a task from a Song source
2. Click it
3. Verify you're on the song detail page
4. Go back to Today view
5. Repeat for Release, Event, and Global Task sources

**Expected Results:**
- Song tasks → navigate to `/songs/{id}`
- Release tasks → navigate to `/releases/{id}`
- Event tasks → navigate to `/events/{id}`
- Global Task → navigate to `/tasks/{id}`
- Video tasks → navigate to `/videos` (list)

### Test 7: Dark Mode
**Steps:**
1. Enable dark mode in Settings
2. Navigate to Today view
3. Review all sections

**Expected Results:**
- All text is readable (proper contrast)
- Card backgrounds are dark
- Borders are slate-600 instead of black
- Source badges maintain readability
- Hover states work properly

### Test 8: Mobile Responsive
**Steps:**
1. Resize browser to mobile width (375px)
2. Review Today view layout

**Expected Results:**
- Stats cards stack vertically (2 columns on mobile)
- Source filter buttons wrap to multiple rows
- Task cards stack vertically
- All text remains readable
- No horizontal scrolling required
- Touch targets are adequately sized

## Task Dashboard Testing

### Test 9: Dashboard Stats Cards
**Steps:**
1. Navigate to Dashboard view (`/dashboard`)
2. Review the 8 stats cards at top

**Expected Results:**
- All 8 cards display with correct counts
- Cards show: Total, In Progress, Due This Week, Overdue, Completed, Paid, Remaining, Total Estimated
- Numbers match actual task counts
- Currency values formatted correctly

### Test 10: Tasks by Source Breakdown
**Steps:**
1. Scroll to "Tasks by Source" section
2. Review all 6 source cards
3. Click on each source card

**Expected Results:**
- 6 cards: Song, Version, Release, Video, Event, Global Task
- Each shows: icon, total count, progress bar, done/active/overdue stats
- Progress bar shows completion percentage
- Clicking card filters task list below to that source
- Selected source card has colored border
- Clicking again deselects (shows all)

### Test 11: Source and Stage Filtering
**Steps:**
1. Use "All Sources" dropdown
2. Select "🎵 Songs"
3. Use "All Stages" dropdown if stages exist
4. Change view to "Upcoming", "In Progress", "Overview"

**Expected Results:**
- Source filter dropdown has all 6 source options + "All Sources"
- Selecting a source filters the task list
- Stage filter works in conjunction with source filter
- View buttons maintain filter selections
- Active view button is highlighted

### Test 12: Task List Table
**Steps:**
1. Select "Upcoming" view
2. Review task list table
3. Check each column

**Expected Results:**
- Table shows: Date, Task, Source, From, Status, Est. Cost
- Source column shows icon + colored badge
- From column shows parent item name
- Overdue tasks have red background
- Due soon tasks have yellow background
- Status badges are color-coded
- Cost formatted as currency

### Test 13: Overview View
**Steps:**
1. Click "Overview" button
2. Review "Progress by Category" section
3. Review "Status Distribution" section

**Expected Results:**
- Categories show progress bars
- Done count / Total count displayed
- Green bars for done, blue for in progress
- Status cards show: Not Started, In Progress, Done, Delayed
- All counts accurate

### Test 14: Photo Carousel (if photos exist)
**Steps:**
1. Add some photos via Gallery
2. Return to Dashboard
3. Watch photo carousel

**Expected Results:**
- Photos rotate every 4 seconds
- Photo title displayed at bottom
- Dot indicators show which photo is active
- Clicking dots changes photo

### Test 15: Notifications Section
**Steps:**
1. Create scenarios for notifications:
   - Add overdue tasks
   - Add tasks due this week
   - Add upcoming releases
2. Check Dashboard

**Expected Results:**
- Notifications section appears if alerts exist
- Shows overdue tasks alert (red, ⚠️)
- Shows due this week alert (yellow, 📅)
- Shows upcoming releases alert (blue, 🎵)
- Each alert shows count badge
- Section hidden if no notifications

### Test 16: Dark Mode Dashboard
**Steps:**
1. Enable dark mode
2. Navigate to Dashboard
3. Test all views (Upcoming, In Progress, Overview)

**Expected Results:**
- All sections properly styled for dark mode
- Stats cards have dark backgrounds
- Source breakdown cards readable
- Table has dark background with proper contrast
- Progress bars visible
- No white flashes or jarring transitions

### Test 17: Mobile Dashboard
**Steps:**
1. View Dashboard on mobile (375px width)
2. Test source filtering
3. Review table scrolling

**Expected Results:**
- Stats cards stack appropriately (2 columns)
- Source breakdown cards stack vertically
- Dropdown filters stack or wrap properly
- Table scrolls horizontally on mobile
- All interactive elements have proper touch targets

## Edge Cases

### Test 18: No Tasks
**Steps:**
1. Delete all tasks (or test with fresh data)
2. Navigate to Today view
3. Navigate to Dashboard

**Expected Results:**
- Today view shows zeros in stats
- Shows empty state messages
- No errors in console
- Filters still work (show no results)
- Dashboard shows zeros but no crashes

### Test 19: Many Tasks
**Steps:**
1. Create 50+ tasks across different sources
2. Navigate to Today view
3. Test filtering and scrolling

**Expected Results:**
- Performance remains smooth
- Filtering is fast
- Long lists scroll properly
- "View All" button appears for overdue (>10)
- No layout breaks

### Test 20: Long Names
**Steps:**
1. Create tasks with very long titles
2. Create sources with very long names
3. View in both Today and Dashboard

**Expected Results:**
- Long names truncate with ellipsis
- Hover shows full name (title attribute)
- No layout overflow
- Cards maintain consistent height

### Test 21: Multiple Filters Active
**Steps:**
1. In Today view, disable several source filters
2. Verify correct tasks shown
3. In Dashboard, combine source + stage filter

**Expected Results:**
- Filters work correctly in combination
- Task counts update properly
- No tasks from disabled sources shown
- Clear way to see which filters are active

## Performance Testing

### Test 22: Load Time
**Steps:**
1. Measure initial load time of Today view
2. Measure initial load of Dashboard
3. Test filter toggle speed

**Expected Results:**
- Initial load < 1 second (with reasonable data)
- Filter changes instant (<100ms)
- No lag when scrolling
- Smooth animations

### Test 23: Memory Usage
**Steps:**
1. Open DevTools → Memory
2. Navigate between Today/Dashboard repeatedly
3. Check for memory leaks

**Expected Results:**
- Memory usage stable after several navigations
- No significant memory growth
- Components properly unmount

## Browser Compatibility

### Test 24: Cross-Browser
**Steps:**
1. Test in Chrome
2. Test in Firefox
3. Test in Safari
4. Test in Edge

**Expected Results:**
- All features work in all browsers
- Styles render consistently
- No browser-specific bugs
- Icons display properly

## Accessibility

### Test 25: Keyboard Navigation
**Steps:**
1. Use Tab key to navigate through Today view
2. Press Enter on focused elements
3. Test in Dashboard

**Expected Results:**
- All interactive elements focusable
- Focus indicators visible
- Enter key activates buttons/links
- Tab order is logical

### Test 26: Screen Reader
**Steps:**
1. Enable screen reader
2. Navigate through Today view
3. Check announcements for dynamic content

**Expected Results:**
- Headings properly announced
- Buttons have descriptive labels
- Badges/icons have alt text or aria-labels
- Dynamic updates announced

## Regression Testing

### Test 27: Existing Features
**Steps:**
1. Test that Songs view still works
2. Test that Releases view still works
3. Verify task editing still works
4. Check that other views not affected

**Expected Results:**
- No breaking changes to existing features
- All other views function normally
- Data integrity maintained
- No console errors

## Bug Reporting Template

If you find a bug, report with:
```
**Bug Title:** [Brief description]
**View:** [Today/Dashboard]
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**

**Actual Result:**

**Browser:** [Chrome/Firefox/Safari/Edge]
**Device:** [Desktop/Tablet/Mobile]
**Theme:** [Light/Dark]
**Screenshot:** [If applicable]
**Console Errors:** [If any]
```

## Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ No visual bugs
- ✅ Proper dark mode support
- ✅ Mobile responsive
- ✅ Fast performance
- ✅ Accurate data display
- ✅ Smooth navigation
- ✅ Accessible to all users
