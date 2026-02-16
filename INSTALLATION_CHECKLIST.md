# Performance Optimization - Installation Checklist

## Pre-Installation
- [ ] Backup current working version
- [ ] Commit all changes to git
- [ ] Note current bundle size from `npm run build`
- [ ] Take screenshots of current performance (optional)

## Installation Steps

### Step 1: Install Dependencies
```bash
npm install react-window
```

**Verify**:
- [ ] No installation errors
- [ ] package.json shows `"react-window": "^1.8.10"`
- [ ] package-lock.json updated

### Step 2: Build Application
```bash
npm run build
```

**Verify**:
- [ ] Build completes successfully
- [ ] No warnings about chunk sizes
- [ ] Multiple chunk files in `dist/assets/`
- [ ] Main bundle significantly smaller

**Expected Output**:
```
✓ built in Xs
dist/index.html                   X kB
dist/assets/index-[hash].js       ~800 kB │ gzip: ~280 kB
dist/assets/vendor-react-[hash].js    ~150 kB
dist/assets/vendor-firebase-[hash].js ~300 kB
dist/assets/vendor-charts-[hash].js   ~200 kB
dist/assets/vendor-pdf-[hash].js      ~200 kB
dist/assets/vendor-icons-[hash].js    ~100 kB
... (additional lazy-loaded chunks)
```

## Testing Checklist

### Phase 1: Basic Functionality
```bash
npm run dev
```

- [ ] App starts without errors
- [ ] No console errors on load
- [ ] Today view loads
- [ ] Can navigate between views
- [ ] Dark mode toggle works

### Phase 2: Lazy Loading Verification

Open DevTools → Network tab → Filter: JS

**Test each lazy-loaded view**:
- [ ] Navigate to Calendar → See CalendarView-[hash].js load
- [ ] Navigate to Timeline → See CombinedTimelineView-[hash].js load
- [ ] Navigate to Dashboard → See TaskDashboardView-[hash].js load
- [ ] Navigate to Financials → See FinancialsView-[hash].js + recharts load
- [ ] Navigate to Progress → See ProgressView-[hash].js + recharts load

**Verify loading states**:
- [ ] Loading spinner appears briefly
- [ ] Spinner disappears when content loads
- [ ] Spinner respects dark mode
- [ ] No blank screens

### Phase 3: Virtualization Testing

**Create Test Data** (if needed):
```
Create 100+ songs through the UI or import test data
```

**Test Songs List** (with 100+ items):
- [ ] Navigate to /songs
- [ ] List displays correctly
- [ ] Scrolling is smooth (60fps)
- [ ] Open DevTools → Elements → Inspect table
- [ ] Verify only ~20-30 row elements exist (not 100+)
- [ ] Scroll up and down - rows appear dynamically
- [ ] Click on items - navigation works
- [ ] Sort and filter still work

**Test Releases List** (with 100+ items):
- [ ] Same verification as Songs list

**Test Tasks Dashboard** (with 100+ tasks):
- [ ] Smooth scrolling
- [ ] Dynamic row rendering
- [ ] All interactions work

### Phase 4: PDF Export

**Test PDF Functionality**:
- [ ] Open DevTools → Network tab
- [ ] Navigate to Song detail page
- [ ] Click "Export PDF" button
- [ ] Watch for jsPDF chunk loading in network tab
- [ ] PDF generates successfully
- [ ] Second export uses cached chunk (no new network request)
- [ ] Test Release PDF export
- [ ] Test Video PDF export

### Phase 5: Feature Regression Testing

**CRUD Operations**:
- [ ] Create new song
- [ ] Edit song details
- [ ] Delete song
- [ ] Archive song
- [ ] Restore from archive
- [ ] Repeat for releases, events, tasks

**Data Integrity**:
- [ ] All fields save correctly
- [ ] Data persists after refresh
- [ ] Firebase sync works (if configured)
- [ ] No data loss

**Complex Features**:
- [ ] Era Mode filtering works
- [ ] Manager Mode works
- [ ] Team member assignments work
- [ ] Cost calculations correct
- [ ] Task status updates work
- [ ] Calendar events display correctly
- [ ] Timeline view accurate

### Phase 6: Performance Metrics

**Using Chrome DevTools**:

1. **Lighthouse Audit**:
   - [ ] Open DevTools → Lighthouse
   - [ ] Run Performance audit
   - [ ] Performance Score > 80
   - [ ] First Contentful Paint < 2s
   - [ ] Time to Interactive < 3s
   - [ ] Total Blocking Time < 300ms

2. **Network Analysis**:
   - [ ] Open DevTools → Network tab
   - [ ] Throttle to "Fast 3G"
   - [ ] Hard refresh
   - [ ] Initial load < 5 seconds
   - [ ] Each lazy chunk < 1 second
   - [ ] Total transferred < 2MB

3. **Performance Recording**:
   - [ ] Open DevTools → Performance
   - [ ] Record 6 seconds of scrolling large list
   - [ ] Stop recording
   - [ ] Check FPS (should be 55-60)
   - [ ] No long tasks (> 50ms)
   - [ ] No layout thrashing

4. **Memory Profile**:
   - [ ] Open DevTools → Memory
   - [ ] Take heap snapshot
   - [ ] Navigate through app
   - [ ] Take another snapshot
   - [ ] Check for memory leaks
   - [ ] DOM node count reasonable

### Phase 7: Browser Compatibility

Test on different browsers:
- [ ] Chrome (latest) - All features work
- [ ] Firefox (latest) - All features work
- [ ] Safari (latest) - All features work
- [ ] Edge (latest) - All features work

### Phase 8: Mobile Testing

Test on mobile devices/emulation:
- [ ] iPhone SE (375px width)
- [ ] iPhone 12 (390px width)
- [ ] iPad (768px width)
- [ ] Android phone (414px width)

**Verify**:
- [ ] Responsive layout works
- [ ] Touch interactions work
- [ ] Lazy loading works on mobile
- [ ] Virtualized lists work
- [ ] Performance acceptable
- [ ] No horizontal scroll

### Phase 9: Dark Mode Testing

Toggle dark mode on/off:
- [ ] All views render correctly in dark mode
- [ ] Loading spinner changes color
- [ ] Lazy-loaded views support dark mode
- [ ] Virtualized lists style correctly
- [ ] No contrast issues
- [ ] Smooth theme transitions

## Post-Testing

### Documentation Review
- [ ] Read PERFORMANCE_OPTIMIZATION.md
- [ ] Read PERFORMANCE_TESTING.md
- [ ] Read PERFORMANCE_QUICK_REFERENCE.md
- [ ] Understand rollback procedure

### Metrics Recording
Document the following for comparison:

**Before Optimization**:
- Main bundle size: _______
- Initial load time: _______
- Time to interactive: _______
- Lighthouse score: _______

**After Optimization**:
- Main bundle size: _______
- Initial load time: _______
- Time to interactive: _______
- Lighthouse score: _______

**Improvement**:
- Bundle size reduction: _______%
- Load time reduction: _______%
- Performance score change: _______

### Known Issues
Document any issues found:
1. _______________
2. _______________
3. _______________

### Sign-off

Testing completed by: _______________
Date: _______________
Status: [ ] PASS  [ ] FAIL  [ ] PASS WITH ISSUES

Notes:
_____________________________________
_____________________________________
_____________________________________

## Rollback (If Needed)

If critical issues found:

1. **Revert vite.config.js**:
```javascript
export default defineConfig({
  plugins: [react()],
})
```

2. **Revert App.jsx** imports to direct imports
3. **Remove Suspense** boundaries
4. **Rebuild**: `npm run build`
5. **Test**: `npm run dev`

## Deployment

After successful testing:
- [ ] Merge to main branch
- [ ] Deploy to staging
- [ ] Test staging environment
- [ ] Monitor for errors
- [ ] Deploy to production
- [ ] Monitor performance metrics
- [ ] Gather user feedback

## Success Criteria

All must be checked before considering complete:
- [ ] Build passes without warnings
- [ ] Bundle size reduced by > 20%
- [ ] Initial load time improved
- [ ] Large lists scroll smoothly
- [ ] All features work correctly
- [ ] No regressions found
- [ ] Dark mode works
- [ ] Mobile works
- [ ] Performance score improved

---

**Version**: 1.0
**Last Updated**: 2024
**Status**: Ready for use
