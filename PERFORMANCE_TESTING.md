# Performance Optimization - Installation & Testing Guide

## Step 1: Install Dependencies

```bash
npm install react-window
```

This will install the virtualization library needed for list performance.

## Step 2: Verify Installation

Check that package.json includes:
```json
"dependencies": {
  "react-window": "^1.8.10"
}
```

## Step 3: Build the Application

```bash
npm run build
```

### Expected Build Output

You should see multiple chunk files created:

```
dist/
├── assets/
│   ├── index-[hash].js           # Main app bundle (~800 KB)
│   ├── vendor-react-[hash].js    # React libraries (~150 KB)
│   ├── vendor-firebase-[hash].js # Firebase (~300 KB)
│   ├── vendor-charts-[hash].js   # Recharts (~200 KB)
│   ├── vendor-pdf-[hash].js      # jsPDF (~200 KB)
│   ├── vendor-icons-[hash].js    # Lucide icons (~100 KB)
│   ├── CalendarView-[hash].js    # Lazy loaded
│   ├── FinancialsView-[hash].js  # Lazy loaded
│   └── ...other chunks
```

### Success Criteria
- ✅ No warnings about chunks > 500 KB
- ✅ Multiple chunk files generated
- ✅ Main bundle significantly smaller
- ✅ Build completes without errors

## Step 4: Test in Development

```bash
npm run dev
```

### Test Checklist

#### 1. Basic Navigation
- [ ] App loads without errors
- [ ] Navigate to Today view
- [ ] Navigate to Songs list
- [ ] Navigate to Releases list
- [ ] All navigation works smoothly

#### 2. Lazy Loading
Open browser DevTools → Network tab:

- [ ] Navigate to Calendar - watch for CalendarView chunk loading
- [ ] Navigate to Timeline - watch for CombinedTimelineView chunk
- [ ] Navigate to Dashboard - watch for TaskDashboardView chunk
- [ ] Navigate to Financials - watch for FinancialsView chunk + recharts
- [ ] Navigate to Progress - watch for ProgressView chunk + recharts

**Expected**: Each view loads additional JS chunks on first visit.

#### 3. Loading States
- [ ] See loading spinner when navigating to lazy views
- [ ] Loading spinner disappears when view loads
- [ ] Loading spinner respects dark mode

#### 4. Virtualized Lists

Create test data:
1. Create 100+ songs
2. Create 100+ releases
3. Create 100+ tasks

**Test Songs List**:
- [ ] Navigate to /songs
- [ ] Scroll through list - should be smooth (60fps)
- [ ] Open DevTools → Elements tab
- [ ] Inspect table body - should only see ~20-30 row elements (not 100+)
- [ ] Scroll up and down - rows render dynamically

**Test Releases List**:
- [ ] Same test as above for releases

**Test Tasks Dashboard**:
- [ ] Navigate to dashboard with 100+ tasks
- [ ] Verify smooth scrolling
- [ ] Check DOM element count

#### 5. PDF Export (Lazy Loading)
- [ ] Open browser DevTools → Network tab
- [ ] Navigate to a Song detail page
- [ ] Click "Export PDF" button
- [ ] Watch network tab for jsPDF chunk loading
- [ ] PDF should generate successfully
- [ ] Subsequent PDF exports use cached chunk

#### 6. Dark Mode
Toggle dark mode (Settings → Theme):
- [ ] Loading spinner color changes
- [ ] All lazy-loaded views render in dark mode
- [ ] Virtualized lists style correctly
- [ ] No visual glitches

#### 7. Mobile/Responsive
Open DevTools → Toggle device toolbar:
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPad (768px)
- [ ] Virtualized lists work on small screens
- [ ] Lazy loading works on mobile
- [ ] No horizontal scroll issues

## Step 5: Performance Testing

### Chrome DevTools Performance Audit

1. Open DevTools → Lighthouse tab
2. Select "Performance" category
3. Click "Analyze page load"

**Target Scores**:
- [ ] Performance Score: > 80
- [ ] First Contentful Paint: < 2s
- [ ] Time to Interactive: < 3s
- [ ] Total Blocking Time: < 300ms

### Memory Profiling

**Before Optimization** (with 500 items):
- DOM nodes: ~2000+
- JS heap: ~30MB+
- Scroll FPS: 30-40fps

**After Optimization** (with 500 items):
- [ ] DOM nodes: < 500
- [ ] JS heap: < 20MB
- [ ] Scroll FPS: 55-60fps

### Network Performance

1. Open DevTools → Network tab
2. Throttle to "Fast 3G"
3. Hard reload page

**Measurements**:
- [ ] Initial page load < 5s
- [ ] Lazy chunk loads < 1s each
- [ ] Total transferred < 2MB

## Step 6: Regression Testing

Test all core functionality still works:

### CRUD Operations
- [ ] Create song
- [ ] Update song
- [ ] Delete song
- [ ] Archive song
- [ ] Same for releases, events, tasks

### Firebase Sync
- [ ] Changes sync to cloud
- [ ] Data persists after refresh
- [ ] Real-time updates work

### Existing Features
- [ ] Era Mode filtering
- [ ] Manager Mode
- [ ] Team member assignments
- [ ] Cost calculations
- [ ] Task status updates
- [ ] Calendar events
- [ ] File uploads
- [ ] Gallery view
- [ ] Search/filter functionality

## Step 7: Browser Compatibility

Test on multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Troubleshooting

### Issue: Lazy loading not working
**Symptoms**: All code loads immediately
**Solution**: Check vite.config.js has rollupOptions configured

### Issue: Virtualization not activating
**Symptoms**: All 500 rows render
**Solution**: 
- Verify list has > 50 items
- Check `enableVirtualization` prop is true
- Inspect browser console for errors

### Issue: PDF export fails
**Symptoms**: Error when clicking Export PDF
**Solution**:
- Check pdfExportLazy.js exists
- Verify import paths are correct
- Check browser console for module errors

### Issue: Loading spinner not appearing
**Symptoms**: Blank screen when navigating
**Solution**:
- Verify Suspense boundaries are in place
- Check LoadingFallback component renders
- Look for console errors

### Issue: Build warnings persist
**Symptoms**: Still getting large chunk warnings
**Solution**:
- Clear node_modules and reinstall
- Clear vite cache: `rm -rf node_modules/.vite`
- Rebuild: `npm run build`

## Performance Monitoring

### Bundle Analysis

Install bundle analyzer:
```bash
npm install -D rollup-plugin-visualizer
```

Add to vite.config.js:
```javascript
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  react(),
  visualizer({ open: true, gzipSize: true })
]
```

Run build and view stats:
```bash
npm run build
```

### Continuous Monitoring

Add to package.json scripts:
```json
{
  "analyze": "vite build && rollup-plugin-visualizer"
}
```

## Success Validation

Final checklist before considering optimization complete:

- [ ] All tests passing
- [ ] No console errors
- [ ] No build warnings
- [ ] Bundle size < 500 KB gzipped initial
- [ ] All views load < 2 seconds
- [ ] Large lists (500+) scroll smoothly
- [ ] PDF export works
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Firebase sync works
- [ ] All CRUD operations work
- [ ] Performance score > 80

## Rollback Instructions

If critical issues found:

1. **Revert vite.config.js**:
```javascript
export default defineConfig({
  plugins: [react()],
})
```

2. **Revert App.jsx imports**:
```javascript
// Change from:
const CalendarView = lazy(() => import('./Views')...);

// Back to:
import { CalendarView, ... } from './Views';
```

3. **Remove Suspense boundaries**
4. **Rebuild**: `npm run build`
5. **Test**: `npm run dev`

## Next Steps After Validation

1. Deploy to staging environment
2. Monitor performance metrics
3. Gather user feedback
4. Consider additional optimizations
5. Update documentation

---

**Last Updated**: 2024
**Status**: Ready for testing
