# React Router Integration - Test Plan

## Test Environment Setup

1. **Local Development**: `npm run dev`
2. **Production Build**: `npm run build && npm run preview`
3. **Browser**: Test in Chrome, Firefox, Safari
4. **Device**: Test on desktop, tablet, and mobile

## Test Categories

### 1. Basic Navigation Tests

#### 1.1 Sidebar Navigation
- [ ] Click "Today" - should navigate to `/today`
- [ ] Click "Dashboard" - should navigate to `/dashboard`
- [ ] Click "Songs" - should navigate to `/songs`
- [ ] Click "Releases" - should navigate to `/releases`
- [ ] Click "Videos" - should navigate to `/videos`
- [ ] Click "Events" - should navigate to `/events`
- [ ] Click "Global Tasks" - should navigate to `/tasks`
- [ ] Click "Expenses" - should navigate to `/expenses`
- [ ] Click "Calendar" - should navigate to `/calendar`
- [ ] Click "Timeline" - should navigate to `/timeline`
- [ ] Click "Financials" - should navigate to `/financials`
- [ ] Click "Progress" - should navigate to `/progress`
- [ ] Click "Team" - should navigate to `/team`
- [ ] Click "Photos" - should navigate to `/gallery`
- [ ] Click "Files" - should navigate to `/files`
- [ ] Click "Settings" - should navigate to `/settings`
- [ ] Click "Trash" - should navigate to `/archive`
- [ ] Click "Active Tasks" - should navigate to `/active`

#### 1.2 Logo Navigation
- [ ] Click "Era Manifesto" logo - should navigate to `/dashboard`

### 2. Detail View Navigation

#### 2.1 Song Navigation
- [ ] Navigate to `/songs`
- [ ] Click on a song card
- [ ] Should navigate to `/songs/:songId`
- [ ] URL should show actual song ID
- [ ] Song detail view should display
- [ ] Click "Back" button - should return to `/songs`

#### 2.2 Release Navigation
- [ ] Navigate to `/releases`
- [ ] Click on a release card
- [ ] Should navigate to `/releases/:releaseId`
- [ ] URL should show actual release ID
- [ ] Release detail view should display
- [ ] Click "Back" button - should return to `/releases`

#### 2.3 Video Navigation
- [ ] Navigate to `/videos`
- [ ] Click on a video card
- [ ] Should navigate to `/videos/:videoId`
- [ ] Video detail view should display
- [ ] Click "Back" button - should return to `/videos`

#### 2.4 Event Navigation
- [ ] Navigate to `/events`
- [ ] Click on an event
- [ ] Should navigate to `/events/:eventId`
- [ ] Event detail view should display
- [ ] Click "Back" button - should return to `/events`

#### 2.5 Task Navigation
- [ ] Navigate to `/tasks`
- [ ] Click on a global task
- [ ] Should navigate to `/tasks/:taskId`
- [ ] Task detail view should display
- [ ] Click "Back" button - should return to `/tasks`

#### 2.6 Expense Navigation
- [ ] Navigate to `/expenses`
- [ ] Click on an expense
- [ ] Should navigate to `/expenses/:expenseId`
- [ ] Expense detail view should display
- [ ] Click "Back" button - should return to `/expenses`

### 3. Browser Navigation Tests

#### 3.1 Back Button
- [ ] Navigate: Songs → Song Detail → Back button
- [ ] Should return to Songs list
- [ ] Navigate: Dashboard → Songs → Releases → Back button (x2)
- [ ] Should return through history: Releases → Songs → Dashboard

#### 3.2 Forward Button
- [ ] Navigate: Songs → Song Detail → Back → Forward
- [ ] Should return to Song Detail

#### 3.3 Refresh Tests
- [ ] On `/songs` - refresh should stay on songs list
- [ ] On `/songs/:songId` - refresh should show same song detail
- [ ] On `/releases/:releaseId` - refresh should show same release
- [ ] On `/events/:eventId` - refresh should show same event
- [ ] On `/tasks/:taskId` - refresh should show same task
- [ ] On `/expenses/:expenseId` - refresh should show same expense

### 4. Legacy Hash URL Tests

#### 4.1 Hash URL Redirects
- [ ] Navigate to `/#?tab=songs` - should redirect to `/songs`
- [ ] Navigate to `/#?tab=dashboard` - should redirect to `/dashboard`
- [ ] Navigate to `/#?tab=releases` - should redirect to `/releases`
- [ ] Navigate to `/#?tab=events` - should redirect to `/events`
- [ ] Navigate to `/#?tab=globalTasks` - should redirect to `/tasks`
- [ ] Navigate to `/#?tab=expenses` - should redirect to `/expenses`

#### 4.2 Hash URL with IDs
- [ ] Navigate to `/#?tab=songs&songId=abc123` 
  - Should redirect to `/songs/abc123`
  - Should show song detail if song exists
- [ ] Navigate to `/#?tab=releases&releaseId=xyz789`
  - Should redirect to `/releases/xyz789`
  - Should show release detail if release exists
- [ ] Navigate to `/#?tab=events&eventId=evt123`
  - Should redirect to `/events/evt123`
  - Should show event detail if event exists

### 5. Deep Linking Tests

#### 5.1 Direct URL Access
- [ ] Open new tab, navigate directly to `/songs`
- [ ] Open new tab, navigate directly to `/songs/[valid-song-id]`
- [ ] Open new tab, navigate directly to `/releases/[valid-release-id]`
- [ ] Open new tab, navigate directly to `/events/[valid-event-id]`
- [ ] Open new tab, navigate directly to `/tasks/[valid-task-id]`
- [ ] Open new tab, navigate directly to `/expenses/[valid-expense-id]`

#### 5.2 Share URL Tests
- [ ] Copy URL from song detail view
- [ ] Paste in new tab/window
- [ ] Should show same song detail
- [ ] Repeat for releases, events, tasks, expenses

### 6. Command Palette Tests (Cmd/Ctrl+K)

#### 6.1 Navigation Commands
- [ ] Open command palette (Cmd/Ctrl+K)
- [ ] Type "Go to Today" - should navigate to `/today`
- [ ] Open palette, type "Go to Songs" - should navigate to `/songs`
- [ ] Open palette, type "Go to Releases" - should navigate to `/releases`
- [ ] Open palette, type "Go to Events" - should navigate to `/events`
- [ ] Open palette, type "Go to Timeline" - should navigate to `/timeline`

#### 6.2 Create Commands
- [ ] Open palette, "Create Song" - should create and navigate to new song detail
- [ ] Open palette, "Create Release" - should create and navigate to new release detail
- [ ] Open palette, "Create Task" - should create and navigate to new task detail

### 7. Mobile Tests

#### 7.1 Sidebar on Mobile
- [ ] Open sidebar (hamburger menu)
- [ ] Click on any navigation item
- [ ] Sidebar should close
- [ ] Should navigate to correct route

#### 7.2 Touch Navigation
- [ ] Tap on song card - should navigate to song detail
- [ ] Use back button - should return to list
- [ ] Swipe back gesture (iOS Safari) - should navigate back in history

### 8. State Persistence Tests

#### 8.1 Selected Item State
- [ ] Navigate to song detail
- [ ] Click sidebar "Songs" - should clear selected song, show list
- [ ] Navigate to release detail
- [ ] Click sidebar "Releases" - should clear selected release, show list

#### 8.2 Tab State
- [ ] Navigate to `/songs`
- [ ] Check that `activeTab` state is "songs"
- [ ] Navigate to `/releases`
- [ ] Check that `activeTab` state is "releases"
- [ ] Sidebar should highlight correct item

### 9. Edge Cases

#### 9.1 Invalid IDs
- [ ] Navigate to `/songs/invalid-id-123`
- [ ] Should handle gracefully (show list or error message)
- [ ] Navigate to `/releases/nonexistent`
- [ ] Should handle gracefully

#### 9.2 Root Path
- [ ] Navigate to `/` (root)
- [ ] Should redirect to `/today` or show Today view
- [ ] Confirm behavior matches expectations

#### 9.3 Invalid Routes
- [ ] Navigate to `/invalid-route`
- [ ] Should show appropriate fallback (Today view as default)

### 10. Focus Mode Tests

#### 10.1 Navigation in Focus Mode
- [ ] Enable Focus Mode
- [ ] Sidebar should be hidden
- [ ] URL navigation should still work
- [ ] Use browser back/forward - should work
- [ ] Type URL directly - should navigate correctly

### 11. Dark Mode Tests

#### 11.1 Theme Persistence
- [ ] Enable dark mode
- [ ] Navigate between views
- [ ] Dark mode should persist across navigation
- [ ] Refresh page - dark mode should persist

### 12. Era Mode Tests

#### 12.1 Navigation with Era Mode Active
- [ ] Activate Era Mode
- [ ] Navigate to different views
- [ ] Era Mode banner should persist
- [ ] URL navigation should work normally

### 13. Toast Notifications

#### 13.1 Creation Toasts
- [ ] Create new song
- [ ] Should show toast with "Open details" action
- [ ] Click "Open details" - should navigate to song detail
- [ ] Repeat for releases, tasks, events, expenses

### 14. Onboarding Tests

#### 14.1 Onboarding Navigation
- [ ] With onboarding active, click "Create your first song"
- [ ] Should navigate to `/songs`
- [ ] Click "Create your first release"
- [ ] Should navigate to `/releases`

### 15. Performance Tests

#### 15.1 Navigation Speed
- [ ] Navigate between views - should be instant (no full page reload)
- [ ] Detail view loading - should be fast
- [ ] Browser back/forward - should be instant

#### 15.2 Memory Leaks
- [ ] Navigate between views 20+ times
- [ ] Check Chrome DevTools memory profiler
- [ ] Memory should not continuously increase

### 16. Cross-Browser Tests

#### 16.1 Chrome
- [ ] Run all basic navigation tests
- [ ] Test history API
- [ ] Test deep links

#### 16.2 Firefox
- [ ] Run all basic navigation tests
- [ ] Test history API
- [ ] Test deep links

#### 16.3 Safari (Desktop)
- [ ] Run all basic navigation tests
- [ ] Test history API
- [ ] Test deep links

#### 16.4 Safari (iOS)
- [ ] Run mobile navigation tests
- [ ] Test swipe gestures
- [ ] Test deep links from other apps

#### 16.5 Chrome (Android)
- [ ] Run mobile navigation tests
- [ ] Test deep links from other apps

## Regression Tests

### Should Not Break
- [ ] All existing functionality works as before
- [ ] Hash-based bookmarks still work
- [ ] Keyboard shortcuts still work (Cmd/Ctrl+K)
- [ ] Undo/Redo functionality works
- [ ] Firebase sync works correctly
- [ ] Theme switching works
- [ ] Focus mode works
- [ ] Era mode works
- [ ] Manager mode works
- [ ] File uploads work
- [ ] Photo gallery works
- [ ] Settings save correctly

## Bug Report Template

If you find an issue during testing:

```
**Issue**: [Short description]
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]
**Actual**: [What actually happens]
**URL**: [Current URL when bug occurs]
**Browser**: [Chrome/Firefox/Safari/etc.]
**Device**: [Desktop/Mobile/Tablet]
**Console Errors**: [Any errors from browser console]
```

## Test Sign-Off

- [ ] All critical tests passed
- [ ] All edge cases handled
- [ ] No regressions found
- [ ] Performance acceptable
- [ ] Mobile experience good
- [ ] Cross-browser compatible

**Tested by**: _______________
**Date**: _______________
**Notes**: _______________
