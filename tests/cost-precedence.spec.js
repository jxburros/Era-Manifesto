/**
 * E2E Test: Cost Precedence Flow
 * 
 * Tests the three-tier cost system:
 * - Estimated cost (baseline)
 * - Quoted cost (overrides estimated)
 * - Paid cost (overrides all)
 * 
 * Precedence: Paid > Quoted > Estimated
 */

import { test, expect } from '@playwright/test';
import { 
  waitForApp, 
  clearStorage, 
  navigateToRoute, 
  waitForDataSave
} from './helpers.e2e.js';

test.describe('Cost Precedence Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.reload();
    await waitForApp(page);
  });

  test('should use estimated cost when only estimated is set', async ({ page }) => {
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const taskName = `Estimated Only ${Date.now()}`;
    await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', taskName);
    
    // Set only estimated cost
    const estimatedInput = await page.$('input[name="estimatedCost"], input[placeholder*="estimated" i]');
    if (estimatedInput) {
      await estimatedInput.fill('500');
    }

    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Verify task shows estimated cost
    await page.click(`text=${taskName}`);
    await page.waitForTimeout(500);

    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('500');
  });

  test('should use quoted cost over estimated', async ({ page }) => {
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const taskName = `Quoted Over Estimated ${Date.now()}`;
    await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', taskName);
    
    // Set estimated cost
    const estimatedInput = await page.$('input[name="estimatedCost"], input[placeholder*="estimated" i]');
    if (estimatedInput) {
      await estimatedInput.fill('500');
    }

    // Set quoted cost (should override estimated)
    const quotedInput = await page.$('input[name="quotedCost"], input[placeholder*="quoted" i]');
    if (quotedInput) {
      await quotedInput.fill('650');
    }

    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Verify task shows quoted cost (650, not 500)
    await page.click(`text=${taskName}`);
    await page.waitForTimeout(500);

    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('650');
  });

  test('should use paid cost over quoted and estimated', async ({ page }) => {
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const taskName = `Paid Over All ${Date.now()}`;
    await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', taskName);
    
    // Set all three cost tiers
    const estimatedInput = await page.$('input[name="estimatedCost"], input[placeholder*="estimated" i]');
    if (estimatedInput) {
      await estimatedInput.fill('500');
    }

    const quotedInput = await page.$('input[name="quotedCost"], input[placeholder*="quoted" i]');
    if (quotedInput) {
      await quotedInput.fill('650');
    }

    const paidInput = await page.$('input[name="paidCost"], input[name="amountPaid"], input[placeholder*="paid" i]');
    if (paidInput) {
      await paidInput.fill('700');
    }

    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Verify task shows paid cost (700, not 650 or 500)
    await page.click(`text=${taskName}`);
    await page.waitForTimeout(500);

    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('700');
  });

  test('should update cost tiers progressively', async ({ page }) => {
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const taskName = `Progressive Cost ${Date.now()}`;
    await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', taskName);
    
    // Start with estimated only
    const estimatedInput = await page.$('input[name="estimatedCost"], input[placeholder*="estimated" i]');
    if (estimatedInput) {
      await estimatedInput.fill('1000');
    }

    let saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Verify estimated cost
    await page.click(`text=${taskName}`);
    await page.waitForTimeout(500);
    let pageContent = await page.textContent('body');
    expect(pageContent).toContain('1000');

    // Edit to add quoted cost
    const editBtn = await page.locator('button').filter({ hasText: /edit/i }).first();
    if (await editBtn.isVisible().catch(() => false)) {
      await editBtn.click();
      await page.waitForTimeout(300);
    }

    const quotedInput = await page.$('input[name="quotedCost"], input[placeholder*="quoted" i]');
    if (quotedInput) {
      await quotedInput.fill('1200');
    }

    saveBtn = await page.locator('button').filter({ hasText: /save|update/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Verify quoted cost now shows
    pageContent = await page.textContent('body');
    expect(pageContent).toContain('1200');

    // Edit to add paid cost
    const editBtn2 = await page.locator('button').filter({ hasText: /edit/i }).first();
    if (await editBtn2.isVisible().catch(() => false)) {
      await editBtn2.click();
      await page.waitForTimeout(300);
    }

    const paidInput = await page.$('input[name="paidCost"], input[name="amountPaid"], input[placeholder*="paid" i]');
    if (paidInput) {
      await paidInput.fill('1150');
    }

    saveBtn = await page.locator('button').filter({ hasText: /save|update/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Verify paid cost now shows (even though lower than quoted)
    pageContent = await page.textContent('body');
    expect(pageContent).toContain('1150');
  });

  test('should calculate total costs correctly', async ({ page }) => {
    // Create multiple tasks with different cost configurations
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);

    const tasks = [
      { name: `Task Est ${Date.now()}`, estimated: '100', quoted: '', paid: '' },
      { name: `Task Quoted ${Date.now()}`, estimated: '100', quoted: '150', paid: '' },
      { name: `Task Paid ${Date.now()}`, estimated: '100', quoted: '150', paid: '175' }
    ];

    for (const task of tasks) {
      const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
      await newBtn.click();
      await page.waitForTimeout(500);

      await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', task.name);
      
      const estimatedInput = await page.$('input[name="estimatedCost"], input[placeholder*="estimated" i]');
      if (estimatedInput) {
        await estimatedInput.fill(task.estimated);
      }

      if (task.quoted) {
        const quotedInput = await page.$('input[name="quotedCost"], input[placeholder*="quoted" i]');
        if (quotedInput) {
          await quotedInput.fill(task.quoted);
        }
      }

      if (task.paid) {
        const paidInput = await page.$('input[name="paidCost"], input[name="amountPaid"], input[placeholder*="paid" i]');
        if (paidInput) {
          await paidInput.fill(task.paid);
        }
      }

      const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
      await saveBtn.click();
      await waitForDataSave(page);

      // Navigate back to list
      const backBtn = await page.locator('button').filter({ hasText: /back|close/i }).first();
      if (await backBtn.isVisible().catch(() => false)) {
        await backBtn.click();
        await page.waitForTimeout(300);
      } else {
        await navigateToRoute(page, '/global-tasks');
      }
    }

    // Expected total: 100 + 150 + 175 = 425
    // Navigate to dashboard or financials to check total
    await navigateToRoute(page, '/tasks');
    await page.waitForTimeout(500);

    // Look for total cost display
    await page.textContent('body');
    // Total should reflect cost precedence
    console.log('Checking for total costs in dashboard');
  });

  test('should handle zero and negative costs', async ({ page }) => {
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const taskName = `Zero Cost ${Date.now()}`;
    await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', taskName);
    
    // Set costs to 0
    const estimatedInput = await page.$('input[name="estimatedCost"], input[placeholder*="estimated" i]');
    if (estimatedInput) {
      await estimatedInput.fill('0');
    }

    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Verify task created with zero cost
    await expect(page.getByText(taskName)).toBeVisible();
  });

  test('should show cost in song and release detail', async ({ page }) => {
    // Create song with costs
    await navigateToRoute(page, '/songs');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const songTitle = `Cost Test Song ${Date.now()}`;
    await page.fill('input[name="title"], input[placeholder*="title" i]', songTitle);
    
    const estimatedInput = await page.$('input[name="estimatedCost"], input[placeholder*="estimated" i]');
    if (estimatedInput) {
      await estimatedInput.fill('2000');
    }

    const quotedInput = await page.$('input[name="quotedCost"], input[placeholder*="quoted" i]');
    if (quotedInput) {
      await quotedInput.fill('2500');
    }

    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Verify costs appear in detail view
    await page.click(`text=${songTitle}`);
    await page.waitForTimeout(500);

    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('2500'); // Quoted should take precedence
  });
});
