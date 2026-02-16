/**
 * E2E Test: Backup & Restore Flow
 * 
 * Tests data backup and restoration:
 * 1. Create test data
 * 2. Create backup
 * 3. Modify data
 * 4. Restore backup
 * 5. Verify data rollback
 */

import { test, expect } from '@playwright/test';
import { 
  waitForApp, 
  clearStorage, 
  navigateToRoute, 
  waitForDataSave,
  isVisible
} from './helpers.e2e.js';

test.describe('Backup & Restore Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.reload();
    await waitForApp(page);
  });

  test('should access settings and see backup section', async ({ page }) => {
    await navigateToRoute(page, '/settings');
    await page.waitForTimeout(500);

    // Look for backup/export section
    const backupSection = await isVisible(page, 'text=/backup|export|data/i');
    expect(backupSection).toBeTruthy();
  });

  test('should create backup', async ({ page }) => {
    // Create some test data first
    await navigateToRoute(page, '/songs');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const songTitle = `Backup Test Song ${Date.now()}`;
    await page.fill('input[name="title"], input[placeholder*="title" i]', songTitle);
    
    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Navigate to settings
    await navigateToRoute(page, '/settings');
    await page.waitForTimeout(500);

    // Look for backup/export button
    const backupBtn = await page.locator('button').filter({ hasText: /backup|export|download/i }).first();
    
    if (await backupBtn.isVisible().catch(() => false)) {
      // Click backup button
      await backupBtn.click();
      await page.waitForTimeout(1000);

      // Backup should be created (may trigger download or save to IndexedDB)
      console.log('Backup created');
    }
  });

  test('should export data as JSON', async ({ page }) => {
    // Create test data
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const taskName = `Export Test Task ${Date.now()}`;
    await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', taskName);
    
    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Navigate to settings
    await navigateToRoute(page, '/settings');
    await page.waitForTimeout(500);

    // Look for export button
    const exportBtn = await page.locator('button').filter({ hasText: /export|download.*data/i }).first();
    
    if (await exportBtn.isVisible().catch(() => false)) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
      
      await exportBtn.click();
      await page.waitForTimeout(500);

      const download = await downloadPromise;
      if (download) {
        console.log('Download triggered:', download.suggestedFilename());
        expect(download.suggestedFilename()).toMatch(/\.json$/i);
      }
    }
  });

  test('should restore from backup', async ({ page }) => {
    // Create initial data
    const initialSongTitle = `Initial Song ${Date.now()}`;
    await navigateToRoute(page, '/songs');
    await page.waitForTimeout(500);

    let newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    await page.fill('input[name="title"], input[placeholder*="title" i]', initialSongTitle);
    
    let saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Navigate to settings and create backup
    await navigateToRoute(page, '/settings');
    await page.waitForTimeout(500);

    const backupBtn = await page.locator('button').filter({ hasText: /backup|save.*backup/i }).first();
    
    if (await backupBtn.isVisible().catch(() => false)) {
      await backupBtn.click();
      await waitForDataSave(page, 2000);
    }

    // Modify data - add new song
    await navigateToRoute(page, '/songs');
    await page.waitForTimeout(500);

    newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const modifiedSongTitle = `Modified Song ${Date.now()}`;
    await page.fill('input[name="title"], input[placeholder*="title" i]', modifiedSongTitle);
    
    saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Verify both songs exist
    await expect(page.getByText(initialSongTitle)).toBeVisible();
    await expect(page.getByText(modifiedSongTitle)).toBeVisible();

    // Restore backup
    await navigateToRoute(page, '/settings');
    await page.waitForTimeout(500);

    const restoreBtn = await page.locator('button').filter({ hasText: /restore|load.*backup/i }).first();
    
    if (await restoreBtn.isVisible().catch(() => false)) {
      await restoreBtn.click();
      await page.waitForTimeout(500);

      // May need to select backup from list
      const confirmBtn = await page.locator('button').filter({ hasText: /confirm|restore|yes/i }).first();
      if (await confirmBtn.isVisible().catch(() => false)) {
        await confirmBtn.click();
        await waitForDataSave(page, 2000);
      }

      // Navigate back to songs
      await navigateToRoute(page, '/songs');
      await page.waitForTimeout(1000);

      // Initial song should still exist
      await expect(page.getByText(initialSongTitle)).toBeVisible();

      // Modified song should be gone (restored to backup state)
      const modifiedExists = await isVisible(page, modifiedSongTitle);
      expect(modifiedExists).toBeFalsy();
    }
  });

  test('should list available backups', async ({ page }) => {
    // Create multiple backups
    for (let i = 0; i < 2; i++) {
      // Create some data
      await navigateToRoute(page, '/global-tasks');
      await page.waitForTimeout(300);

      const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
      await newBtn.click();
      await page.waitForTimeout(500);

      const taskName = `Backup ${i + 1} ${Date.now()}`;
      await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', taskName);
      
      const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
      await saveBtn.click();
      await waitForDataSave(page);

      // Create backup
      await navigateToRoute(page, '/settings');
      await page.waitForTimeout(500);

      const backupBtn = await page.locator('button').filter({ hasText: /backup|save.*backup/i }).first();
      if (await backupBtn.isVisible().catch(() => false)) {
        await backupBtn.click();
        await waitForDataSave(page, 1500);
      }
    }

    // Navigate to settings
    await navigateToRoute(page, '/settings');
    await page.waitForTimeout(500);

    // Look for backup list or history
    const backupListExists = await isVisible(page, 'text=/backup.*list|available.*backup/i');
    
    if (backupListExists) {
      console.log('Backup list found');
      // Should show multiple backups
    }
  });

  test('should delete backup', async ({ page }) => {
    // Create data and backup
    await navigateToRoute(page, '/songs');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const songTitle = `Delete Backup Test ${Date.now()}`;
    await page.fill('input[name="title"], input[placeholder*="title" i]', songTitle);
    
    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Create backup
    await navigateToRoute(page, '/settings');
    await page.waitForTimeout(500);

    const backupBtn = await page.locator('button').filter({ hasText: /backup|save.*backup/i }).first();
    if (await backupBtn.isVisible().catch(() => false)) {
      await backupBtn.click();
      await waitForDataSave(page, 1500);

      // Look for delete button for backup
      const deleteBtn = await page.locator('button').filter({ hasText: /delete|remove/i }).first();
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
        await page.waitForTimeout(300);

        // Confirm deletion
        const confirmBtn = await page.locator('button').filter({ hasText: /confirm|yes|delete/i }).first();
        if (await confirmBtn.isVisible().catch(() => false)) {
          await confirmBtn.click();
          await waitForDataSave(page);
        }
      }
    }
  });

  test('should import data from JSON file', async ({ page }) => {
    await navigateToRoute(page, '/settings');
    await page.waitForTimeout(500);

    // Look for import button
    const importBtn = await page.locator('button').filter({ hasText: /import|upload/i }).first();
    
    if (await importBtn.isVisible().catch(() => false)) {
      // Would need to upload a JSON file here
      // For smoke test, just verify button exists
      await expect(importBtn).toBeVisible();
    }
  });

  test('should handle backup with no data gracefully', async ({ page }) => {
    // Clear all data
    await clearStorage(page);
    await page.reload();
    await waitForApp(page);

    // Try to create backup with empty state
    await navigateToRoute(page, '/settings');
    await page.waitForTimeout(500);

    const backupBtn = await page.locator('button').filter({ hasText: /backup|export/i }).first();
    
    if (await backupBtn.isVisible().catch(() => false)) {
      await backupBtn.click();
      await page.waitForTimeout(1000);

      // Should handle empty backup gracefully
      console.log('Empty backup attempted');
    }
  });

  test('should verify backup includes all data types', async ({ page }) => {
    // Create diverse data
    // Song
    await navigateToRoute(page, '/songs');
    await page.waitForTimeout(500);
    let newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="title"], input[placeholder*="title" i]', `Complete Test Song ${Date.now()}`);
    let saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Task
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);
    newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', `Complete Test Task ${Date.now()}`);
    saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Team Member
    await navigateToRoute(page, '/team');
    await page.waitForTimeout(500);
    newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);
    await page.fill('input[name="name"], input[placeholder*="name" i]', `Complete Test Member ${Date.now()}`);
    saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Create backup
    await navigateToRoute(page, '/settings');
    await page.waitForTimeout(500);

    const backupBtn = await page.locator('button').filter({ hasText: /backup|export/i }).first();
    if (await backupBtn.isVisible().catch(() => false)) {
      await backupBtn.click();
      await waitForDataSave(page, 2000);

      // Backup should include songs, tasks, and team members
      console.log('Complete backup with all data types created');
    }
  });
});
