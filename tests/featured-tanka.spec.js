const { test, expect } = require('@playwright/test');

const VIEWPORTS = [
  { name: 'mobile_390', width: 390, height: 844 },
  { name: 'mobile_430', width: 430, height: 932 },
  { name: 'desktop_1366', width: 1366, height: 768 },
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'desktop_1920', width: 1920, height: 1080 }
];

function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

async function getHeroMetrics(page) {
  return page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        right: box.right,
        top: box.top,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
        centerX: box.left + box.width / 2,
        centerY: box.top + box.height / 2
      };
    };

    const style = (selector, property) => {
      const element = document.querySelector(selector);
      return element ? getComputedStyle(element)[property] : null;
    };

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      layout: rect('.poem-layout'),
      body: rect('.poem-body'),
      source: rect('.poem-source'),
      controls: rect('.featured-controls'),
      bodyWritingMode: style('.poem-body', 'writingMode'),
      sourceWritingMode: style('.poem-source', 'writingMode'),
      visibleText: document.body.innerText
    };
  });
}

test.describe('featured tanka hero', () => {
  for (const viewport of VIEWPORTS) {
    test(`${viewport.name} keeps the tanka display stable`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await expect(page.locator('.poem-body')).toBeVisible();

      for (let index = 0; index < 7; index += 1) {
        const metrics = await getHeroMetrics(page);
        expect(metrics.bodyWritingMode).toBe('vertical-rl');
        expect(metrics.sourceWritingMode).toBe('vertical-rl');
        expect(metrics.visibleText).not.toMatch(/\b[1-7]\s*\/\s*7\b/);

        expect(metrics.layout.left).toBeGreaterThanOrEqual(0);
        expect(metrics.layout.right).toBeLessThanOrEqual(metrics.viewport.width);
        expect(metrics.layout.top).toBeGreaterThanOrEqual(0);
        expect(metrics.layout.bottom).toBeLessThan(metrics.controls.top);
        expect(metrics.controls.bottom).toBeLessThanOrEqual(metrics.viewport.height);

        const centerDelta = Math.abs(metrics.layout.centerX - metrics.viewport.width / 2);
        expect(centerDelta).toBeLessThanOrEqual(Math.max(10, metrics.viewport.width * 0.025));

        const bottomDelta = Math.abs(metrics.body.bottom - metrics.source.bottom);
        expect(bottomDelta).toBeLessThanOrEqual(4);
        expect(metrics.source.right).toBeLessThanOrEqual(metrics.body.left + 2);

        expect(overlaps(metrics.controls, metrics.layout)).toBe(false);
        expect(overlaps(metrics.controls, metrics.body)).toBe(false);

        if (index === 0) {
          await page.screenshot({
            path: `screenshots/v13_fix_chromium_${viewport.name}_top.png`,
            fullPage: false
          });
        }

        if (index < 6) {
          await page.getByRole('button', { name: '次の一首を表示' }).click();
          await expect(page.locator('#tanka-counter')).toContainText(`現在${index + 2}首目`);
        }
      }
    });
  }
});
