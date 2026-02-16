# React Router Quick Reference

## Common Tasks

### Navigate to a View
```jsx
// Using Link (preferred for clickable elements)
import { Link } from 'react-router-dom';
<Link to="/songs">Songs</Link>

// Using navigate (for programmatic navigation)
routerNavigate('/songs');
```

### Navigate to Detail View
```jsx
routerNavigate(`/songs/${songId}`);
routerNavigate(`/releases/${releaseId}`);
routerNavigate(`/events/${eventId}`);
```

### Go Back to List
```jsx
const handleBack = () => {
  setSelectedItem(null);
  setTab('items');
  routerNavigate('/items');
};
```

### Get Current Route
```jsx
import { useLocation, useParams } from 'react-router-dom';

const location = useLocation(); // { pathname: '/songs/abc123' }
const params = useParams(); // { songId: 'abc123' }
```

## Route Patterns

| Pattern | Example | Use Case |
|---------|---------|----------|
| `/items` | `/songs` | List view |
| `/items/:id` | `/songs/abc123` | Detail view |
| `/view` | `/calendar` | Special view |

## All Routes

```
/                      → Today
/today                 → Today
/dashboard             → Dashboard
/songs                 → Songs list
/songs/:songId         → Song detail
/releases              → Releases list
/releases/:releaseId   → Release detail
/videos                → Videos list
/videos/:videoId       → Video detail
/events                → Events list
/events/:eventId       → Event detail
/tasks                 → Global tasks list
/tasks/:taskId         → Task detail
/expenses              → Expenses list
/expenses/:expenseId   → Expense detail
/calendar              → Calendar view
/timeline              → Timeline view
/financials            → Financials view
/progress              → Progress view
/team                  → Team view
/gallery               → Gallery view
/files                 → Files view
/settings              → Settings view
/archive               → Archive view
/active                → Active tasks view
```

## Adding a New Route

### 1. Define Route (App.jsx)
```jsx
<Route path="/lyrics" element={<AppInner />} />
<Route path="/lyrics/:lyricId" element={<AppInner />} />
```

### 2. Map Path (useRouteSync)
```jsx
const pathToTab = {
  '/lyrics': 'lyrics',
};
```

### 3. Handle Route (useRouteSync effect)
```jsx
if (path.startsWith('/lyrics/') && params.lyricId) {
  const lyric = data.lyrics.find(l => l.id === params.lyricId);
  if (lyric) {
    setSelectedLyric(lyric);
    setTab('lyricDetail');
  }
} else if (path === '/lyrics') {
  setTab('lyrics');
}
```

### 4. Add Handler (AppInner)
```jsx
const handleSelectLyric = (lyric) => {
  setSelectedLyric(lyric);
  setTab('lyricDetail');
  routerNavigate(`/lyrics/${lyric.id}`);
};
```

### 5. Add to Sidebar (Components.jsx)
```jsx
const tabToPath = {
  'lyrics': '/lyrics',
};

const contentMenu = [
  { id: 'lyrics', label: 'Lyrics', icon: 'FileText' },
];
```

### 6. Render View (AppInner)
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

## Debugging

### Check Current URL
```javascript
console.log(window.location.pathname);
```

### Debug Route Changes
```javascript
// In useRouteSync
console.log('Route:', location.pathname);
console.log('Params:', params);
console.log('Tab:', tab);
```

### Test Direct Access
1. Navigate to route in browser: `/songs/abc123`
2. Refresh page
3. Should stay on same view

### Test Back Button
1. Navigate: List → Detail
2. Click browser back
3. Should return to List

## Common Patterns

### Pattern: List → Detail
```jsx
// List View
<Card onClick={() => routerNavigate(`/items/${item.id}`)}>
  {item.name}
</Card>

// Detail View
<button onClick={() => routerNavigate('/items')}>
  Back to List
</button>
```

### Pattern: Create & Navigate
```jsx
const handleCreate = async () => {
  const item = await actions.addItem({ name: 'New' });
  routerNavigate(`/items/${item.id}`);
};
```

### Pattern: Conditional Navigation
```jsx
if (success) {
  routerNavigate(`/items/${itemId}`);
} else {
  showToast('Failed', { type: 'error' });
}
```

## Best Practices

✅ **DO**: Use Link for navigation elements
```jsx
<Link to="/songs">Songs</Link>
```

❌ **DON'T**: Use button with onClick for simple links
```jsx
<button onClick={() => routerNavigate('/songs')}>Songs</button>
```

✅ **DO**: Clear state when going back
```jsx
setSelectedItem(null);
routerNavigate('/items');
```

❌ **DON'T**: Leave stale state
```jsx
routerNavigate('/items'); // State still has selected item
```

✅ **DO**: Handle missing data
```jsx
if (!item) {
  showToast('Not found');
  routerNavigate('/items');
  return;
}
```

❌ **DON'T**: Assume data exists
```jsx
setSelectedItem(item); // Might be undefined
```

## Tab ↔ Path Mapping

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

## Legacy Support

### Hash URLs Still Work
- `#?tab=songs` → `/songs`
- `#?tab=songs&songId=abc` → `/songs/abc`
- Automatic redirect to React Router path

### Bookmarks
Old bookmarks with hash URLs automatically upgrade to new paths.

## Need Help?

1. Check this reference
2. See full docs: `docs/REACT_ROUTER_DEV_GUIDE.md`
3. Review examples in `src/App.jsx`
4. Check test plan: `docs/REACT_ROUTER_TEST_PLAN.md`

## Quick Checklist

When adding a route:
- [ ] Add to `<Routes>` in App.jsx
- [ ] Add to `pathToTab` in useRouteSync
- [ ] Add route handling in useRouteSync effect
- [ ] Add navigation handler in AppInner
- [ ] Add to Sidebar tabToPath
- [ ] Add menu item to Sidebar (if needed)
- [ ] Render view in AppInner
- [ ] Test navigation
- [ ] Test back button
- [ ] Test refresh

---

**Quick Links**:
- Full Guide: `docs/REACT_ROUTER_DEV_GUIDE.md`
- Test Plan: `docs/REACT_ROUTER_TEST_PLAN.md`
- Summary: `docs/REACT_ROUTER_SUMMARY.md`
