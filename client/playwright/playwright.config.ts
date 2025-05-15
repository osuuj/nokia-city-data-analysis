import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  reporter: 'html',
  use: {
    headless: true,
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      slowMo: 100,
    },
  },
  projects: [
    {
      name: 'Desktop Chrome - Light',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'light',
      },
    },
    {
      name: 'Desktop Chrome - Dark',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
      },
    },
    {
      name: 'Mobile iPhone - Light',
      use: {
        ...devices['iPhone 12'],
        colorScheme: 'light',
      },
    },
    {
      name: 'Mobile iPhone - Dark',
      use: {
        ...devices['iPhone 12'],
        colorScheme: 'dark',
      },
    },
  ],
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
});
