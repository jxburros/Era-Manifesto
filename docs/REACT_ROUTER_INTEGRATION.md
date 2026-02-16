# React Router Integration

## Overview

Era Manifesto now uses **React Router v7** alongside the existing hash-based routing system to provide:
- Clean, modern URLs (e.g., `/songs/abc123` instead of `#?tab=songs&songId=abc123`)
- Better SEO and shareability
- Native browser back/forward navigation
- Full backward compatibility with existing hash-based URLs

## Implementation Approach

### Hybrid Routing System

The app uses a **hybrid routing approach** that supports both:

1. **React Router paths** (primary):
   - `/songs` → Songs list view
   - `/songs/:songId` → Song detail view
   - `/releases/:releaseId` → Release detail view
   - etc.

2. **Legacy hash-based URLs** (backward compatibility):
   - `#?tab=songs&songId=xyz` → Automatically redirects to `/songs/xyz`
   - Existing bookmarks and deep links continue to work

### Route Mapping

| Route | View | Description |
|-------|------|-------------|
| `/` or `/today` | Today view | Daily overview and quick stats |
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

## Key Components

### 1. `useRouteSync` Hook (App.jsx)

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

### 2. Updated Sidebar (Components.jsx)

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

### 3. Navigation Functions

All navigation now uses React Router's `navigate()`:

```javascript
// Old approach (still works internally)
setTab('songs');

// New approach (recommended)
routerNavigate('/songs');

// With selected item
routerNavigate(`/songs/${song.id}`);
```

## Backward Compatibility

### Legacy Hash URLs

Hash-based URLs are automatically converted to React Router paths:

- `#?tab=songs` → `/songs`
- `#?tab=songs&songId=abc123` → `/songs/abc123`
- `#?tab=releases&releaseId=xyz789` → `/releases/xyz789`

The conversion happens in the `useRouteSync` hook's hash change listener.

### Existing Functionality Preserved

- Deep linking works with both old and new URL formats
- Browser back/forward buttons work seamlessly
- Page refresh preserves current view and selected items
- All tab-based state management continues to work

## Benefits

### For Users
- ✅ Clean, readable URLs
- ✅ Shareable links to specific songs, releases, events
- ✅ Better browser history navigation
- ✅ Existing bookmarks still work

### For Developers
- ✅ Standard React Router patterns
- ✅ Easy to add new routes
- ✅ Better code organization
- ✅ Type-safe with TypeScript (future enhancement)

### For SEO (Future)
- ✅ Server-side rendering ready
- ✅ Meta tags per route possible
- ✅ Better indexing of individual items

## Testing

### Manual Testing Checklist

- [ ] Navigate between views using sidebar links
- [ ] Click on song/release/event to view details
- [ ] Use browser back button to return to list view
- [ ] Refresh page on detail view - should stay on same item
- [ ] Test legacy hash URLs (e.g., `#?tab=songs&songId=xyz`)
- [ ] Test command palette navigation (Cmd/Ctrl+K)
- [ ] Test deep links shared from different devices

### URL Format Examples

**List Views:**
```
https://app.eramanifesto.com/songs
https://app.eramanifesto.com/releases
https://app.eramanifesto.com/tasks
```

**Detail Views:**
```
https://app.eramanifesto.com/songs/abc-123-song-id
https://app.eramanifesto.com/releases/xyz-789-release-id
https://app.eramanifesto.com/events/evt-456-event-id
```

**Special Views:**
```
https://app.eramanifesto.com/today
https://app.eramanifesto.com/dashboard
https://app.eramanifesto.com/calendar
```

## Future Enhancements

### Potential Improvements

1. **Nested Routes**: Use outlet pattern for cleaner routing structure
2. **Route Guards**: Authentication and permission checks
3. **Lazy Loading**: Code-split routes for better performance
4. **Route Transitions**: Animated transitions between views
5. **Meta Tags**: Dynamic meta tags for social sharing
6. **Breadcrumbs**: Automatic breadcrumb generation from routes

### Migration Path

To fully migrate away from hash-based routing in the future:

1. Remove hash URL listener from `useRouteSync`
2. Remove `tabToPath` mapping (use routes directly)
3. Simplify state management (use URL as single source of truth)
4. Add route-based lazy loading

## Troubleshooting

### Issue: Back button doesn't work
**Solution**: Ensure all navigation uses `routerNavigate()` instead of direct `setTab()`

### Issue: Page refreshes to wrong view
**Solution**: Check that `useRouteSync` properly maps URL params to state

### Issue: Legacy hash URLs not redirecting
**Solution**: Verify hash change listener is registered in `useRouteSync`

### Issue: Links have underlines
**Solution**: Ensure `index.css` has `a { text-decoration: none; }` rule

## Code References

### Key Files Modified

- `src/App.jsx`: Added React Router integration, `useRouteSync` hook
- `src/Components.jsx`: Updated Sidebar to use `<Link>` components
- `src/index.css`: Added link styling rules

### No Breaking Changes

- All existing functionality preserved
- Hash-based routing still works as fallback
- Internal state management unchanged
- No API changes required

## Deployment Considerations

### Server Configuration

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

## Summary

React Router integration enhances Era Manifesto with modern routing while maintaining full backward compatibility. The hybrid approach ensures existing users experience no disruption while new users benefit from clean, shareable URLs.
