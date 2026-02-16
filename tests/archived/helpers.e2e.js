/**
 * E2E Test Helpers for Era Manifesto
 * 
 * These helpers provide utilities for:
 * - Waiting for app initialization
 * - Clearing storage between tests
 * - Navigating within the hash-based router
 * - Common UI interactions
 */

/**
 * Wait for the app to fully load and initialize
 * @param {import('@playwright/test').Page} page 
 * @param {number} timeout - Maximum wait time in ms
 */
export async function waitForApp(page, timeout = 30000) {
  // Wait for React root to mount
  await page.waitForSelector('#root', { timeout });
  
  // Wait for main app container
  await page.waitForSelector('[data-testid="app-container"], .min-h-screen', { timeout });
  
  // Wait for any loading states to clear
  await page.waitForTimeout(500);
}

/**
 * Clear all browser storage (localStorage, sessionStorage, IndexedDB)
 * @param {import('@playwright/test').Page} page 
 */
export async function clearStorage(page) {
  await page.evaluate(async () => {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear IndexedDB - properly await completion
    if (window.indexedDB && window.indexedDB.databases) {
      const databases = await window.indexedDB.databases();
      const promises = databases.map((db) => {
        if (db.name) {
          return new Promise((resolve) => {
            const request = window.indexedDB.deleteDatabase(db.name);
            request.onsuccess = () => resolve();
            request.onerror = () => resolve(); // Resolve even on error
            request.onblocked = () => resolve(); // Resolve even if blocked
          });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
    }
  });
  
  // Wait for storage operations to complete
  await page.waitForTimeout(500);
}

/**
 * Navigate using hash-based routing
 * @param {import('@playwright/test').Page} page 
 * @param {string} path - Path without the hash (e.g., '/songs' not '/#/songs')
 */
export async function navigateToRoute(page, path) {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  await page.goto(`/#${normalizedPath}`);
  await page.waitForTimeout(300);
}

/**
 * Wait for navigation to complete after clicking a link
 * @param {import('@playwright/test').Page} page 
 */
export async function waitForNavigation(page) {
  await page.waitForTimeout(300);
}

/**
 * Click button and wait for any resulting operations
 * @param {import('@playwright/test').Page} page 
 * @param {string} selector - Button selector
 * @param {Object} options - Click options
 */
export async function clickAndWait(page, selector, options = {}) {
  await page.click(selector, options);
  await page.waitForTimeout(options.waitTime || 500);
}

/**
 * Fill input and trigger change events
 * @param {import('@playwright/test').Page} page 
 * @param {string} selector - Input selector
 * @param {string} value - Value to fill
 */
export async function fillInput(page, selector, value) {
  await page.fill(selector, value);
  await page.waitForTimeout(100);
}

/**
 * Wait for a modal or dialog to appear
 * @param {import('@playwright/test').Page} page 
 * @param {string} selector - Modal selector (optional)
 */
export async function waitForModal(page, selector = '[role="dialog"]') {
  await page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
  await page.waitForTimeout(300);
}

/**
 * Close a modal by clicking backdrop or close button
 * @param {import('@playwright/test').Page} page 
 */
export async function closeModal(page) {
  // Try close button first
  const closeButton = await page.$('button:has-text("Close"), button:has-text("Cancel"), [aria-label="Close"]');
  if (closeButton) {
    await closeButton.click();
  } else {
    // Try ESC key
    await page.keyboard.press('Escape');
  }
  await page.waitForTimeout(300);
}

/**
 * Wait for data to be saved (IndexedDB operations)
 * @param {import('@playwright/test').Page} page 
 * @param {number} waitTime - Time to wait in ms
 */
export async function waitForDataSave(page, waitTime = 1000) {
  await page.waitForTimeout(waitTime);
}

/**
 * Get text content from an element
 * @param {import('@playwright/test').Page} page 
 * @param {string} selector 
 * @returns {Promise<string>}
 */
export async function getText(page, selector) {
  const element = await page.$(selector);
  return element ? await element.textContent() : '';
}

/**
 * Check if element exists and is visible
 * @param {import('@playwright/test').Page} page 
 * @param {string} selector 
 * @returns {Promise<boolean>}
 */
export async function isVisible(page, selector) {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Select option from dropdown/select element
 * @param {import('@playwright/test').Page} page 
 * @param {string} selector 
 * @param {string} value 
 */
export async function selectOption(page, selector, value) {
  await page.selectOption(selector, value);
  await page.waitForTimeout(100);
}

/**
 * Get count of elements matching selector
 * @param {import('@playwright/test').Page} page 
 * @param {string} selector 
 * @returns {Promise<number>}
 */
export async function getElementCount(page, selector) {
  const elements = await page.$$(selector);
  return elements.length;
}

/**
 * Scroll element into view
 * @param {import('@playwright/test').Page} page 
 * @param {string} selector 
 */
export async function scrollToElement(page, selector) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
}

/**
 * Take a screenshot with descriptive name
 * @param {import('@playwright/test').Page} page 
 * @param {string} name 
 */
export async function takeScreenshot(page, name) {
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
}

/**
 * Verify page is at expected route
 * @param {import('@playwright/test').Page} page 
 * @param {string} expectedPath 
 * @returns {Promise<boolean>}
 */
export async function isAtRoute(page, expectedPath) {
  const url = page.url();
  const hash = url.split('#')[1] || '/';
  return hash === expectedPath || hash.startsWith(expectedPath);
}

/**
 * Click on sidebar navigation item
 * @param {import('@playwright/test').Page} page 
 * @param {string} itemText - Text of the nav item (e.g., "Songs", "Releases")
 */
export async function clickSidebarItem(page, itemText) {
  await page.click(`nav >> text="${itemText}"`);
  await waitForNavigation(page);
}

/**
 * Open settings and configure app
 * @param {import('@playwright/test').Page} page 
 * @param {Object} settings - Settings to configure
 */
export async function configureSettings(page, settings = {}) {
  await navigateToRoute(page, '/settings');
  
  if (settings.darkMode !== undefined) {
    const toggle = await page.$('input[type="checkbox"]:near(:text("Dark Mode"))');
    const isChecked = await toggle?.isChecked();
    if ((settings.darkMode && !isChecked) || (!settings.darkMode && isChecked)) {
      await toggle?.click();
      await page.waitForTimeout(300);
    }
  }
  
  if (settings.cloudSync === false) {
    // Disable cloud sync if enabled
    const syncToggle = await page.$('input[type="checkbox"]:near(:text("Cloud Sync"))');
    const isEnabled = await syncToggle?.isChecked();
    if (isEnabled) {
      await syncToggle?.click();
      await page.waitForTimeout(500);
    }
  }
}

/**
 * Get app state from localStorage
 * @param {import('@playwright/test').Page} page 
 * @returns {Promise<Object>}
 */
export async function getAppState(page) {
  return await page.evaluate(() => {
    const state = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        state[key] = JSON.parse(localStorage.getItem(key));
      } catch {
        state[key] = localStorage.getItem(key);
      }
    }
    return state;
  });
}

/**
 * Set app state in localStorage
 * @param {import('@playwright/test').Page} page 
 * @param {Object} state 
 */
export async function setAppState(page, state) {
  await page.evaluate((stateObj) => {
    Object.entries(stateObj).forEach(([key, value]) => {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    });
  }, state);
}
