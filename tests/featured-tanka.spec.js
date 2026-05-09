const { test, expect } = require('@playwright/test');

const VIEWPORTS = [
  { name: 'mobile_375', width: 375, height: 667 },
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
    const numericStyle = (selector, property) => {
      const value = style(selector, property);
      return value ? Number.parseFloat(value) : null;
    };
    const bodyRect = rect('.tanka-body');
    const bodyLineHeight = numericStyle('.tanka-body', 'lineHeight');

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      layout: rect('.tanka-layout'),
      body: bodyRect,
      source: rect('.tanka-source'),
      controls: rect('.featured-controls'),
      bodyWritingMode: style('.tanka-body', 'writingMode'),
      sourceWritingMode: style('.tanka-source', 'writingMode'),
      layoutDisplay: style('.tanka-layout', 'display'),
      layoutGridTemplateColumns: style('.tanka-layout', 'gridTemplateColumns'),
      bodyColumnEstimate: bodyRect && bodyLineHeight ? bodyRect.width / bodyLineHeight : null,
      navToggleLabel: document.querySelector('.nav-toggle')?.getAttribute('aria-label') ?? '',
      navToggleExpanded: document.querySelector('.nav-toggle')?.getAttribute('aria-expanded') ?? '',
      visibleText: document.body.innerText
    };
  });
}

async function saveV13kScreenshot(page, viewport) {
  if (['mobile_375', 'mobile_390', 'mobile_430', 'desktop_1366'].includes(viewport.name)) {
    await page.screenshot({
      path: `screenshots/v13k_chromium_${viewport.name}_top.png`,
      fullPage: false
    });
  }
}

test.describe('featured tanka hero', () => {
  for (const viewport of VIEWPORTS) {
    test(`${viewport.name} keeps the tanka display stable`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await expect(page.locator('.tanka-body')).toBeVisible();

      for (let index = 0; index < 7; index += 1) {
        const metrics = await getHeroMetrics(page);
        expect(metrics.bodyWritingMode).toBe('vertical-rl');
        expect(metrics.sourceWritingMode).toBe('vertical-rl');
        expect(metrics.layoutDisplay).toBe('grid');
        expect(metrics.visibleText).not.toMatch(/\b[1-7]\s*\/\s*7\b/);

        expect(metrics.layout.left).toBeGreaterThanOrEqual(0);
        expect(metrics.layout.right).toBeLessThanOrEqual(metrics.viewport.width);
        expect(metrics.layout.top).toBeGreaterThanOrEqual(0);
        expect(metrics.layout.bottom).toBeLessThan(metrics.controls.top);
        expect(metrics.controls.bottom).toBeLessThanOrEqual(metrics.viewport.height);

        const centerDelta = Math.abs(metrics.body.centerX - metrics.viewport.width / 2);
        expect(centerDelta).toBeLessThanOrEqual(Math.max(10, metrics.viewport.width * 0.025));
        expect(metrics.bodyColumnEstimate).toBeLessThan(2.75);
        expect(metrics.body.left).toBeGreaterThanOrEqual(metrics.layout.left - 2);
        expect(metrics.body.right).toBeLessThanOrEqual(metrics.layout.right + 2);
        expect(metrics.source.left).toBeGreaterThanOrEqual(metrics.layout.left - 2);
        expect(metrics.source.right).toBeLessThanOrEqual(metrics.layout.right + 2);

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
          await saveV13kScreenshot(page, viewport);
        }

        if (index < 6) {
          await page.getByRole('button', { name: '次の一首を表示' }).click();
          await expect(page.locator('#tanka-counter')).toContainText(`現在${index + 2}首目`);
        }
      }
    });
  }

  test('previous and next buttons switch the selected tanka', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('.tanka-body')).toBeVisible();

    const tankaText = () => page.locator('.tanka-body').evaluate((element) => element.textContent);
    const firstText = await tankaText();
    await page.getByRole('button', { name: '次の一首を表示' }).click();
    await expect(page.locator('#tanka-counter')).toContainText('現在2首目');
    await expect.poll(tankaText).not.toBe(firstText);

    await page.getByRole('button', { name: '前の一首を表示' }).click();
    await expect(page.locator('#tanka-counter')).toContainText('現在1首目');
    await expect.poll(tankaText).toBe(firstText);
  });

  test('mobile keeps the tanka body to two visual columns', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('.tanka-body')).toBeVisible();
    await expect(page.evaluate(() => window.__YKM_TANKA_BREAK_UNITS__)).resolves.toBe(16);
    await expect(page.locator('.tanka-break')).toHaveCount(1);
    const metrics = await getHeroMetrics(page);
    expect(metrics.bodyColumnEstimate).toBeLessThan(2.75);
  });

  test('nav toggle changes from hamburger to close button', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-label', 'メニューを開く');

    const before = await page.locator('.nav-toggle span').evaluateAll((spans) => spans.map((span) => {
      const style = getComputedStyle(span);
      return { opacity: style.opacity, transform: style.transform };
    }));
    await page.locator('.nav-toggle').click();
    await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-label', 'メニューを閉じる');
    await expect(page.locator('#global-nav')).toHaveClass(/is-open/);
    const after = await page.locator('.nav-toggle span').evaluateAll((spans) => spans.map((span) => {
      const style = getComputedStyle(span);
      return { opacity: style.opacity, transform: style.transform };
    }));
    expect(after[0].transform).not.toBe(before[0].transform);
    expect(after[1].opacity).not.toBe(before[1].opacity);
    expect(after[2].transform).not.toBe(before[2].transform);

    await page.locator('.nav-toggle').click();
    await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-label', 'メニューを開く');
  });
});
