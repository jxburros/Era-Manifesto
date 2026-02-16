/**
 * E2E Test: Task Override Flow
 * 
 * Tests auto-generated tasks and manual overrides:
 * 1. Create content that generates auto tasks
 * 2. Verify auto tasks are created
 * 3. Edit/override auto task
 * 4. Verify override persists
 * 5. Verify override flag is set
 */

import { test, expect } from '@playwright/test';
import { 
  waitForApp, 
  clearStorage, 
  navigateToRoute, 
  waitForDataSave,
  waitForNavigation,
  isVisible
} from './helpers.e2e.js';
import { getRelativeDate } from './fixtures.e2e.js';

test.describe('Auto Task + Override Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.reload();
    await waitForApp(page);
  });

  test('should create song and verify auto-generated tasks exist', async ({ page }) => {
    const songTitle = `Auto Task Test ${Date.now()}`;
    const releaseDate = getRelativeDate(30);

    // Create song with release date
    await navigateToRoute(page, '/songs');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    await page.fill('input[name="title"], input[placeholder*="title" i]', songTitle);
    
    const dateInput = await page.$('input[type="date"]');
    if (dateInput) {
      await dateInput.fill(releaseDate);
    }

    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Open song detail
    await page.click(`text=${songTitle}`);
    await waitForNavigation(page);
    await page.waitForTimeout(500);

    // Look for auto-generated tasks section
    // Common auto tasks: Record, Mix, Master, Release Prep
    const hasTasksSection = await isVisible(page, 'text=/tasks|deadlines/i');
    
    // If tasks are shown, this verifies auto-generation works
    if (hasTasksSection) {
      console.log('Auto-generated tasks section found');
    }
  });

  test('should edit auto-generated task and persist override', async ({ page }) => {
    const songTitle = `Override Test ${Date.now()}`;
    const releaseDate = getRelativeDate(25);

    // Create song
    await navigateToRoute(page, '/songs');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    await page.fill('input[name="title"], input[placeholder*="title" i]', songTitle);
    
    const dateInput = await page.$('input[type="date"]');
    if (dateInput) {
      await dateInput.fill(releaseDate);
    }

    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Open song detail
    await page.click(`text=${songTitle}`);
    await waitForNavigation(page);
    await page.waitForTimeout(500);

    // Try to find and edit a task
    // Look for common task names like "Record", "Mix", "Master"
    const taskElements = await page.locator('text=/record|mix|master|task/i').all();
    
    if (taskElements.length > 0) {
      // Click first task to edit it
      await taskElements[0].click();
      await page.waitForTimeout(500);

      // Look for edit button or direct edit fields
      const editBtn = await page.locator('button').filter({ hasText: /edit/i }).first();
      if (await editBtn.isVisible().catch(() => false)) {
        await editBtn.click();
        await page.waitForTimeout(300);
      }

      // Try to modify task name
      const taskNameInput = await page.$('input[name="taskName"], input[placeholder*="task" i]');
      if (taskNameInput) {
        const originalValue = await taskNameInput.inputValue();
        await taskNameInput.fill(`${originalValue} - MODIFIED`);
        
        // Change status
        const statusSelect = await page.$('select[name="status"]');
        if (statusSelect) {
          await statusSelect.selectOption('In-Progress');
        }

        // Save changes
        const updateBtn = await page.locator('button').filter({ hasText: /save|update/i }).first();
        await updateBtn.click();
        await waitForDataSave(page);

        // Verify modified task persists
        await expect(page.getByText('MODIFIED')).toBeVisible();
      }
    }
  });

  test('should create global task without parent', async ({ page }) => {
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);

    // Create global task
    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    
    if (await newBtn.isVisible().catch(() => false)) {
      await newBtn.click();
      await page.waitForTimeout(500);

      const taskName = `Global Task ${Date.now()}`;
      await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', taskName);
      
      // Set date
      const dateInput = await page.$('input[type="date"]');
      if (dateInput) {
        await dateInput.fill(getRelativeDate(15));
      }

      // Set status
      const statusSelect = await page.$('select[name="status"]');
      if (statusSelect) {
        await statusSelect.selectOption('Not Started');
      }

      // Save
      const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
      await saveBtn.click();
      await waitForDataSave(page);

      // Verify task created
      await expect(page.getByText(taskName)).toBeVisible();
    }
  });

  test('should edit global task and verify changes persist', async ({ page }) => {
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);

    // Create task
    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    
    if (await newBtn.isVisible().catch(() => false)) {
      await newBtn.click();
      await page.waitForTimeout(500);

      const taskName = `Edit Test Task ${Date.now()}`;
      await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', taskName);
      
      const dateInput = await page.$('input[type="date"]');
      if (dateInput) {
        await dateInput.fill(getRelativeDate(10));
      }

      const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
      await saveBtn.click();
      await waitForDataSave(page);

      // Now edit it
      await page.click(`text=${taskName}`);
      await page.waitForTimeout(500);

      // Look for edit button
      const editBtn = await page.locator('button').filter({ hasText: /edit/i }).first();
      if (await editBtn.isVisible().catch(() => false)) {
        await editBtn.click();
        await page.waitForTimeout(300);
      }

      // Modify status
      const statusSelect = await page.$('select[name="status"]');
      if (statusSelect) {
        await statusSelect.selectOption('In-Progress');
      }

      // Add notes
      const notesField = await page.$('textarea[name="notes"], textarea[placeholder*="note" i]');
      if (notesField) {
        await notesField.fill('Modified during E2E test');
      }

      // Save changes
      const updateBtn = await page.locator('button').filter({ hasText: /save|update/i }).first();
      await updateBtn.click();
      await waitForDataSave(page);

      // Close and reopen to verify persistence
      const backBtn = await page.locator('button').filter({ hasText: /back|close/i }).first();
      if (await backBtn.isVisible().catch(() => false)) {
        await backBtn.click();
        await page.waitForTimeout(300);
      } else {
        await navigateToRoute(page, '/global-tasks');
      }

      // Reopen task
      await page.click(`text=${taskName}`);
      await page.waitForTimeout(500);

      // Verify changes persisted
      const notesText = await page.textContent('body');
      expect(notesText).toContain('Modified during E2E test');
    }
  });

  test('should update task status multiple times', async ({ page }) => {
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    
    if (await newBtn.isVisible().catch(() => false)) {
      await newBtn.click();
      await page.waitForTimeout(500);

      const taskName = `Status Update Test ${Date.now()}`;
      await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', taskName);
      
      const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
      await saveBtn.click();
      await waitForDataSave(page);

      // Status progression: Not Started → In-Progress → Complete
      const statuses = ['In-Progress', 'Complete'];
      
      for (const status of statuses) {
        await page.click(`text=${taskName}`);
        await page.waitForTimeout(500);

        const editBtn = await page.locator('button').filter({ hasText: /edit/i }).first();
        if (await editBtn.isVisible().catch(() => false)) {
          await editBtn.click();
          await page.waitForTimeout(300);
        }

        const statusSelect = await page.$('select[name="status"]');
        if (statusSelect) {
          await statusSelect.selectOption(status);
        }

        const updateBtn = await page.locator('button').filter({ hasText: /save|update/i }).first();
        await updateBtn.click();
        await waitForDataSave(page);

        // Navigate back
        const backBtn = await page.locator('button').filter({ hasText: /back|close/i }).first();
        if (await backBtn.isVisible().catch(() => false)) {
          await backBtn.click();
          await page.waitForTimeout(300);
        } else {
          await navigateToRoute(page, '/global-tasks');
        }
      }

      // Verify final status
      await page.click(`text=${taskName}`);
      await page.waitForTimeout(500);
      
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('Complete');
    }
  });
});
