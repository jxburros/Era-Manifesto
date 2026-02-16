# E2E Testing Guide for Era Manifesto

This document provides comprehensive instructions for running, writing, and maintaining end-to-end tests using Playwright.

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Running Tests](#running-tests)
4. [Test Structure](#test-structure)
5. [Writing New Tests](#writing-new-tests)
6. [Best Practices](#best-practices)
7. [CI Integration](#ci-integration)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Era Manifesto uses Playwright for end-to-end testing. The test suite covers critical user flows including:

- **Song → Version → Release Flow**: Creating and linking content
- **Task Override Flow**: Auto-generated tasks and manual overrides
- **Cost Precedence Flow**: Estimated → Quoted → Paid cost hierarchy
- **Team Assignment Flow**: Team member management and task assignments
- **Backup & Restore Flow**: Data backup, export, and restoration

### Why Playwright?

- **Cross-browser testing** (Chromium, Firefox, WebKit)
- **Auto-waiting** for elements
- **Network interception** for API mocking
- **Screenshot and video recording** on failure
- **Headless and headed modes**
- **Excellent developer experience**

---

## Setup

### Prerequisites

- Node.js 18+ installed
- Era Manifesto project cloned locally
- Dependencies installed via `npm install`

### Install Playwright

```bash
# Install Playwright test library (already in package.json)
npm install

# Install Playwright browsers
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers for testing.

### Verify Installation

```bash
# Run a quick test
npm run test:e2e -- --grep "should access settings"
```

---

## Running Tests

### Basic Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Run specific test file
npm run test:e2e tests/song-release-flow.spec.js

# Run tests matching a pattern
npm run test:e2e -- --grep "backup"

# Run tests in headed mode (see browser)
npm run test:e2e -- --headed

# Run with specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

### View Test Report

After test execution:

```bash
# Open HTML report
npm run test:e2e:report
```

The report shows:
- Test results (pass/fail)
- Screenshots on failure
- Video recordings
- Test duration
- Error traces

---

## Test Structure

### Directory Layout

```
tests/
├── helpers.e2e.js           # Shared test utilities
├── fixtures.e2e.js          # Test data generators
├── song-release-flow.spec.js
├── task-override.spec.js
├── cost-precedence.spec.js
├── team-assignment.spec.js
└── backup-restore.spec.js
```

### Test File Structure

```javascript
import { test, expect } from '@playwright/test';
import { waitForApp, clearStorage } from './helpers.e2e.js';

test.describe('Feature Name', () => {
  // Reset storage before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.reload();
    await waitForApp(page);
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

---

## Writing New Tests

### Step 1: Create Test File

Create a new file in `tests/` directory:

```bash
touch tests/my-feature.spec.js
```

### Step 2: Import Dependencies

```javascript
import { test, expect } from '@playwright/test';
import { 
  waitForApp, 
  clearStorage, 
  navigateToRoute, 
  clickAndWait, 
  fillInput, 
  waitForDataSave 
} from './helpers.e2e.js';
import { createTestSong, getRelativeDate } from './fixtures.e2e.js';
```

### Step 3: Write Test Cases

```javascript
test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.reload();
    await waitForApp(page);
  });

  test('should perform action', async ({ page }) => {
    // 1. Navigate to page
    await navigateToRoute(page, '/songs');
    
    // 2. Interact with UI
    await page.click('button:has-text("New Song")');
    await fillInput(page, 'input[name="title"]', 'Test Song');
    
    // 3. Submit form
    await clickAndWait(page, 'button:has-text("Save")');
    await waitForDataSave(page);
    
    // 4. Verify result
    await expect(page.getByText('Test Song')).toBeVisible();
  });
});
```

### Step 4: Run Your Test

```bash
npm run test:e2e tests/my-feature.spec.js
```

---

## Best Practices

### 1. Test Independence

Each test should be **independent** and **idempotent**:

```javascript
test.beforeEach(async ({ page }) => {
  await clearStorage(page); // Clean slate for each test
  await page.reload();
  await waitForApp(page);
});
```

### 2. Wait for Operations

Always wait for async operations to complete:

```javascript
// Wait for data save to IndexedDB
await waitForDataSave(page);

// Wait for navigation
await navigateToRoute(page, '/songs');
await waitForNavigation(page);

// Wait for modal
await waitForModal(page);
```

### 3. Use Locators Wisely

Prefer **semantic selectors** over brittle ones:

```javascript
// Good - uses visible text
await page.click('button:has-text("Save")');
await page.getByRole('button', { name: 'Save' });

// Good - uses form field names
await page.fill('input[name="title"]', 'My Song');

// Avoid - brittle class names
await page.click('.btn-primary-save'); // Bad
```

### 4. Handle Dynamic Content

Use Playwright's auto-waiting features:

```javascript
// Waits up to 30s for element to appear
await expect(page.getByText('Song Created')).toBeVisible();

// Wait for specific state
await page.waitForSelector('text=Loading', { state: 'hidden' });
```

### 5. Test Realistic Scenarios

Use fixture generators for consistent test data:

```javascript
import { createTestSong, getRelativeDate } from './fixtures.e2e.js';

const song = createTestSong({
  title: 'My Test Song',
  releaseDate: getRelativeDate(30) // 30 days from now
});
```

### 6. Add Descriptive Test Names

```javascript
// Good
test('should create song with release date and verify in timeline', ...);

// Bad
test('test 1', ...);
```

### 7. Group Related Tests

```javascript
test.describe('Song Management', () => {
  test.describe('Creation', () => {
    test('should create new song', ...);
    test('should create song with version', ...);
  });
  
  test.describe('Editing', () => {
    test('should edit song title', ...);
    test('should update release date', ...);
  });
});
```

### 8. Screenshot on Important Steps

```javascript
import { takeScreenshot } from './helpers.e2e.js';

await takeScreenshot(page, 'before-save');
await page.click('button:has-text("Save")');
await takeScreenshot(page, 'after-save');
```

---

## CI Integration

### GitHub Actions

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Environment Variables

Set these in CI environment:

```bash
CI=true                    # Enables retries and optimizations
PLAYWRIGHT_BROWSERS_PATH=0 # Uses system browsers
```

### Headless Mode

Tests run in headless mode by default in CI. To force headless locally:

```bash
npm run test:e2e -- --headed=false
```

---

## Troubleshooting

### Tests Timeout

**Problem**: Tests fail with timeout errors

**Solutions**:
```javascript
// Increase timeout for slow operations
test.setTimeout(60000); // 60 seconds

// Or per-action
await page.waitForSelector('text=Loaded', { timeout: 10000 });
```

### Element Not Found

**Problem**: `Error: Element not found`

**Solutions**:
```javascript
// Check if element is visible first
const visible = await isVisible(page, 'text=My Element');
if (visible) {
  await page.click('text=My Element');
}

// Or use try-catch
try {
  await page.click('button:has-text("Save")', { timeout: 5000 });
} catch {
  // Fallback approach
  await page.keyboard.press('Enter');
}
```

### Storage Not Clearing

**Problem**: Tests fail due to leftover data

**Solutions**:
```javascript
// Ensure beforeEach clears storage
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await clearStorage(page);
  await page.reload();
  await page.waitForTimeout(1000); // Extra wait
  await waitForApp(page);
});
```

### Hash Router Navigation

**Problem**: Navigation doesn't work as expected

**Solutions**:
```javascript
// Use navigateToRoute helper
await navigateToRoute(page, '/songs');

// Or manually with hash
await page.goto('/#/songs');
await page.waitForTimeout(300);
```

### IndexedDB Operations

**Problem**: Data not persisting

**Solutions**:
```javascript
// Always wait after save operations
await clickAndWait(page, 'button:has-text("Save")');
await waitForDataSave(page, 2000); // Extra wait time

// Verify data persisted
await page.reload();
await waitForApp(page);
await expect(page.getByText('My Data')).toBeVisible();
```

### Debug Mode

Run tests in debug mode to step through:

```bash
npm run test:e2e:debug tests/my-feature.spec.js
```

Or add debugger to code:

```javascript
test('should debug issue', async ({ page }) => {
  await page.pause(); // Opens Playwright Inspector
  // ... rest of test
});
```

### View Browser Console

```javascript
page.on('console', msg => console.log('BROWSER:', msg.text()));
page.on('pageerror', err => console.log('ERROR:', err));
```

---

## Test Helpers Reference

### Navigation
- `waitForApp(page)` - Wait for app to load
- `navigateToRoute(page, path)` - Navigate to hash route
- `waitForNavigation(page)` - Wait after navigation

### Storage
- `clearStorage(page)` - Clear all storage
- `getAppState(page)` - Get localStorage state
- `setAppState(page, state)` - Set localStorage state

### Interactions
- `clickAndWait(page, selector)` - Click and wait
- `fillInput(page, selector, value)` - Fill input field
- `selectOption(page, selector, value)` - Select dropdown option

### Modals
- `waitForModal(page)` - Wait for modal to appear
- `closeModal(page)` - Close modal

### Verification
- `isVisible(page, selector)` - Check element visibility
- `getText(page, selector)` - Get element text
- `getElementCount(page, selector)` - Count elements

### Data
- `waitForDataSave(page)` - Wait for IndexedDB save

---

## Fixture Generators Reference

### Songs
```javascript
createTestSong({ title, releaseDate, estimatedCost })
```

### Versions
```javascript
createTestVersion(songId, { name, releaseDate })
```

### Releases
```javascript
createTestRelease({ name, type, releaseDate })
```

### Tasks
```javascript
createTestTask({ taskName, status, date, estimatedCost })
```

### Team Members
```javascript
createTestTeamMember({ name, role, isMusician, instruments })
```

### Dates
```javascript
getRelativeDate(daysFromNow) // Returns YYYY-MM-DD
```

### Scenarios
```javascript
createCompleteScenario() // Returns song, version, release, task, team member
createCostPrecedenceScenario() // Returns tasks with different cost states
createTeamAssignmentScenario() // Returns members and task with assignments
```

---

## Contributing

### Adding New Tests

1. Identify user flow to test
2. Create test file in `tests/`
3. Use existing helpers and fixtures
4. Follow naming conventions
5. Run tests locally
6. Submit PR with tests

### Updating Helpers

If you add a new helper function:

1. Add to `helpers.e2e.js`
2. Document with JSDoc comments
3. Export function
4. Update this guide

### Reporting Issues

When tests fail unexpectedly:

1. Check test output for errors
2. Review screenshots/videos in `playwright-report/`
3. Try running in headed mode: `npm run test:e2e -- --headed`
4. Report issue with:
   - Test file and name
   - Error message
   - Screenshots
   - Steps to reproduce

---

## Performance Tips

### Run Tests in Parallel

Playwright runs tests in parallel by default. Configure in `playwright.config.js`:

```javascript
export default defineConfig({
  workers: process.env.CI ? 1 : undefined, // Parallel locally, serial in CI
  fullyParallel: true,
});
```

### Optimize Wait Times

```javascript
// Don't over-wait
await waitForDataSave(page, 500); // Usually sufficient

// Use Playwright's auto-waiting
await expect(page.getByText('Loaded')).toBeVisible(); // Auto-waits up to timeout
```

### Reuse Browser Contexts

For faster test execution, reuse browser contexts when possible (already configured in `playwright.config.js`).

---

## Resources

- **Playwright Documentation**: https://playwright.dev
- **Best Practices**: https://playwright.dev/docs/best-practices
- **Locators Guide**: https://playwright.dev/docs/locators
- **API Reference**: https://playwright.dev/docs/api/class-playwright

---

## Summary

Era Manifesto's E2E test suite provides comprehensive coverage of critical user flows. By following this guide and best practices, you can:

- Run tests locally and in CI
- Write new test cases
- Debug failures
- Maintain test reliability

**Key Takeaways**:
- Tests are independent and idempotent
- Use helpers and fixtures for consistency
- Wait for async operations
- Test realistic scenarios
- Run tests before committing

For questions or issues, consult this guide or the Playwright documentation.

---

*Last updated: 2024*
