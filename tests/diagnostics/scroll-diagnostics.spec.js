const { test, expect } = require('@playwright/test');

const VIEWPORTS = [
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 1366, height: 768 }
];

const DEBUG_PATHS = [
  '/?debugScroll=1',
  '/?debugScroll=1&forceTop=1',
  '/?debugScroll=1&manualRestoration=1',
  '/#profile',
  '/?debugScroll=1#profile'
];

function overlaps(a, b) {
  return a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

async function rect(page, selector) {
  return page.locator(selector).evaluate((element) => {
    const box = element.getBoundingClientRect();
    return {
      left: box.left,
      right: box.right,
      top: box.top,
      bottom: box.bottom,
      width: box.width,
      height: box.height
    };
  });
}

async function diagnosticsCount(page) {
  return page.evaluate(() => window.__YKM_SCROLL_DIAGNOSTICS__?.length ?? 0);
}

async function assetUrls(page) {
  return page.evaluate(() => ({
    stylesheet: document.querySelector('link[rel="stylesheet"]')?.getAttribute('href') ?? '',
    script: document.querySelector('script[src]')?.getAttribute('src') ?? ''
  }));
}

test.describe('scroll diagnostics mode', () => {
  for (const viewport of VIEWPORTS) {
    test(`normal URL does not show diagnostics at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await expect(page.locator('.tanka-body')).toBeVisible();
      await expect(page.locator('.featured-loading')).toHaveCount(0);
      await expect(page.locator('.scroll-diagnostics')).toHaveCount(0);
      await expect(page.evaluate(() => history.scrollRestoration)).resolves.toBe('manual');
      await expect(page.evaluate(() => window.__YKM_BUILD_ID__)).resolves.toBe('v13j-cache-bust-20260509');

      const urls = await assetUrls(page);
      expect(urls.stylesheet).toBe('styles.css?v=20260509-v13j');
      expect(urls.script).toBe('script.js?v=20260509-v13j');

      if (viewport.width === 375 && viewport.height === 667) {
        await page.screenshot({ path: 'screenshots/diag_375x667_top_v13g.png', fullPage: false });
      }
    });
  }

  test('normal URL reload stays at top without diagnostics', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('.tanka-body')).toBeVisible();
    await page.waitForTimeout(1700);
    await page.evaluate(() => window.scrollTo(0, 2200));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);

    await page.reload();
    await expect(page.locator('.tanka-body')).toBeVisible();
    await expect(page.locator('.scroll-diagnostics')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  });

  test('hash URL can navigate to profile without diagnostics', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#profile');
    await expect(page.locator('#profile')).toBeVisible();
    await expect(page.locator('.scroll-diagnostics')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });

  for (const viewport of VIEWPORTS) {
    for (const path of DEBUG_PATHS) {
      test(`diagnostics ${path} at ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        await expect(page.locator('.tanka-body')).toBeVisible();

        const hasDebug = path.includes('debugScroll=1');
        if (!hasDebug) {
          await expect(page.locator('.scroll-diagnostics')).toHaveCount(0);
          return;
        }

        await expect(page.locator('.scroll-diagnostics')).toBeVisible();
        await expect.poll(() => diagnosticsCount(page)).toBeGreaterThan(2);

        const logsBeforeCopy = await diagnosticsCount(page);
        await page.getByRole('button', { name: '診断ログをコピー' }).click();
        await expect.poll(() => diagnosticsCount(page)).toBeGreaterThan(logsBeforeCopy);

        const logs = await page.evaluate(() => window.__YKM_SCROLL_DIAGNOSTICS__);
        expect(logs.some((entry) => entry.eventName === 'script-start')).toBe(true);
        expect(logs.some((entry) => entry.eventName === 'after-json-loaded')).toBe(true);
        expect(logs.some((entry) => entry.eventName === 'after-render-tanka')).toBe(true);
        expect(logs.every((entry) => entry.buildId === 'v13j-cache-bust-20260509')).toBe(true);
        await expect(page.locator('.scroll-diagnostics__latest')).toContainText('build=v13j-cache-bust-20260509');

        if (path.includes('manualRestoration=1')) {
          expect(logs.at(-1).historyScrollRestoration).toBe('manual');
        }

        if (path.includes('#profile')) {
          await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
          const hashLogs = await page.evaluate(() => window.__YKM_SCROLL_DIAGNOSTICS__);
          expect(hashLogs.some((entry) => entry.locationHash === '#profile')).toBe(true);
        }

        if (path.includes('forceTop=1')) {
          await expect.poll(() => page.evaluate(() => window.__YKM_SCROLL_DIAGNOSTICS__.some((entry) => entry.eventName === 'force-top-after-pageshow'))).toBe(true);
        }

        const panel = await rect(page, '.scroll-diagnostics');
        const tankaBody = await rect(page, '.tanka-body');
        const source = await rect(page, '.tanka-source');
        const prevButton = await rect(page, '#prev-tanka');
        const nextButton = await rect(page, '#next-tanka');

        expect(overlaps(panel, tankaBody)).toBe(false);
        expect(overlaps(panel, source)).toBe(false);
        expect(overlaps(panel, prevButton)).toBe(false);
        expect(overlaps(panel, nextButton)).toBe(false);

        if (viewport.width === 390 && viewport.height === 844 && path === '/?debugScroll=1') {
          await page.screenshot({ path: 'screenshots/diag_390x844_debug_v13g.png', fullPage: false });
        }
        if (viewport.width === 430 && viewport.height === 932 && path === '/?debugScroll=1#profile') {
          await page.screenshot({ path: 'screenshots/diag_430x932_hash_profile_v13g.png', fullPage: false });
        }
        if (viewport.width === 1366 && viewport.height === 768 && path === '/?debugScroll=1') {
          await page.screenshot({ path: 'screenshots/diag_1366x768_debug_v13g.png', fullPage: false });
        }
      });
    }
  }
});
