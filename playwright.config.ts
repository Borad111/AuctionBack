import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/modules',
  use: {
    baseURL: 'http://localhost:3000', // apna backend/frontend URL
    headless: true,
    viewport: { width: 1280, height: 720 },
    video: 'on-first-retry',
  },
});