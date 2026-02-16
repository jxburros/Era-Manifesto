/* eslint-env node */
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration for Era Manifesto
 * 
 * This configuration is optimized for:
 * - Local development testing
 * - CI/CD pipeline execution
 * - Headless and headed modes
 * - Offline-first app architecture
 */

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  
  // Maximum time one test can run
  timeout: 30 * 1000,
  
  // Maximum time expect() should wait for condition
  expect: {
    timeout: 5000
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL for navigation
    baseURL: 'http://localhost:5173',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Browser viewport size
    viewport: { width: 1280, height: 720 },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Uncomment to test on other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    
    // Mobile viewports for responsive testing
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
