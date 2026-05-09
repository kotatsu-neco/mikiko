const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

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

async function saveV13nScreenshot(page, viewport) {
  if (['mobile_375', 'mobile_390', 'mobile_430', 'desktop_1366'].includes(viewport.name)) {
    await page.screenshot({
      path: `screenshots/v13n_chromium_${viewport.name}_top.png`,
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
          await saveV13nScreenshot(page, viewport);
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

  test('mobile nav toggle stays fixed after scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('.tanka-body')).toBeVisible();

    const before = await page.locator('.nav-toggle').boundingBox();
    await page.waitForTimeout(1700);
    await page.evaluate(() => window.scrollTo(0, document.querySelector('#works').offsetTop));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
    const after = await page.locator('.nav-toggle').boundingBox();

    expect(after.x).toBeCloseTo(before.x, 1);
    expect(after.y).toBeCloseTo(before.y, 1);
    await page.locator('.nav-toggle').click();
    await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#global-nav')).toHaveClass(/is-open/);
  });

  test('section headings are quiet and works data is rendered as specified', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/');
    await expect(page.locator('.tanka-body')).toBeVisible();

    const headingFontSize = await page.locator('#works-heading').evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
    const eyebrowFontSize = await page.locator('#works .eyebrow').evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
    expect(headingFontSize).toBeLessThanOrEqual(25);
    expect(eyebrowFontSize).toBeLessThanOrEqual(10);

    const workTitleFontFamily = await page.locator('.work-title').first().evaluate((element) => getComputedStyle(element).fontFamily);
    expect(workTitleFontFamily).not.toContain('Mincho');
    expect(workTitleFontFamily).not.toContain('Serif');

    await expect(page.locator('#works')).toContainText('第一歌集');
    await expect(page.locator('#works')).toContainText('『樹下のひとりの眠りのために』');
    await expect(page.locator('#works')).toContainText('短歌研究社');
    await expect(page.locator('#works')).toContainText('第二歌集');
    await expect(page.locator('#works')).toContainText('『水をひらく手』');
    await expect(page.locator('#works')).toContainText('第三歌集');
    await expect(page.locator('#works')).toContainText('『花の線画』');
    await expect(page.locator('#works')).toContainText('青磁社');
    await expect(page.locator('#works')).toContainText('第四歌集');
    await expect(page.locator('#works')).toContainText('『金の雨』');
    await expect(page.locator('#works')).toContainText('第五歌集');
    await expect(page.locator('#works')).toContainText('『午後の蝶』');
    await expect(page.locator('#works')).toContainText('ふらんす堂');
    await expect(page.locator('#works')).toContainText('第六歌集');
    await expect(page.locator('#works')).toContainText('『とく来りませ』');
    await expect(page.locator('#works')).toContainText('砂子屋書房');
    await expect(page.locator('#works')).toContainText('その他著書');
    await expect(page.locator('#works')).toContainText('『セレクション歌人 30横山未来子集』');
    await expect(page.locator('#works')).toContainText('邑書林');
    await expect(page.locator('#works')).toContainText('『はじめてのやさしい短歌のつくりかた』');
    await expect(page.locator('#works')).toContainText('日本文芸社');
    await expect(page.locator('#works')).toContainText('『のんびり読んで、すんなり身につく　いちばんやさしい短歌』');
    await expect(page.locator('#works')).toContainText('『アルカリ色のくも　宮沢賢治の青春短歌を読む』');
    await expect(page.locator('#works')).toContainText('（共著）');
    await expect(page.locator('#works')).toContainText('NHK出版');

    const alkaliText = await page.locator('.work-item').filter({ hasText: 'アルカリ色のくも' }).textContent();
    expect(alkaliText.replace(/\s+/g, ' ')).toContain('『アルカリ色のくも 宮沢賢治の青春短歌を読む』（共著） NHK出版');
  });

  test('left rail, work columns, and desktop covers are aligned', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/');
    await expect(page.locator('.tanka-body')).toBeVisible();

    const metrics = await page.evaluate(() => {
      const box = (selector) => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return {
          left: rect.left,
          width: rect.width
        };
      };
      return {
        brand: box('.brand'),
        profileHeading: box('#profile .section-heading'),
        worksHeading: box('#works .section-heading'),
        worksGroupWidths: Array.from(document.querySelectorAll('.works-group')).map((element) => element.getBoundingClientRect().width)
      };
    });

    expect(Math.abs(metrics.brand.left - metrics.profileHeading.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(metrics.brand.left - metrics.worksHeading.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(metrics.worksGroupWidths[0] - metrics.worksGroupWidths[1])).toBeLessThanOrEqual(1);

    await expect(page.getByAltText('『午後の蝶』書影')).toBeVisible();
    await expect(page.getByAltText('『とく来りませ』書影')).toBeVisible();
    const coverWidth = await page.getByAltText('『午後の蝶』書影').evaluate((element) => element.getBoundingClientRect().width);
    expect(coverWidth).toBeGreaterThanOrEqual(72);
    expect(coverWidth).toBeLessThanOrEqual(96);
  });

  test('book cover assets are stored and hidden on mobile', async ({ page }) => {
    const coverPaths = [
      'assets/books/gogo_no_cho_cover.webp',
      'assets/books/toku_koirimasu_cover.webp'
    ];
    for (const coverPath of coverPaths) {
      expect(fs.existsSync(path.join(process.cwd(), coverPath))).toBe(true);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('.tanka-body')).toBeVisible();
    const displayedBookImages = await page.locator('img[src^="assets/books/"]:visible').count();
    expect(displayedBookImages).toBe(0);
  });
});
