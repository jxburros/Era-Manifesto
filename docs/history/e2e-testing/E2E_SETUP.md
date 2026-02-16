# E2E Test Setup Guide

> **⚠️ DEPRECATED:** This documentation is for the **archived E2E test infrastructure**. 
> 
> E2E tests were replaced with unit tests on **2026-02-16**. See [E2E_DOCS_DEPRECATED.md](E2E_DOCS_DEPRECATED.md) for details.
>
> **Current testing:** See [tests/README.md](tests/README.md) for unit test documentation.

---

Quick setup guide for Era Manifesto E2E testing with Playwright.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Era Manifesto repository cloned

## Installation Steps

### Step 1: Install Dependencies

```bash
# From project root
npm install
```

This installs all dependencies including `@playwright/test`.

### Step 2: Install Playwright Browsers

```bash
# Install Chromium (recommended for speed)
npx playwright install chromium

# Or install all browsers (Chromium, Firefox, WebKit)
npx playwright install
```

**Note**: First-time installation downloads ~300MB of browser binaries.

### Step 3: Verify Installation

```bash
# Check Playwright version
npx playwright --version

# Should output: Version 1.41.x or higher
```

## Running Your First Test

### Run All Tests

```bash
npm run test:e2e
```

Expected output:
```
Running 36 tests using 4 workers
  ✓ tests/song-release-flow.spec.js (6 passed)
  ✓ tests/task-override.spec.js (5 passed)
  ✓ tests/cost-precedence.spec.js (7 passed)
  ✓ tests/team-assignment.spec.js (8 passed)
  ✓ tests/backup-restore.spec.js (10 passed)

36 passed (2-4 minutes)
```

### Run in UI Mode (Recommended for First Time)

```bash
npm run test:e2e:ui
```

This opens an interactive UI where you can:
- See all tests
- Run individual tests
- Watch tests execute
- Inspect elements
- View timeline

### Run Specific Test

```bash
npm run test:e2e tests/song-release-flow.spec.js
```

## View Test Report

After running tests:

```bash
npm run test:e2e:report
```

Opens HTML report in browser showing:
- Test results
- Screenshots (on failure)
- Videos (on failure)
- Execution traces
- Performance metrics

## Common Issues

### Issue: "Playwright not installed"

**Solution**:
```bash
npx playwright install
```

### Issue: "Dev server not starting"

**Solution**:
1. Check if port 5173 is available
2. Try starting dev server manually:
   ```bash
   npm run dev
   ```
3. In another terminal:
   ```bash
   npm run test:e2e
   ```

### Issue: "Tests timeout"

**Solution**: Increase timeout in `playwright.config.js`:
```javascript
timeout: 60 * 1000, // 60 seconds instead of 30
```

### Issue: "Browser not found"

**Solution**: Install specific browser:
```bash
npx playwright install chromium
```

## Project Structure

```
Era-Manifesto/
├── playwright.config.js          # Playwright configuration
├── tests/
│   ├── helpers.e2e.js           # Test utilities
│   ├── fixtures.e2e.js          # Test data generators
│   ├── *.spec.js                # Test suites
│   └── README.md                # Tests overview
├── docs/
│   ├── E2E_TESTING.md           # Full documentation
│   └── E2E_TESTING_QUICK_REF.md # Quick reference
└── .github/
    └── workflows/
        └── e2e-tests.yml        # CI configuration
```

## Test Configuration

### Configuration File

`playwright.config.js` contains:
- Browser selection (Chromium default)
- Dev server auto-start
- Timeout settings
- Reporter configuration
- Retry logic for CI

### Customizing Configuration

Edit `playwright.config.js` to:
- Change timeout values
- Add more browsers
- Adjust viewport size
- Configure screenshots/videos
- Set environment variables

## Running Tests in Different Modes

### Headed Mode (See Browser)

```bash
npm run test:e2e -- --headed
```

### Debug Mode (Step Through)

```bash
npm run test:e2e:debug
```

### Specific Browser

```bash
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

### Grep Pattern (Filter Tests)

```bash
# Run only backup tests
npm run test:e2e -- --grep "backup"

# Run only song-related tests
npm run test:e2e -- --grep "song"

# Exclude certain tests
npm run test:e2e -- --grep-invert "slow"
```

### Update Snapshots

```bash
npm run test:e2e -- --update-snapshots
```

## CI/CD Setup

Tests run automatically in GitHub Actions on:
- Push to `main` or `develop`
- Pull requests
- Manual workflow dispatch

### Local CI Simulation

```bash
# Run with CI environment variables
CI=true npm run test:e2e
```

This runs tests with:
- Serial execution (1 worker)
- Automatic retries (2 times)
- Headless mode

## Development Workflow

### Before Committing

```bash
# 1. Run linting
npm run lint

# 2. Run unit tests
npm test

# 3. Run E2E tests
npm run test:e2e

# 4. Build check
npm run build
```

### Writing New Tests

1. Create test file in `tests/`
2. Import helpers and fixtures
3. Write test cases
4. Run tests locally
5. Commit with descriptive message

Example:
```bash
# Create new test
touch tests/my-feature.spec.js

# Run new test
npm run test:e2e tests/my-feature.spec.js

# Commit
git add tests/my-feature.spec.js
git commit -m "Add E2E tests for my-feature"
```

## Helpful Commands

```bash
# List all tests
npm run test:e2e -- --list

# Show test configuration
npx playwright show-config

# Show installed browsers
npx playwright list-files

# Clear test results
rm -rf test-results/ playwright-report/

# Generate code (record interactions)
npx playwright codegen http://localhost:5173
```

## Environment Variables

Set these for custom behavior:

```bash
# Use specific browser
BROWSER=firefox npm run test:e2e

# Set custom base URL
BASE_URL=http://localhost:3000 npm run test:e2e

# Enable debug mode
DEBUG=pw:api npm run test:e2e
```

## Resources

### Documentation
- [Full E2E Testing Guide](./docs/E2E_TESTING.md)
- [Quick Reference](./docs/E2E_TESTING_QUICK_REF.md)
- [Phase 7 Summary](./PHASE7_COMPLETE.md)

### External Resources
- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Getting Help
- Check documentation first
- Review test examples in `tests/` directory
- Check GitHub Issues
- Review Playwright documentation

## Success Checklist

- ✅ Dependencies installed (`npm install`)
- ✅ Playwright browsers installed (`npx playwright install`)
- ✅ Tests run successfully (`npm run test:e2e`)
- ✅ Report opens (`npm run test:e2e:report`)
- ✅ UI mode works (`npm run test:e2e:ui`)
- ✅ Debug mode works (`npm run test:e2e:debug`)

## Next Steps

1. **Run tests**: `npm run test:e2e`
2. **Explore UI mode**: `npm run test:e2e:ui`
3. **Read documentation**: `docs/E2E_TESTING.md`
4. **Write new tests**: Use examples as templates
5. **Integrate into workflow**: Run tests before commits

---

**Ready to test!** Run `npm run test:e2e` to execute the full test suite.

For detailed information, see [docs/E2E_TESTING.md](./docs/E2E_TESTING.md)
