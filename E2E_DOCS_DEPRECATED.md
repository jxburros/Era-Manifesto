# DEPRECATION NOTICE

## E2E Test Documentation - Archived

This directory contains documentation for the **previous E2E test infrastructure** that was replaced with unit tests on **2026-02-16**.

### What Changed

The complex Playwright E2E tests were replaced with simple, fast unit tests to improve:
- **Speed**: 90% faster (3-5 min → <30 sec)
- **Reliability**: No more flaky tests
- **Simplicity**: Pure JavaScript, no browser needed
- **Maintainability**: Tests rarely break

### Current Testing Approach

For current testing information, see:
- **[tests/README.md](../tests/README.md)** - Unit testing guide
- **[E2E_TO_UNIT_MIGRATION.md](../E2E_TO_UNIT_MIGRATION.md)** - Migration details
- **[TEST_REPLACEMENT_SUMMARY.md](../TEST_REPLACEMENT_SUMMARY.md)** - Complete summary

### Archived E2E Tests

The actual E2E test files are archived at:
- `tests/archived/*.spec.js` - Test files
- `tests/archived/config/playwright.config.js` - Configuration

### Why These Docs Still Exist

These documents are kept for:
1. **Historical reference** - Understanding what was tested before
2. **Context** - Why the migration happened
3. **Learning** - Documentation of the E2E test approach

### Running the Old E2E Tests

If you need to run the archived E2E tests (not recommended):
1. Reinstall Playwright: `npm install -D @playwright/test`
2. Install browsers: `npx playwright install`
3. Move config back to root
4. Add E2E scripts to package.json
5. Run: `npx playwright test tests/archived/`

**Note:** This is not supported and may not work with current codebase.

---

**Migration Date:** 2026-02-16  
**Status:** Archived  
**Current Tests:** Unit tests in `tests/*.test.js`
