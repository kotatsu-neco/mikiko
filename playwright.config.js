const fs = require('node:fs');
// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const linuxChromiumExecutable = '/usr/bin/chromium';
const chromiumExecutablePath = process.platform === 'linux' && fs.existsSync(linuxChromiumExecutable)
  ? linuxChromiumExecutable
  : undefined;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  use: {
    baseURL: 'http://127.0.0.1:8000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'python3 -m http.server 8000',
    url: 'http://127.0.0.1:8000',
    reuseExistingServer: true,
    timeout: 10_000
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        launchOptions: chromiumExecutablePath ? { executablePath: chromiumExecutablePath } : {}
      }
    }
  ]
});
