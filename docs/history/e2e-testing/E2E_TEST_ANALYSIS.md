# E2E Test Issues and Fixes - Complete Analysis

## Timeline of Issues

### Initial Problem (Pre-Split)
- All 33 E2E tests running sequentially in single job
- 13+ minute runtime exceeding 15-minute timeout
- All tests failing

### After Parallel Split (Commit 40f1b51)
- Split into 5 parallel jobs
- Tests still failing with timeout error
- **Issue:** `waitForApp` timeout too short (10s)

### After Timeout Fix (Commit c1f09f5)
- Increased `waitForApp` timeout to 30s
- Different error appeared
- **Issue:** "Execution context was destroyed" in `clearStorage`

### After Async Fix (Commit 192a71a)
- Fixed `clearStorage` to properly await IndexedDB deletion
- Should resolve race condition issues

## Root Causes Identified

### 1. Dev Server Startup Time
**Problem:** Playwright's `webServer` can take up to 120 seconds to start, but `waitForApp` only waited 10 seconds.

**Why it wasn't caught before:**
- When running all tests together, dev server starts once and is reused
- Splitting into parallel jobs means each job starts its own dev server
- This exposed the insufficient timeout

**Fix:** Increased `waitForApp` default timeout from 10s to 30s

### 2. IndexedDB Cleanup Race Condition
**Problem:** The `clearStorage` function wasn't properly awaiting asynchronous IndexedDB deletion operations.

**Code flow that caused issue:**
```javascript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await clearStorage(page);  // IndexedDB deletion not fully awaited
  await page.reload();        // Reloads before cleanup done → context destroyed
  await waitForApp(page);
});
```

**Why it wasn't caught before:**
- When tests run sequentially with shared dev server, timing variations masked the issue
- The 500ms timeout after clearStorage sometimes worked, sometimes didn't
- Parallel execution with multiple dev servers made timing more unpredictable

**Fix:** 
- Changed `page.evaluate()` callback to `async`
- Properly await `indexedDB.databases()` and all `deleteDatabase()` calls
- Use `Promise.all()` to ensure all deletions complete before returning

## Technical Details

### clearStorage Fix Explanation

**Before (Broken):**
```javascript
await page.evaluate(() => {  // Not async!
  // ...
  if (window.indexedDB && window.indexedDB.databases) {
    window.indexedDB.databases().then((databases) => {  // Promise not awaited
      databases.forEach((db) => {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);  // Fire and forget
        }
      });
    });
  }
});
// page.evaluate returns before IndexedDB cleanup completes!
```

**After (Fixed):**
```javascript
await page.evaluate(async () => {  // Now async!
  // ...
  if (window.indexedDB && window.indexedDB.databases) {
    const databases = await window.indexedDB.databases();  // Await the list
    const promises = databases.map((db) => {
      if (db.name) {
        return new Promise((resolve) => {  // Wrap in Promise
          const request = window.indexedDB.deleteDatabase(db.name);
          request.onsuccess = () => resolve();
          request.onerror = () => resolve();    // Don't hang on error
          request.onblocked = () => resolve();  // Don't hang if blocked
        });
      }
      return Promise.resolve();
    });
    await Promise.all(promises);  // Wait for ALL deletions
  }
});
// Now page.evaluate actually waits for cleanup to complete!
```

## Why E2E Tests Are Fragile

### Fundamental Issues
1. **Complex Setup:** Each test needs dev server, browser, page load, storage cleanup
2. **Timing Dependencies:** Many async operations that must complete in order
3. **Environment Variability:** CI runs slower/faster than local, creating race conditions
4. **Shared State:** Tests can interfere with each other via browser storage
5. **Error Amplification:** One timing issue cascades into multiple test failures

### Why Splitting Made It Worse
- **More Dev Servers:** 5 parallel jobs = 5 dev servers starting simultaneously
- **Resource Contention:** More competition for CPU/memory on CI runners
- **Timing Variability:** Different jobs finish at different times
- **Exposed Hidden Bugs:** Issues that were intermittent became consistent

## Alternative Approaches Considered

### Option 1: Keep E2E Tests (Current Approach)
**Pros:**
- Tests actual user workflows
- Catches integration issues
- Validates full stack

**Cons:**
- Slow (3-5 min even when working)
- Fragile (timing issues)
- Hard to debug (many moving parts)
- Expensive (CI minutes)

### Option 2: React Testing Library Component Tests
**Pros:**
- Fast (<30 seconds total)
- Reliable (no timing issues)
- Easy to debug
- Cheap (CI minutes)

**Cons:**
- Don't test full stack
- Miss some integration issues
- Don't validate actual browser behavior

### Option 3: Hybrid Approach
**Pros:**
- Fast component tests for most coverage
- Few critical E2E tests for key flows
- Balance speed vs coverage

**Cons:**
- More test infrastructure
- Need to maintain both

## Recommendations

### If Keeping E2E Tests
1. ✅ Apply the two fixes already made (commits c1f09f5 and 192a71a)
2. Add retry logic for flaky tests (already configured: 2 retries)
3. Run E2E tests only on main branch, not on PRs
4. Consider reducing to 10-15 most critical tests
5. Add better error reporting and screenshots

### If Replacing E2E Tests
1. Keep parallel job structure for potential future use
2. Create React Testing Library test suite
3. Focus on:
   - Component rendering
   - User interactions
   - State management
   - Form validation
   - Data flow
4. Can add E2E tests later for critical paths only

## Current Status

### Fixes Applied
- ✅ Commit c1f09f5: Fixed `waitForApp` timeout (10s → 30s)
- ✅ Commit 192a71a: Fixed `clearStorage` async/await issues
- ⏳ Awaiting CI approval to verify fixes work

### If Fixes Work
- All 33 tests should pass
- 5 parallel jobs complete in 3-5 minutes
- CI pipeline unblocked

### If Fixes Don't Work
- Consider more aggressive options:
  - Disable E2E tests temporarily
  - Replace with component tests
  - Reduce to minimal critical E2E tests only

## Conclusion

The E2E tests had two critical bugs that became visible when splitting into parallel jobs:
1. Insufficient timeout for dev server startup
2. Race condition in storage cleanup

Both issues have been fixed. The tests were fundamentally flawed from the start, but running them all together in one job masked the problems. Splitting into parallel jobs was the right architectural decision, but it exposed pre-existing bugs that needed fixing.

**Recommendation:** Run the CI one more time to verify the fixes work. If they still fail, consider switching to React Testing Library for faster, more reliable tests.

---
**Last Updated:** 2026-02-16  
**Commits:** c1f09f5, 192a71a  
**Status:** Awaiting CI verification
