# E2E Test Execution Checklist

> **⚠️ DEPRECATED:** This checklist is for the **archived E2E test infrastructure**. 
> 
> E2E tests were replaced with unit tests on **2026-02-16**. See [E2E_DOCS_DEPRECATED.md](E2E_DOCS_DEPRECATED.md) for details.
>
> **Current testing:** Run `npm test` for unit tests (completes in <5 seconds).

---

Quick checklist for running E2E tests before releases or major changes.

## Pre-Test Setup ✓

- [ ] Latest code pulled from repository
- [ ] Dependencies up to date (`npm install`)
- [ ] Playwright browsers installed (`npx playwright install`)
- [ ] No dev server currently running
- [ ] Port 5173 is available

## Quick Validation ✓

Run these commands in order:

### 1. Lint Check
```bash
npm run lint
```
**Expected**: No errors, 0 warnings

### 2. Unit Tests
```bash
npm test
```
**Expected**: All tests pass

### 3. Build Check
```bash
npm run build
```
**Expected**: Build succeeds without errors

### 4. E2E Tests
```bash
npm run test:e2e
```
**Expected**: 36 tests pass in 2-4 minutes

## Test Suite Breakdown ✓

### Song → Release Flow (6 tests)
- [ ] Create song with core version
- [ ] Create song, add version, and create release
- [ ] Verify tasks appear in timeline
- [ ] Verify tasks appear in dashboard
- [ ] Handle empty state gracefully

**Run individually**:
```bash
npm run test:e2e tests/song-release-flow.spec.js
```

### Task Override Flow (5 tests)
- [ ] Create song and verify auto-generated tasks
- [ ] Edit auto-generated task and persist override
- [ ] Create global task without parent
- [ ] Edit global task and verify changes persist
- [ ] Update task status multiple times

**Run individually**:
```bash
npm run test:e2e tests/task-override.spec.js
```

### Cost Precedence Flow (7 tests)
- [ ] Use estimated cost when only estimated is set
- [ ] Use quoted cost over estimated
- [ ] Use paid cost over quoted and estimated
- [ ] Update cost tiers progressively
- [ ] Calculate total costs correctly
- [ ] Handle zero and negative costs
- [ ] Show cost in song and release detail

**Run individually**:
```bash
npm run test:e2e tests/cost-precedence.spec.js
```

### Team Assignment Flow (8 tests)
- [ ] Create team member
- [ ] Create musician with instruments
- [ ] Assign single team member to task
- [ ] Assign multiple team members with cost split
- [ ] Filter team members by musician flag
- [ ] Track costs per team member
- [ ] Handle company/organization type
- [ ] Update team member role and contact info

**Run individually**:
```bash
npm run test:e2e tests/team-assignment.spec.js
```

### Backup & Restore Flow (10 tests)
- [ ] Access settings and see backup section
- [ ] Create backup
- [ ] Export data as JSON
- [ ] Restore from backup
- [ ] List available backups
- [ ] Delete backup
- [ ] Import data from JSON file
- [ ] Handle backup with no data gracefully
- [ ] Verify backup includes all data types

**Run individually**:
```bash
npm run test:e2e tests/backup-restore.spec.js
```

## Test Results ✓

### View HTML Report
```bash
npm run test:e2e:report
```

**Check for**:
- [ ] All tests passed
- [ ] No screenshots (indicates no failures)
- [ ] No videos (indicates no failures)
- [ ] Execution time under 5 minutes
- [ ] No console errors

### Test Artifacts
- [ ] `playwright-report/` directory created
- [ ] `test-results/` directory empty (no failures)
- [ ] HTML report accessible

## Debugging Failed Tests ✓

If tests fail:

### 1. Review Error Messages
```bash
npm run test:e2e
# Read error output carefully
```

### 2. View Screenshots
Check `test-results/` for failure screenshots

### 3. Run in Headed Mode
```bash
npm run test:e2e -- --headed
# Watch browser to see what's happening
```

### 4. Run in Debug Mode
```bash
npm run test:e2e:debug
# Step through test execution
```

### 5. Run Single Test
```bash
npm run test:e2e tests/failing-test.spec.js
```

### 6. Check Console Logs
Review browser console output in test results

## CI/CD Verification ✓

### Local CI Simulation
```bash
CI=true npm run test:e2e
```

**Expected**:
- [ ] Tests run in serial (1 worker)
- [ ] Retries on failure (up to 2 times)
- [ ] All tests pass

### GitHub Actions
Check Actions tab on GitHub:
- [ ] E2E Tests workflow exists
- [ ] Latest run passed
- [ ] Test reports uploaded as artifacts
- [ ] No workflow errors

## Cross-Browser Testing ✓

### Chromium (Default)
```bash
npm run test:e2e -- --project=chromium
```

### Firefox (Optional)
```bash
npx playwright install firefox
npm run test:e2e -- --project=firefox
```

### WebKit (Optional)
```bash
npx playwright install webkit
npm run test:e2e -- --project=webkit
```

## Performance Checks ✓

- [ ] Total test time under 5 minutes
- [ ] No individual test over 30 seconds
- [ ] No memory leaks
- [ ] Dev server starts within 10 seconds
- [ ] Tests run in parallel (locally)

## Coverage Validation ✓

### PRE_QA_CHECKLIST Scenarios
- [ ] Song → Version → Release flow ✓
- [ ] Auto task + override flow ✓
- [ ] Cost precedence flow ✓
- [ ] Global tasks + team assignments ✓
- [ ] Backup / restore flow ✓

### Critical Paths
- [ ] Data persistence (IndexedDB)
- [ ] Navigation (hash router)
- [ ] Form submission
- [ ] Modal interactions
- [ ] Empty state handling

## Test Data Cleanup ✓

After testing:
```bash
# Clear test artifacts
rm -rf test-results/ playwright-report/

# Clear screenshots (if any)
rm -rf screenshots/
```

## Sign-Off Checklist ✓

Before marking tests as passing:

- [ ] All 36 tests passed
- [ ] Execution time acceptable (< 5 minutes)
- [ ] No console errors
- [ ] No memory leaks
- [ ] Screenshots reviewed (if any failures)
- [ ] Test report reviewed
- [ ] CI workflow passing
- [ ] Documentation up to date

## Test Execution Record

**Date**: _________________

**Tester**: _________________

**Branch**: _________________

**Commit**: _________________

### Results

- **Total Tests**: 36
- **Passed**: _____
- **Failed**: _____
- **Skipped**: _____
- **Duration**: _____ minutes

### Failures (if any)

Test Name | Error | Screenshot | Notes
----------|-------|------------|------
          |       |            |
          |       |            |
          |       |            |

### Sign-Off

- [ ] All tests passed
- [ ] Results documented
- [ ] Issues filed (if any)
- [ ] Ready for deployment

**Approved by**: _________________

**Date**: _________________

## Quick Reference

### Run all tests
```bash
npm run test:e2e
```

### Run with UI
```bash
npm run test:e2e:ui
```

### Debug tests
```bash
npm run test:e2e:debug
```

### View report
```bash
npm run test:e2e:report
```

### Run specific suite
```bash
npm run test:e2e tests/song-release-flow.spec.js
npm run test:e2e tests/task-override.spec.js
npm run test:e2e tests/cost-precedence.spec.js
npm run test:e2e tests/team-assignment.spec.js
npm run test:e2e tests/backup-restore.spec.js
```

## Support

**Documentation**:
- [Full E2E Testing Guide](./docs/E2E_TESTING.md)
- [Quick Reference](./docs/E2E_TESTING_QUICK_REF.md)
- [Setup Guide](./E2E_SETUP.md)

**Troubleshooting**:
See `docs/E2E_TESTING.md` Troubleshooting section

**Resources**:
- [Playwright Docs](https://playwright.dev)
- [GitHub Actions Logs](https://github.com/your-repo/actions)

---

**Template Version**: 1.0  
**Last Updated**: January 2025

For detailed instructions, see [E2E_SETUP.md](./E2E_SETUP.md)
