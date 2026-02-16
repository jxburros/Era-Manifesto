# E2E Testing Quick Reference

Quick commands and patterns for Era Manifesto E2E testing.

## Quick Commands

```bash
# Run all tests
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# Specific file
npm run test:e2e tests/song-release-flow.spec.js

# Show report
npm run test:e2e:report

# Headed mode (see browser)
npm run test:e2e -- --headed

# Grep pattern
npm run test:e2e -- --grep "backup"
```

## Common Patterns

### Test Setup
```javascript
test.describe('Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.reload();
    await waitForApp(page);
  });
});
```

### Navigation
```javascript
await navigateToRoute(page, '/songs');
await clickSidebarItem(page, 'Songs');
```

### Form Filling
```javascript
await page.fill('input[name="title"]', 'My Song');
await page.selectOption('select[name="type"]', 'Single');
await page.check('input[type="checkbox"]');
```

### Clicking & Waiting
```javascript
await clickAndWait(page, 'button:has-text("Save")');
await waitForDataSave(page);
```

### Assertions
```javascript
await expect(page.getByText('My Song')).toBeVisible();
await expect(page.locator('input[name="title"]')).toHaveValue('My Song');
```

### Modals
```javascript
await waitForModal(page);
await closeModal(page);
```

### Checking Visibility
```javascript
const visible = await isVisible(page, 'text=My Element');
if (visible) {
  // do something
}
```

## Test Data Generators

```javascript
import { 
  createTestSong, 
  createTestRelease, 
  createTestTask,
  createTestTeamMember,
  getRelativeDate 
} from './fixtures.e2e.js';

const song = createTestSong({ title: 'Test Song', releaseDate: getRelativeDate(30) });
const release = createTestRelease({ name: 'Test Release' });
const task = createTestTask({ taskName: 'Mix', estimatedCost: 500 });
const member = createTestTeamMember({ name: 'Producer', isMusician: true });
```

## Debugging

```javascript
// Pause test
await page.pause();

// Take screenshot
await page.screenshot({ path: 'debug.png' });

// Console logs
page.on('console', msg => console.log('BROWSER:', msg.text()));

// Wait longer
await page.waitForTimeout(2000);
```

## Locator Strategies

```javascript
// By text
page.getByText('Save')
page.locator('text=Save')
'button:has-text("Save")'

// By role
page.getByRole('button', { name: 'Save' })

// By name attribute
'input[name="title"]'

// By placeholder
'input[placeholder*="title" i]'

// By test ID
'[data-testid="save-button"]'

// Flexible button finder
page.locator('button').filter({ hasText: /save|create/i }).first()
```

## Cost Precedence

Remember: **Paid > Quoted > Estimated**

```javascript
// Only estimated
estimatedCost: 100 // Shows 100

// Quoted overrides estimated
estimatedCost: 100, quotedCost: 150 // Shows 150

// Paid overrides all
estimatedCost: 100, quotedCost: 150, paidCost: 175 // Shows 175
```

## Common Selectors

| Element | Selector |
|---------|----------|
| New/Add Button | `button:has-text("New"), button:has-text("Add")` |
| Save Button | `button:has-text("Save"), button:has-text("Create")` |
| Edit Button | `button:has-text("Edit")` |
| Delete Button | `button:has-text("Delete"), button:has-text("Remove")` |
| Title Input | `input[name="title"], input[placeholder*="title" i]` |
| Date Input | `input[type="date"]` |
| Status Select | `select[name="status"]` |
| Notes Field | `textarea[name="notes"]` |
| Cost Inputs | `input[name="estimatedCost"]`, `input[name="quotedCost"]`, `input[name="paidCost"]` |

## Routes

| Page | Route |
|------|-------|
| Home | `/` |
| Songs | `/songs` |
| Releases | `/releases` |
| Tasks | `/tasks` |
| Global Tasks | `/global-tasks` |
| Timeline | `/timeline` |
| Calendar | `/calendar` |
| Team | `/team` |
| Settings | `/settings` |
| Financials | `/financials` |

## Test Suites

1. **song-release-flow.spec.js** - Song → Version → Release creation
2. **task-override.spec.js** - Auto-tasks and manual overrides
3. **cost-precedence.spec.js** - Three-tier cost system
4. **team-assignment.spec.js** - Team member management
5. **backup-restore.spec.js** - Data backup and restoration

## CI Environment

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`
- Manual workflow dispatch

View results: **Actions** tab → **E2E Tests** workflow

---

*For full documentation, see [docs/E2E_TESTING.md](./E2E_TESTING.md)*
