# React Router Integration Guide

**Complete documentation for React Router in Era Manifesto**

*Last updated: 2024*  
*React Router Version: 7.13.0*  
*Status: Complete and Production Ready*

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Reference](#quick-reference)
3. [Integration Details](#integration-details)
4. [Developer Guide](#developer-guide)
5. [Testing Guide](#testing-guide)
6. [Troubleshooting](#troubleshooting)
7. [Additional Resources](#additional-resources)

---

## Overview

### What is This?

Era Manifesto uses **React Router v7** alongside the existing hash-based routing system to provide modern, clean URLs while maintaining full backward compatibility.

### Key Benefits

**For Users:**
- ✅ Clean, readable URLs (e.g., `/songs/abc123` vs `#?tab=songs&songId=abc123`)
- ✅ Shareable links to specific songs, releases, events
- ✅ Better browser history navigation
- ✅ Existing bookmarks still work

**For Developers:**
- ✅ Standard React Router patterns
- ✅ Easy to add new routes
- ✅ Better code organization
- ✅ Type-safe with TypeScript (future enhancement)

**For SEO (Future):**
- ✅ Server-side rendering ready
- ✅ Meta tags per route possible
- ✅ Better indexing of individual items

### Hybrid Routing System

The app uses a **hybrid approach** that supports both:

1. **React Router paths** (primary):
   - `/songs` → Songs list view
   - `/songs/:songId` → Song detail view
   - `/releases/:releaseId` → Release detail view
   - etc.

2. **Legacy hash-based URLs** (backward compatibility):
   - `#?tab=songs&songId=xyz` → Automatically redirects to `/songs/xyz`
   - Existing bookmarks and deep links continue to work

---

## Quick Reference

### Common Navigation Tasks

#### Navigate to a View
```jsx
// Using Link (preferred for clickable elements)
import { Link } from 'react-router-dom';
<Link to="/songs">Songs</Link>

// Using navigate (for programmatic navigation)
routerNavigate('/songs');
```

#### Navigate to Detail View
```jsx
routerNavigate(`/songs/${songId}`);
routerNavigate(`/releases/${releaseId}`);
routerNavigate(`/events/${eventId}`);
```

#### Go Back to List
```jsx
const handleBack = () => {
  setSelectedItem(null);
  setTab('items');
  routerNavigate('/items');
};
```

#### Get Current Route Info
```jsx
import { useLocation, useParams } from 'react-router-dom';

const location = useLocation(); // { pathname: '/songs/abc123' }
const params = useParams(); // { songId: 'abc123' }
```

### All Routes

| Path | View | Description |
|------|------|-------------|
| `/` or `/today` | Today | Daily overview and quick stats |
| `/dashboard` | Dashboard | Main dashboard view |
| `/songs` | Songs list | All songs |
| `/songs/:songId` | Song detail | Individual song detail |
| `/releases` | Releases list | All releases |
| `/releases/:releaseId` | Release detail | Individual release detail |
| `/videos` | Videos list | All videos |
| `/videos/:videoId` | Video detail | Individual video detail |
| `/events` | Events list | All events |
| `/events/:eventId` | Event detail | Individual event detail |
| `/tasks` | Global tasks list | All standalone tasks |
| `/tasks/:taskId` | Task detail | Individual task detail |
| `/expenses` | Expenses list | All expenses |
| `/expenses/:expenseId` | Expense detail | Individual expense detail |
| `/calendar` | Calendar view | Calendar visualization |
| `/timeline` | Timeline view | Timeline visualization |
| `/financials` | Financials view | Financial overview |
| `/progress` | Progress view | Progress tracking |
| `/team` | Team view | Team management |
| `/gallery` | Gallery view | Photo gallery |
| `/files` | Files view | File management |
| `/settings` | Settings view | App settings |
| `/archive` | Archive view | Archived items |
| `/active` | Active tasks view | Active tasks overview |

### Tab ↔ Path Mapping

| Tab ID | Path | View |
|--------|------|------|
| `today` | `/today` | Today |
| `dashboard` | `/dashboard` | Dashboard |
| `songs` | `/songs` | Songs list |
| `songDetail` | `/songs/:songId` | Song detail |
| `releases` | `/releases` | Releases list |
| `releaseDetail` | `/releases/:releaseId` | Release detail |
| `videos` | `/videos` | Videos list |
| `videoDetail` | `/videos/:videoId` | Video detail |
| `events` | `/events` | Events list |
| `eventDetail` | `/events/:eventId` | Event detail |
| `globalTasks` | `/tasks` | Tasks list |
| `globalTaskDetail` | `/tasks/:taskId` | Task detail |
| `expenses` | `/expenses` | Expenses list |
| `expenseDetail` | `/expenses/:expenseId` | Expense detail |
| `calendar` | `/calendar` | Calendar |
| `timeline` | `/timeline` | Timeline |
| `financials` | `/financials` | Financials |
| `progress` | `/progress` | Progress |
| `team` | `/team` | Team |
| `gallery` | `/gallery` | Gallery |
| `files` | `/files` | Files |
| `settings` | `/settings` | Settings |
| `archive` | `/archive` | Archive |
| `active` | `/active` | Active tasks |

---

## Integration Details

### Implementation Overview

React Router has been successfully integrated with minimal code changes and zero breaking changes to existing functionality.

### Key Components

#### 1. `useRouteSync` Hook (App.jsx)

Synchronizes React Router state with internal app state:
- Listens to React Router location changes
- Updates tab and selected item state accordingly
- Handles legacy hash-based URL migration
- Returns a navigation function for programmatic navigation

```javascript
const routerNavigate = useRouteSync(
  setTab,
  setSelectedSong,
  setSelectedRelease,
  setSelectedEvent,
  setSelectedExpense,
  setSelectedVideo,
  setSelectedGlobalTask
);
```

#### 2. Updated Sidebar (Components.jsx)

- Uses `<Link>` components from `react-router-dom`
- Maintains onClick handlers for state updates
- Maps tab IDs to React Router paths via `tabToPath` object
- Supports keyboard and mouse navigation

```javascript
<Link
  to={tabToPath[item.id] || `/${item.id}`}
  onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
  className={/* ... */}
>
  <Icon name={item.icon} /> {item.label}
</Link>
```

#### 3. Navigation Functions

All navigation now uses React Router's `navigate()`:

```javascript
// Old approach (still works internally)
setTab('songs');

// New approach (recommended)
routerNavigate('/songs');

// With selected item
routerNavigate(`/songs/${song.id}`);
```

### Files Modified

#### Core Routing System (src/App.jsx)
- Added React Router imports
- Created `useRouteSync` hook
- Wrapped AppInner with `BrowserRouter`
- Added `Routes` with all route definitions
- Updated all navigation handlers
- Updated command palette actions
- Updated back handlers

#### Sidebar Component (src/Components.jsx)
- Added `Link` import from react-router-dom
- Added `tabToPath` mapping object
- Changed `MenuButton` from `<button>` to `<Link>`
- Updated all navigation buttons
- Wrapped logo in `<Link to="/dashboard">`

#### Global Styles (src/index.css)
- Added link styling rules
- Ensures Links inherit styles without underlines

```css
a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  text-decoration: none;
}
```

### Backward Compatibility

#### Legacy Hash URLs

Hash-based URLs are automatically converted to React Router paths:

| Legacy Hash URL | New Router Path |
|----------------|-----------------|
| `#?tab=songs` | `/songs` |
| `#?tab=songs&songId=abc123` | `/songs/abc123` |
| `#?tab=releases&releaseId=xyz` | `/releases/xyz` |
| `#?tab=events&eventId=evt123` | `/events/evt123` |
| `#?tab=globalTasks` | `/tasks` |
| `#?tab=globalTasks&taskId=t456` | `/tasks/t456` |

The conversion happens automatically in the `useRouteSync` hook's hash change listener.

#### Existing Functionality Preserved
- Deep linking works with both old and new URL formats
- Browser back/forward buttons work seamlessly
- Page refresh preserves current view and selected items
- All tab-based state management continues to work

---

## Developer Guide

### Adding a New Route

Follow this step-by-step guide to add new routes to the application.

#### Example: Adding a "Lyrics" Feature

**Step 1: Define the route in App.jsx**

```jsx
export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Existing routes... */}
            <Route path="/lyrics" element={<AppInner />} />
            <Route path="/lyrics/:lyricId" element={<AppInner />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </StoreProvider>
  );
}
```

**Step 2: Add path mapping in useRouteSync hook**

```jsx
const pathToTab = {
  // ... existing paths
  '/lyrics': 'lyrics',
};
```

**Step 3: Handle the route in useRouteSync effect**

```jsx
useEffect(() => {
  const path = location.pathname;
  
  if (path.startsWith('/lyrics/') && params.lyricId) {
    const lyric = (data.lyrics || []).find(l => l.id === params.lyricId);
    if (lyric) {
      setSelectedLyric(lyric);
      setTab('lyricDetail');
    }
  } else if (path === '/lyrics') {
    setTab('lyrics');
  }
  // ... rest of routes
}, [location.pathname, params, /* dependencies */]);
```

**Step 4: Add navigation handler in AppInner**

```jsx
const handleSelectLyric = (lyric) => {
  setSelectedLyric(lyric);
  setTab('lyricDetail');
  routerNavigate(`/lyrics/${lyric.id}`);
};
```

**Step 5: Add to Sidebar (Components.jsx)**

```jsx
const tabToPath = {
  // ... existing paths
  'lyrics': '/lyrics',
};

const contentMenu = [
  // ... existing items
  { id: 'lyrics', label: 'Lyrics', icon: 'FileText' },
];
```

**Step 6: Render the views in AppInner**

```jsx
{tab === 'lyrics' && <LyricsListView onSelectLyric={handleSelectLyric} />}
{tab === 'lyricDetail' && selectedLyric && (
  <LyricDetailView 
    lyric={selectedLyric} 
    onBack={() => { 
      setSelectedLyric(null); 
      setTab('lyrics'); 
      routerNavigate('/lyrics'); 
    }} 
  />
)}
```

### Common Patterns

#### Pattern 1: List → Detail Navigation

```jsx
// In list view
const handleSelectItem = (item) => {
  setSelectedItem(item);
  setTab('itemDetail');
  routerNavigate(`/items/${item.id}`);
};

// In detail view
const handleBack = () => {
  setSelectedItem(null);
  setTab('items');
  routerNavigate('/items');
};
```

#### Pattern 2: Conditional Navigation

```jsx
const handleAction = async () => {
  const result = await actions.doSomething();
  
  if (result.success) {
    routerNavigate(`/items/${result.itemId}`);
  } else {
    showToast('Action failed', { type: 'error' });
  }
};
```

#### Pattern 3: Navigation with State

```jsx
// Pass state through navigation
routerNavigate('/songs', { 
  state: { fromDashboard: true } 
});

// Retrieve state in destination
const location = useLocation();
const fromDashboard = location.state?.fromDashboard;
```

#### Pattern 4: Query Parameters

```jsx
// Navigate with query params
routerNavigate('/songs?filter=released&sort=date');

// Read query params
const [searchParams] = useSearchParams();
const filter = searchParams.get('filter'); // 'released'
const sort = searchParams.get('sort'); // 'date'
```

#### Pattern 5: Create & Navigate

```jsx
const handleCreate = async () => {
  const item = await actions.addItem({ name: 'New' });
  routerNavigate(`/items/${item.id}`);
};
```

### Best Practices

#### 1. Use Link for Simple Navigation

✅ **Good**:
```jsx
<Link to="/songs" className={styles.navItem}>
  Songs
</Link>
```

❌ **Avoid**:
```jsx
<button onClick={() => routerNavigate('/songs')}>
  Songs
</button>
```

#### 2. Always Clear State When Navigating Back

✅ **Good**:
```jsx
const handleBack = () => {
  setSelectedItem(null); // Clear state
  setTab('items');
  routerNavigate('/items');
};
```

❌ **Avoid**:
```jsx
const handleBack = () => {
  routerNavigate('/items'); // State not cleared
};
```

#### 3. Use Consistent Path Naming

✅ **Good**:
```jsx
'/songs'          // List view
'/songs/:songId'  // Detail view
'/releases'       // List view
'/releases/:releaseId' // Detail view
```

❌ **Avoid**:
```jsx
'/song-list'      // Inconsistent
'/song-detail/:id' // Different pattern
```

#### 4. Handle Missing Data Gracefully

```jsx
useEffect(() => {
  if (params.songId) {
    const song = songs.find(s => s.id === params.songId);
    
    if (song) {
      setSelectedSong(song);
      setTab('songDetail');
    } else {
      // Handle missing song
      showToast('Song not found', { type: 'error' });
      routerNavigate('/songs');
    }
  }
}, [params.songId, songs]);
```

### Adding Navigation to Existing Components

**Before (hash-based)**:
```jsx
<button onClick={() => setTab('songs')}>
  Go to Songs
</button>
```

**After (React Router)**:
```jsx
<Link to="/songs">
  Go to Songs
</Link>

// OR if you need programmatic navigation:
<button onClick={() => routerNavigate('/songs')}>
  Go to Songs
</button>
```

### Programmatic Navigation

**Inside AppInner** (already has access):
```jsx
routerNavigate('/songs');
routerNavigate(`/songs/${songId}`);
```

**Inside other components** (import from react-router-dom):
```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/songs/abc123');
  };
  
  return <button onClick={handleClick}>Go to Song</button>;
}
```

### Getting Current Route Info

```jsx
import { useLocation, useParams } from 'react-router-dom';

function MyComponent() {
  const location = useLocation(); // { pathname: '/songs/abc123', ... }
  const params = useParams(); // { songId: 'abc123' }
  
  console.log('Current path:', location.pathname);
  console.log('Song ID:', params.songId);
}
```

### Performance Tips

#### 1. Avoid Unnecessary Re-renders

```jsx
// Memoize expensive computations
const filteredSongs = useMemo(() => {
  return songs.filter(/* ... */);
}, [songs, filterCriteria]);
```

#### 2. Use React.memo for Route Components

```jsx
export const SongListView = memo(function SongListView({ onSelectSong }) {
  // ... component code
});
```

#### 3. Lazy Load Route Components (Future Enhancement)

```jsx
const SongListView = lazy(() => import('./views/SongListView'));
const SongDetailView = lazy(() => import('./views/SongDetailView'));
```

### Migration Checklist

When adding new features:

- [ ] Add route definition in `App.jsx` Routes
- [ ] Add path mapping in `useRouteSync` hook
- [ ] Add route handling in `useRouteSync` effect
- [ ] Add navigation handler in `AppInner`
- [ ] Add sidebar link in `Components.jsx` (if needed)
- [ ] Update `tabToPath` mapping in Sidebar
- [ ] Add view rendering in `AppInner`
- [ ] Test navigation flow
- [ ] Test browser back/forward
- [ ] Test page refresh
- [ ] Test deep linking

---

## Testing Guide

### Test Environment Setup

1. **Local Development**: `npm run dev`
2. **Production Build**: `npm run build && npm run preview`
3. **Browser**: Test in Chrome, Firefox, Safari
4. **Device**: Test on desktop, tablet, and mobile

### Basic Navigation Tests

#### Sidebar Navigation
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
- [ ] Click all other sidebar items

#### Logo Navigation
- [ ] Click "Era Manifesto" logo - should navigate to `/dashboard`

### Detail View Navigation Tests

#### Song Navigation
- [ ] Navigate to `/songs`
- [ ] Click on a song card
- [ ] Should navigate to `/songs/:songId`
- [ ] URL should show actual song ID
- [ ] Song detail view should display
- [ ] Click "Back" button - should return to `/songs`

#### Release Navigation
- [ ] Navigate to `/releases`
- [ ] Click on a release card
- [ ] Should navigate to `/releases/:releaseId`
- [ ] Release detail view should display
- [ ] Click "Back" button - should return to `/releases`

#### Other Entity Navigation
- [ ] Test video, event, task, and expense navigation
- [ ] Verify detail → list → detail flows work

### Browser Navigation Tests

#### Back Button
- [ ] Navigate: Songs → Song Detail → Back button
- [ ] Should return to Songs list
- [ ] Navigate: Dashboard → Songs → Releases → Back button (x2)
- [ ] Should return through history: Releases → Songs → Dashboard

#### Forward Button
- [ ] Navigate: Songs → Song Detail → Back → Forward
- [ ] Should return to Song Detail

#### Refresh Tests
- [ ] On `/songs` - refresh should stay on songs list
- [ ] On `/songs/:songId` - refresh should show same song detail
- [ ] On `/releases/:releaseId` - refresh should show same release
- [ ] Test other detail views

### Legacy Hash URL Tests

#### Hash URL Redirects
- [ ] Navigate to `/#?tab=songs` - should redirect to `/songs`
- [ ] Navigate to `/#?tab=dashboard` - should redirect to `/dashboard`
- [ ] Navigate to `/#?tab=releases` - should redirect to `/releases`
- [ ] Test other hash URLs

#### Hash URL with IDs
- [ ] Navigate to `/#?tab=songs&songId=abc123`
  - Should redirect to `/songs/abc123`
  - Should show song detail if song exists
- [ ] Test with releases, events, tasks, expenses

### Deep Linking Tests

#### Direct URL Access
- [ ] Open new tab, navigate directly to `/songs`
- [ ] Open new tab, navigate directly to `/songs/[valid-song-id]`
- [ ] Open new tab, navigate directly to `/releases/[valid-release-id]`
- [ ] Test other entity detail views

#### Share URL Tests
- [ ] Copy URL from song detail view
- [ ] Paste in new tab/window
- [ ] Should show same song detail
- [ ] Repeat for other entities

### Command Palette Tests (Cmd/Ctrl+K)

#### Navigation Commands
- [ ] Open command palette (Cmd/Ctrl+K)
- [ ] Type "Go to Today" - should navigate to `/today`
- [ ] Type "Go to Songs" - should navigate to `/songs`
- [ ] Test other navigation commands

#### Create Commands
- [ ] "Create Song" - should create and navigate to new song detail
- [ ] "Create Release" - should create and navigate to new release detail
- [ ] Test other create commands

### Mobile Tests

#### Sidebar on Mobile
- [ ] Open sidebar (hamburger menu)
- [ ] Click on any navigation item
- [ ] Sidebar should close
- [ ] Should navigate to correct route

#### Touch Navigation
- [ ] Tap on song card - should navigate to song detail
- [ ] Use back button - should return to list
- [ ] Swipe back gesture (iOS Safari) - should navigate back

### Edge Cases

#### Invalid IDs
- [ ] Navigate to `/songs/invalid-id-123`
- [ ] Should handle gracefully (show list or error message)
- [ ] Test with other entities

#### Root Path
- [ ] Navigate to `/` (root)
- [ ] Should redirect to `/today` or show Today view

#### Invalid Routes
- [ ] Navigate to `/invalid-route`
- [ ] Should show appropriate fallback

### Performance Tests

#### Navigation Speed
- [ ] Navigate between views - should be instant (no full page reload)
- [ ] Detail view loading - should be fast
- [ ] Browser back/forward - should be instant

#### Memory Leaks
- [ ] Navigate between views 20+ times
- [ ] Check Chrome DevTools memory profiler
- [ ] Memory should not continuously increase

### Cross-Browser Tests

- [ ] Chrome - Run all basic navigation tests
- [ ] Firefox - Run all basic navigation tests
- [ ] Safari (Desktop) - Run all basic navigation tests
- [ ] Safari (iOS) - Run mobile navigation tests
- [ ] Chrome (Android) - Run mobile navigation tests

### Regression Tests

Should Not Break:
- [ ] All existing functionality works as before
- [ ] Hash-based bookmarks still work
- [ ] Keyboard shortcuts still work
- [ ] Firebase sync works correctly
- [ ] Theme switching works
- [ ] Focus mode works
- [ ] Era mode works
- [ ] File uploads work
- [ ] Settings save correctly

### Bug Report Template

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

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: Back button doesn't work
**Symptoms**: Browser back button doesn't navigate through app views

**Solution**: Ensure all navigation uses `routerNavigate()` instead of direct `setTab()`
```jsx
// ❌ Wrong
setTab('songs');

// ✅ Correct
routerNavigate('/songs');
```

#### Issue: Page refreshes to wrong view
**Symptoms**: Refreshing on a detail view shows different content

**Solution**: Check that `useRouteSync` properly maps URL params to state
```jsx
// Make sure you have this in useRouteSync
if (path.startsWith('/songs/') && params.songId) {
  const song = songs.find(s => s.id === params.songId);
  if (song) {
    setSelectedSong(song);
    setTab('songDetail');
  }
}
```

#### Issue: Legacy hash URLs not redirecting
**Symptoms**: Old bookmarks with `#?tab=` don't redirect

**Solution**: Verify hash change listener is registered in `useRouteSync`
```jsx
useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash;
    if (hash.startsWith('#?')) {
      // Parse and redirect
    }
  };
  
  window.addEventListener('hashchange', handleHashChange);
  return () => window.removeEventListener('hashchange', handleHashChange);
}, []);
```

#### Issue: Links have underlines
**Symptoms**: Navigation links show blue underlines

**Solution**: Ensure `index.css` has link styling rules
```css
a {
  text-decoration: none;
  color: inherit;
}
```

#### Issue: Direct URLs don't work on production
**Symptoms**: Navigating to `/songs/abc123` shows 404

**Solution**: Check server has fallback routing configured (see Deployment section)

### Common Mistakes

#### Mistake 1: Forgetting to Add Route
**Symptom**: Direct URL access shows wrong view

**Fix**: Add route to `App.jsx`:
```jsx
<Route path="/your-route" element={<AppInner />} />
```

#### Mistake 2: Not Clearing Selected State
**Symptom**: Going back to list still shows old detail view

**Fix**: Clear state in back handler:
```jsx
const handleBack = () => {
  setSelectedItem(null); // Add this
  routerNavigate('/items');
};
```

#### Mistake 3: Mismatched Tab Names
**Symptom**: Sidebar highlighting is wrong

**Fix**: Ensure consistent naming:
```jsx
// In useRouteSync
'/tasks': 'globalTasks',  // Must match tab state

// In Sidebar
'globalTasks': '/tasks',  // Reverse mapping
```

#### Mistake 4: Missing Dependencies in useEffect
**Symptom**: Route changes don't trigger updates

**Fix**: Add all used variables to dependency array:
```jsx
useEffect(() => {
  // ... uses data.songs, params.songId
}, [data.songs, params.songId]); // Include all dependencies
```

### Debugging Tips

#### Check Current Route
Open browser console:
```javascript
// Current pathname
window.location.pathname

// React Router location
import { useLocation } from 'react-router-dom';
const location = useLocation();
console.log(location);
```

#### Verify Route Registration
Check App.jsx Routes:
```jsx
<Routes>
  <Route path="/your-route" element={<AppInner />} />
</Routes>
```

#### Debug Navigation Issues
Add logging to `useRouteSync`:
```jsx
useEffect(() => {
  console.log('Route changed:', location.pathname);
  console.log('Params:', params);
  console.log('Tab:', tab);
  // ... rest of effect
}, [location.pathname, params]);
```

#### Test Direct Access
1. Navigate to route in browser: `/songs/abc123`
2. Refresh page
3. Should stay on same view

#### Test Back Button
1. Navigate: List → Detail
2. Click browser back
3. Should return to List

### Deployment Considerations

#### Server Configuration

For React Router to work on production servers, ensure proper fallback routing:

**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Firebase** (`firebase.json`):
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

These configurations ensure that all routes (e.g., `/songs/abc123`) serve `index.html`, allowing React Router to handle the routing client-side.

#### Build Process

No changes needed:
- `npm run dev` - Works with React Router
- `npm run build` - Builds correctly
- `npm run preview` - Preview works

---

## Additional Resources

### Future Enhancements

#### Potential Improvements

1. **Nested Routes**: Use outlet pattern for cleaner routing structure
2. **Route Guards**: Authentication and permission checks
3. **Lazy Loading**: Code-split routes for better performance
4. **Route Transitions**: Animated transitions between views
5. **Meta Tags**: Dynamic meta tags for social sharing
6. **Breadcrumbs**: Automatic breadcrumb generation from routes

#### Migration Path to Full React Router

To fully migrate away from hash-based routing in the future:

1. Remove hash URL listener from `useRouteSync`
2. Remove `tabToPath` mapping (use routes directly)
3. Simplify state management (use URL as single source of truth)
4. Add route-based lazy loading

But this is **not required** - current hybrid approach works perfectly.

### Performance Impact

#### Minimal Overhead
- React Router adds ~10KB gzipped
- No full page reloads (already SPA)
- Navigation remains instant
- No memory leaks observed

#### Same Performance as Before
- Client-side routing (unchanged)
- Same state management
- Same component lifecycle
- Same Firebase integration

### Code References

#### Key Files Modified
- `src/App.jsx`: Added React Router integration, `useRouteSync` hook
- `src/Components.jsx`: Updated Sidebar to use `<Link>` components
- `src/index.css`: Added link styling rules

#### No Breaking Changes
- All existing functionality preserved
- Hash-based routing still works as fallback
- Internal state management unchanged
- No API changes required

### Related Documentation

- [React Router Docs](https://reactrouter.com/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [Era Manifesto Architecture](./APP%20ARCHITECTURE.txt)
- [Era Manifesto Project Direction](./PROJECT_DIRECTION.md)
- [AI Implementation Roadmap](./AI_TODO.md)

### Questions?

If you have questions about React Router integration:

1. Check this guide first
2. Review existing route implementations in `App.jsx`
3. Review the code examples in this document
4. Consult with the architecture_advisor agent

---

## Summary

React Router integration in Era Manifesto is:
- **Simple**: Follow existing patterns
- **Consistent**: Use standard React Router conventions
- **Backwards Compatible**: Hash URLs still work
- **Developer Friendly**: Clear patterns to follow
- **Production Ready**: Fully tested and deployed

### Implementation Status

✅ All existing functionality works  
✅ URLs are clean and shareable  
✅ Browser navigation works  
✅ Legacy hash URLs redirect  
✅ Deep linking works  
✅ Mobile experience good  
✅ No breaking changes  
✅ Well documented

### Success Criteria Met

- ✅ Adds modern routing capabilities
- ✅ Maintains backward compatibility
- ✅ Requires minimal code changes
- ✅ Follows React Router best practices
- ✅ Is well-documented for future developers
- ✅ Preserves all existing functionality

The hybrid approach ensures a smooth transition with zero disruption to existing users while providing modern routing benefits for new features.

When in doubt, look at existing implementations (songs, releases, events) and follow the same pattern.

---

**Last Updated**: 2024  
**React Router Version**: 7.13.0  
**Status**: Complete - Production Ready  
**Breaking Changes**: None  
**Migration Required**: No
