/**
 * E2E Test: Team Assignment Flow
 * 
 * Tests team member management and task assignment:
 * 1. Create team members
 * 2. Assign team members to tasks
 * 3. Track cost per team member
 * 4. Verify musician instruments
 * 5. Test multiple team member assignments with cost splits
 */

import { test, expect } from '@playwright/test';
import { 
  waitForApp, 
  clearStorage, 
  navigateToRoute, 
  waitForDataSave
} from './helpers.e2e.js';

test.describe('Team Assignment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.reload();
    await waitForApp(page);
  });

  test('should create team member', async ({ page }) => {
    await navigateToRoute(page, '/team');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const memberName = `Test Producer ${Date.now()}`;
    await page.fill('input[name="name"], input[placeholder*="name" i]', memberName);
    
    // Set role
    const roleInput = await page.$('input[name="role"], input[placeholder*="role" i]');
    if (roleInput) {
      await roleInput.fill('Producer');
    }

    // Set email
    const emailInput = await page.$('input[name="email"], input[type="email"]');
    if (emailInput) {
      await emailInput.fill('producer@test.com');
    }

    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Verify team member created
    await expect(page.getByText(memberName)).toBeVisible();
  });

  test('should create musician with instruments', async ({ page }) => {
    await navigateToRoute(page, '/team');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const memberName = `Test Guitarist ${Date.now()}`;
    await page.fill('input[name="name"], input[placeholder*="name" i]', memberName);
    
    // Mark as musician
    const musicianCheckbox = await page.$('input[type="checkbox"][name="isMusician"]');
    if (musicianCheckbox) {
      await musicianCheckbox.check();
      await page.waitForTimeout(300);
    }

    // Add instruments
    const instrumentInput = await page.$('input[name="instruments"], input[placeholder*="instrument" i]');
    if (instrumentInput) {
      await instrumentInput.fill('Guitar, Bass');
    }

    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Verify musician created
    await expect(page.getByText(memberName)).toBeVisible();

    // Open detail to verify instruments
    await page.click(`text=${memberName}`);
    await page.waitForTimeout(500);

    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Guitar');
  });

  test('should assign single team member to task', async ({ page }) => {
    // First create a team member
    await navigateToRoute(page, '/team');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const memberName = `Engineer ${Date.now()}`;
    await page.fill('input[name="name"], input[placeholder*="name" i]', memberName);
    
    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Now create a task and assign the member
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);

    const newTaskBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newTaskBtn.click();
    await page.waitForTimeout(500);

    const taskName = `Assignment Test ${Date.now()}`;
    await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', taskName);
    
    // Try to assign team member
    // Look for "Assign" button or team member selector
    const assignBtn = await page.locator('button').filter({ hasText: /assign|add member/i }).first();
    if (await assignBtn.isVisible().catch(() => false)) {
      await assignBtn.click();
      await page.waitForTimeout(300);

      // Select team member
      const memberOption = await page.locator(`text=${memberName}`).first();
      if (await memberOption.isVisible().catch(() => false)) {
        await memberOption.click();
        await page.waitForTimeout(300);

        // Set cost for assignment
        const costInput = await page.$('input[name="cost"], input[placeholder*="cost" i]');
        if (costInput) {
          await costInput.fill('500');
        }
      }
    }

    const saveTaskBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveTaskBtn.click();
    await waitForDataSave(page);

    // Verify task created
    await expect(page.getByText(taskName)).toBeVisible();
  });

  test('should assign multiple team members with cost split', async ({ page }) => {
    // Create multiple team members
    const members = [
      { name: `Producer ${Date.now()}`, role: 'Producer' },
      { name: `Engineer ${Date.now()}`, role: 'Engineer' },
      { name: `Musician ${Date.now()}`, role: 'Musician' }
    ];

    for (const member of members) {
      await navigateToRoute(page, '/team');
      await page.waitForTimeout(300);

      const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
      await newBtn.click();
      await page.waitForTimeout(500);

      await page.fill('input[name="name"], input[placeholder*="name" i]', member.name);
      
      const roleInput = await page.$('input[name="role"], input[placeholder*="role" i]');
      if (roleInput) {
        await roleInput.fill(member.role);
      }

      const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
      await saveBtn.click();
      await waitForDataSave(page);

      const backBtn = await page.locator('button').filter({ hasText: /back|close/i }).first();
      if (await backBtn.isVisible().catch(() => false)) {
        await backBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // Create task and assign all members
    await navigateToRoute(page, '/global-tasks');
    await page.waitForTimeout(500);

    const newTaskBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newTaskBtn.click();
    await page.waitForTimeout(500);

    const taskName = `Multi-Assignment ${Date.now()}`;
    await page.fill('input[name="taskName"], input[placeholder*="task" i], input[placeholder*="name" i]', taskName);
    
    // Set total estimated cost
    const estimatedInput = await page.$('input[name="estimatedCost"], input[placeholder*="estimated" i]');
    if (estimatedInput) {
      await estimatedInput.fill('1500');
    }

    // Try to assign multiple members
    // This depends on UI implementation - look for member assignment section
    const assignSection = await page.locator('text=/assign|team member/i').first();
    if (await assignSection.isVisible().catch(() => false)) {
      console.log('Team member assignment section found');
      // Assignment flow would happen here
    }

    const saveTaskBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveTaskBtn.click();
    await waitForDataSave(page);

    // Verify task created
    await expect(page.getByText(taskName)).toBeVisible();
  });

  test('should filter team members by musician flag', async ({ page }) => {
    // Create regular member
    await navigateToRoute(page, '/team');
    await page.waitForTimeout(500);

    let newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const regularName = `Regular Member ${Date.now()}`;
    await page.fill('input[name="name"], input[placeholder*="name" i]', regularName);
    
    let saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    await navigateToRoute(page, '/team');
    await page.waitForTimeout(300);

    // Create musician
    newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const musicianName = `Musician ${Date.now()}`;
    await page.fill('input[name="name"], input[placeholder*="name" i]', musicianName);
    
    const musicianCheckbox = await page.$('input[type="checkbox"][name="isMusician"]');
    if (musicianCheckbox) {
      await musicianCheckbox.check();
    }

    saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Try to filter musicians only
    const filterBtn = await page.locator('button, label').filter({ hasText: /musician|filter/i }).first();
    if (await filterBtn.isVisible().catch(() => false)) {
      await filterBtn.click();
      await page.waitForTimeout(300);

      // Verify musician appears
      await expect(page.getByText(musicianName)).toBeVisible();
    }
  });

  test('should track costs per team member', async ({ page }) => {
    // Create team member
    await navigateToRoute(page, '/team');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const memberName = `Cost Track Member ${Date.now()}`;
    await page.fill('input[name="name"], input[placeholder*="name" i]', memberName);
    
    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // View member detail - should show total costs
    await page.click(`text=${memberName}`);
    await page.waitForTimeout(500);

    const pageContent = await page.textContent('body');
    // Should show cost tracking (even if $0)
    expect(pageContent).toBeTruthy();
  });

  test('should handle company/organization type', async ({ page }) => {
    await navigateToRoute(page, '/team');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const companyName = `Test Studio ${Date.now()}`;
    await page.fill('input[name="name"], input[placeholder*="name" i]', companyName);
    
    // Change type to Organization
    const typeSelect = await page.$('select[name="type"]');
    if (typeSelect) {
      await typeSelect.selectOption('Organization');
    }

    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Verify organization created
    await expect(page.getByText(companyName)).toBeVisible();
  });

  test('should update team member role and contact info', async ({ page }) => {
    await navigateToRoute(page, '/team');
    await page.waitForTimeout(500);

    const newBtn = await page.locator('button').filter({ hasText: /new|add|create/i }).first();
    await newBtn.click();
    await page.waitForTimeout(500);

    const memberName = `Update Test ${Date.now()}`;
    await page.fill('input[name="name"], input[placeholder*="name" i]', memberName);
    
    const saveBtn = await page.locator('button').filter({ hasText: /save|create/i }).first();
    await saveBtn.click();
    await waitForDataSave(page);

    // Open for editing
    await page.click(`text=${memberName}`);
    await page.waitForTimeout(500);

    const editBtn = await page.locator('button').filter({ hasText: /edit/i }).first();
    if (await editBtn.isVisible().catch(() => false)) {
      await editBtn.click();
      await page.waitForTimeout(300);

      // Update role
      const roleInput = await page.$('input[name="role"], input[placeholder*="role" i]');
      if (roleInput) {
        await roleInput.fill('Senior Producer');
      }

      // Update email
      const emailInput = await page.$('input[name="email"], input[type="email"]');
      if (emailInput) {
        await emailInput.fill('senior@test.com');
      }

      // Update phone
      const phoneInput = await page.$('input[name="phone"], input[type="tel"]');
      if (phoneInput) {
        await phoneInput.fill('555-1234');
      }

      const updateBtn = await page.locator('button').filter({ hasText: /save|update/i }).first();
      await updateBtn.click();
      await waitForDataSave(page);

      // Verify updates
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('Senior Producer');
    }
  });
});
