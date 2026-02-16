# Era Manifesto Test Suite

This directory contains all tests for the Era Manifesto application.

## Test Types

### Unit Tests
- **File**: `taskLogic.test.js`
- **Purpose**: Test core business logic functions
- **Runner**: Node.js native test runner
- **Command**: `npm test`

### E2E Tests
- **Files**: `*.spec.js`
- **Purpose**: Test complete user workflows
- **Runner**: Playwright
- **Command**: `npm run test:e2e`

## E2E Test Files

### Core Test Suites

1. **song-release-flow.spec.js**
   - Create songs with versions
   - Create releases
   - Attach songs to releases
   - Verify timeline integration

2. **task-override.spec.js**
   - Auto-generated task creation
   - Manual task overrides
   - Global task management
   - Status progression

3. **cost-precedence.spec.js**
   - Three-tier cost system (Estimated → Quoted → Paid)
   - Cost precedence rules
   - Total cost calculation
   - Cost updates and persistence

4. **team-assignment.spec.js**
   - Team member creation
   - Musician instrument tracking
   - Task assignments
   - Cost allocation per member

5. **backup-restore.spec.js**
   - Data backup creation
   - JSON export
   - Data restoration
   - Backup management

### Test Helpers

- **helpers.e2e.js** - Shared utilities for navigation, interactions, and waits
- **fixtures.e2e.js** - Test data generators for consistent scenarios

## Quick Start

### Install Dependencies

```bash
# Install all dependencies including Playwright
npm install

# Install Playwright browsers
npx playwright install
```

### Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e tests/song-release-flow.spec.js

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Run unit tests
npm test
```

### View Results

```bash
# Open HTML test report
npm run test:e2e:report
```

## Test Structure

```
tests/
├── taskLogic.test.js          # Unit tests
├── helpers.e2e.js             # E2E test utilities
├── fixtures.e2e.js            # Test data generators
├── song-release-flow.spec.js  # Song → Release workflow
├── task-override.spec.js      # Task management
├── cost-precedence.spec.js    # Cost system tests
├── team-assignment.spec.js    # Team member tests
└── backup-restore.spec.js     # Data backup tests
```

## Writing Tests

### Basic Pattern

```javascript
import { test, expect } from '@playwright/test';
import { waitForApp, clearStorage } from './helpers.e2e.js';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.reload();
    await waitForApp(page);
  });

  test('should do something', async ({ page }) => {
    // Your test code
  });
});
```

### Using Helpers

```javascript
import { 
  navigateToRoute, 
  clickAndWait, 
  fillInput, 
  waitForDataSave 
} from './helpers.e2e.js';

// Navigate to a page
await navigateToRoute(page, '/songs');

// Fill form and submit
await fillInput(page, 'input[name="title"]', 'My Song');
await clickAndWait(page, 'button:has-text("Save")');
await waitForDataSave(page);
```

### Using Fixtures

```javascript
import { createTestSong, getRelativeDate } from './fixtures.e2e.js';

const song = createTestSong({
  title: 'Test Song',
  releaseDate: getRelativeDate(30) // 30 days from now
});
```

## Documentation

For detailed documentation:
- **Full Guide**: [../docs/E2E_TESTING.md](../docs/E2E_TESTING.md)
- **Quick Reference**: [../docs/E2E_TESTING_QUICK_REF.md](../docs/E2E_TESTING_QUICK_REF.md)
- **Completion Summary**: [../PHASE7_COMPLETE.md](../PHASE7_COMPLETE.md)

## CI/CD

Tests run automatically in GitHub Actions on:
- Push to `main` or `develop`
- Pull requests
- Manual workflow dispatch

View results in the **Actions** tab.

## Test Coverage

- **36 E2E test cases** covering critical user flows
- **Unit tests** for core business logic
- All PRE_QA_CHECKLIST scenarios automated

## Troubleshooting

### Tests Timeout
Increase timeout in test:
```javascript
test.setTimeout(60000); // 60 seconds
```

### Element Not Found
Check if element exists first:
```javascript
const visible = await isVisible(page, 'text=My Element');
if (visible) {
  await page.click('text=My Element');
}
```

### Storage Not Clearing
Ensure beforeEach hook runs:
```javascript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await clearStorage(page);
  await page.reload();
  await page.waitForTimeout(1000);
  await waitForApp(page);
});
```

## Performance

- Tests run in **parallel** by default
- Expected total runtime: **2-4 minutes**
- CI runs with 1 worker (serial) for stability
- Local development uses all available workers

## Best Practices

1. **Test Independence** - Each test starts with clean state
2. **Explicit Waits** - Always wait for async operations
3. **Semantic Selectors** - Use visible text, not brittle classes
4. **Idempotency** - Tests can run multiple times
5. **Error Handling** - Handle optional UI elements gracefully
6. **Documentation** - Comment complex test logic

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Era Manifesto E2E Testing Guide](../docs/E2E_TESTING.md)
- [Test Writing Best Practices](https://playwright.dev/docs/best-practices)

---

**Questions?** See the full documentation in `docs/E2E_TESTING.md`
