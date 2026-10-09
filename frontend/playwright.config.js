import { defineConfig } from '@playwright/test';

// Browser smoke tests. They run against the production build: `npm run build` first, then `npm run e2e`.
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.js',
  timeout: 120_000,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://localhost:4173' },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
