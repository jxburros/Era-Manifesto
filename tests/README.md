# Era Manifesto Test Suite

This directory contains unit tests for the Era Manifesto application.

## Test Philosophy

We use **simple, fast unit tests** to ensure code quality and catch bugs early. The testing strategy focuses on:

- **Speed**: Tests run in <5 seconds
- **Reliability**: No flaky tests, no timing issues  
- **Simplicity**: Pure JavaScript tests using Node's built-in test runner
- **Coverage**: Focus on business logic and utility functions

## Test Files

### Unit Tests

- **taskLogic.test.js** - Tests for task business logic (status points, progress calculation, date resolution, cost precedence)
- **utils.test.js** - Additional tests for core domain logic

### Archived E2E Tests

The `archived/` directory contains previous Playwright E2E tests that were removed due to:
- Slow execution (3-5 minutes)
- Frequent timing issues and flakiness
- Complex setup requirements (browser automation, dev server)
- High CI cost

These are kept for reference but are no longer run in CI.

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Specific Test File
```bash
node --test tests/taskLogic.test.js
```

## Writing Tests

Tests use Node.js's built-in test runner and assertion library:

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { myFunction } from '../src/myModule.js';

test('myFunction does what it should', () => {
  const result = myFunction(input);
  assert.equal(result, expectedOutput);
});
```

### Guidelines

1. **Test pure functions** - Focus on business logic without side effects
2. **Use descriptive test names** - Clearly describe what is being tested
3. **Test edge cases** - Empty inputs, null values, boundary conditions
4. **Keep tests simple** - One assertion per test when possible
5. **No external dependencies** - Tests should not require network, database, or browser

## CI/CD

Tests run automatically in GitHub Actions on:
- Push to `main` or `develop`
- Pull requests
- Manual workflow dispatch

The CI workflow includes:
- **Unit Tests** - Fast tests (<30 seconds)
- **Lint Check** - ESLint validation
- **Build Check** - Verifies the app builds successfully

## Test Coverage

Current test coverage focuses on:
- ✅ Task status and progress calculations
- ✅ Date resolution and precedence logic
- ✅ Cost precedence and effective cost calculation
- ✅ Edge cases and error handling

## Performance

- **Local**: <5 seconds total
- **CI**: <30 seconds total (including setup)
- **No browser required**: Tests run in Node.js
- **No dev server required**: Tests are isolated unit tests

## Troubleshooting

### Tests failing locally but passing in CI
- Ensure you're using Node.js 18 or later
- Run `npm ci` to ensure dependencies match

### Import errors
- Make sure the module path is correct relative to the test file
- Check that the function is exported from the source file

### Tests running slowly
- Unit tests should be nearly instant (<100ms each)
- If tests are slow, they may have external dependencies that should be mocked

---

**Questions?** See the main [README](../README.md) for more information about the project.
