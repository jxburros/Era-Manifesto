# React Router Migration Guide for Developers

## Overview

This guide helps developers understand and work with the new React Router integration in Era Manifesto.

## For New Features

### Adding a New Route

**Example: Adding a "Lyrics" feature**

1. **Define the route in App.jsx**:

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

2. **Add path mapping in useRouteSync hook**:

```jsx
const pathToTab = {
  // ... existing paths
  '/lyrics': 'lyrics',
};
```

3. **Handle the route in useRouteSync effect**:

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

4. **Add navigation handler in AppInner**:

```jsx
const handleSelectLyric = (lyric) => {
  setSelectedLyric(lyric);
  setTab('lyricDetail');
  routerNavigate(`/lyrics/${lyric.id}`);
};
```

5. **Add to Sidebar (Components.jsx)**:

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

6. **Render the views in AppInner**:

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

## Common Patterns

### Pattern 1: List → Detail Navigation

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

### Pattern 2: Conditional Navigation

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

### Pattern 3: Navigation with State

```jsx
// Pass state through navigation
routerNavigate('/songs', { 
  state: { fromDashboard: true } 
});

// Retrieve state in destination
const location = useLocation();
const fromDashboard = location.state?.fromDashboard;
```

### Pattern 4: Query Parameters

```jsx
// Navigate with query params
routerNavigate('/songs?filter=released&sort=date');

// Read query params
const [searchParams] = useSearchParams();
const filter = searchParams.get('filter'); // 'released'
const sort = searchParams.get('sort'); // 'date'
```

## Best Practices

### 1. Use Link for Simple Navigation

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

### 2. Always Clear State When Navigating Back

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

### 3. Use Consistent Path Naming

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

### 4. Handle Missing Data Gracefully

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

## Debugging

### Check Current Route

Open browser console:
```javascript
// Current pathname
window.location.pathname

// React Router location
import { useLocation } from 'react-router-dom';
const location = useLocation();
console.log(location);
```

### Verify Route Registration

Check App.jsx Routes:
```jsx
<Routes>
  <Route path="/your-route" element={<AppInner />} />
</Routes>
```

### Debug Navigation Issues

Add logging to `useRouteSync`:
```jsx
useEffect(() => {
  console.log('Route changed:', location.pathname);
  console.log('Params:', params);
  // ... rest of effect
}, [location.pathname, params]);
```

## Migration Checklist

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

## Common Mistakes

### Mistake 1: Forgetting to Add Route

**Symptom**: Direct URL access shows wrong view

**Fix**: Add route to `App.jsx`:
```jsx
<Route path="/your-route" element={<AppInner />} />
```

### Mistake 2: Not Clearing Selected State

**Symptom**: Going back to list still shows old detail view

**Fix**: Clear state in back handler:
```jsx
const handleBack = () => {
  setSelectedItem(null); // Add this
  routerNavigate('/items');
};
```

### Mistake 3: Mismatched Tab Names

**Symptom**: Sidebar highlighting is wrong

**Fix**: Ensure consistent naming:
```jsx
// In useRouteSync
'/tasks': 'globalTasks',  // Must match tab state

// In Sidebar
'globalTasks': '/tasks',  // Reverse mapping
```

### Mistake 4: Missing Dependencies in useEffect

**Symptom**: Route changes don't trigger updates

**Fix**: Add all used variables to dependency array:
```jsx
useEffect(() => {
  // ... uses data.songs, params.songId
}, [data.songs, params.songId]); // Include all dependencies
```

## Performance Tips

### 1. Avoid Unnecessary Re-renders

```jsx
// Memoize expensive computations
const filteredSongs = useMemo(() => {
  return songs.filter(/* ... */);
}, [songs, filterCriteria]);
```

### 2. Use React.memo for Route Components

```jsx
export const SongListView = memo(function SongListView({ onSelectSong }) {
  // ... component code
});
```

### 3. Lazy Load Route Components (Future Enhancement)

```jsx
const SongListView = lazy(() => import('./views/SongListView'));
const SongDetailView = lazy(() => import('./views/SongDetailView'));
```

## Additional Resources

- [React Router Docs](https://reactrouter.com/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [Era Manifesto Architecture](./APP%20ARCHITECTURE.txt)
- [Era Manifesto Project Direction](./PROJECT_DIRECTION.md)

## Questions?

If you have questions about React Router integration:

1. Check this guide first
2. Review existing route implementations in `App.jsx`
3. Check the test plan for expected behavior
4. Consult with the architecture_advisor agent

## Summary

React Router integration in Era Manifesto is designed to be:
- **Simple**: Follow existing patterns
- **Consistent**: Use standard React Router conventions
- **Backwards Compatible**: Hash URLs still work
- **Developer Friendly**: Clear patterns to follow

When in doubt, look at existing implementations (songs, releases, events) and follow the same pattern.
