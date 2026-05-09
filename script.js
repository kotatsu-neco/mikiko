const BUILD_ID = 'v13l-ui-books-20260509';
const initialLocationHash = window.location.hash;
const shouldKeepInitialTop = !initialLocationHash || initialLocationHash === '#top';
const initialTopLockStartedAt = performance.now();
const INITIAL_TOP_LOCK_MS = 1600;

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

if (shouldKeepInitialTop) {
  window.scrollTo(0, 0);
}

const FALLBACK_TANKA = [
  {
    id: 'selected_001',
    order: 1,
    text: '胸もとに水の反照うけて立つきみの四囲より啓かるる夏',
    html: '胸もとに水の反照うけて立つきみの四囲より<ruby>啓<rt>ひら</rt></ruby>かるる夏',
    sourceBookId: 'jukano_hitori_no_nemuri',
    sourceLabel: '『樹下のひとりの眠りのために』',
    displayGroup: 'selected-seven',
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'selected_002',
    order: 2,
    text: '逢ひしことの温度を永く保たむととざせり耳をまなこを喉を',
    html: '逢ひしことの温度を永く保たむととざせり耳をまなこを喉を',
    sourceBookId: 'mizuwo_hiraku_te',
    sourceLabel: '『水をひらく手』',
    displayGroup: 'selected-seven',
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'selected_003',
    order: 3,
    text: '蜜吸ひては花のうへにて踏み替ふる蝶の脚ほそしわがまなかひに',
    html: '蜜吸ひては花のうへにて踏み替ふる蝶の脚ほそしわがまなかひに',
    sourceBookId: 'hanano_senga',
    sourceLabel: '『花の線画』',
    displayGroup: 'selected-seven',
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'selected_004',
    order: 4,
    text: '眼をあけてゐられぬ空の下に寝むわれらの髪に蟻迷ふまで',
    html: '眼をあけてゐられぬ空の下に寝むわれらの髪に蟻迷ふまで',
    sourceBookId: 'hanano_senga',
    sourceLabel: '『花の線画』',
    displayGroup: 'selected-seven',
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'selected_005',
    order: 5,
    text: '巻貝のかたちに我のねむるときあかるき金の雨となりて来よ',
    html: '巻貝のかたちに我のねむるときあかるき金の雨となりて来よ',
    sourceBookId: 'kinno_ame',
    sourceLabel: '『金の雨』',
    displayGroup: 'selected-seven',
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'selected_006',
    order: 6,
    text: '永遠の午後あるごとく橋脚に水面のあかりまつはりてをり',
    html: '永遠の午後あるごとく橋脚に水面のあかりまつはりてをり',
    sourceBookId: 'gogo_no_cho',
    sourceLabel: '『午後の蝶』',
    displayGroup: 'selected-seven',
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'selected_007',
    order: 7,
    text: '星に星のふるへ伝はり手のなかの万年筆をかちりと閉めつ',
    html: '星に星のふるへ伝はり手のなかの万年筆をかちりと閉めつ',
    sourceBookId: 'toku_koirimasu',
    sourceLabel: '『とく来りませ』',
    displayGroup: 'selected-seven',
    isFeatured: true,
    status: 'published'
  }
];

const FALLBACK_BOOKS = [
  { id: 'jukano_hitori_no_nemuri', title: '樹下のひとりの眠りのために', type: '歌集', seriesLabel: '第一歌集', year: '', publisher: '短歌研究社', purchaseUrl: '', description: '' },
  { id: 'mizuwo_hiraku_te', title: '水をひらく手', type: '歌集', seriesLabel: '第二歌集', year: '', publisher: '短歌研究社', purchaseUrl: '', description: '' },
  { id: 'hanano_senga', title: '花の線画', type: '歌集', seriesLabel: '第三歌集', year: '', publisher: '青磁社', purchaseUrl: '', description: '' },
  { id: 'kinno_ame', title: '金の雨', type: '歌集', seriesLabel: '第四歌集', year: '', publisher: '短歌研究社', purchaseUrl: '', description: '' },
  { id: 'gogo_no_cho', title: '午後の蝶', type: '歌集', seriesLabel: '第五歌集', year: '', publisher: 'ふらんす堂', purchaseUrl: '', description: '' },
  { id: 'toku_koirimasu', title: 'とく来りませ', type: '歌集', seriesLabel: '第六歌集', year: '', publisher: '砂子屋書房', purchaseUrl: '', description: '' },
  { id: 'selection_kajin_30', title: 'セレクション歌人 30横山未来子集', type: 'その他著書', year: '', publisher: '邑書林', purchaseUrl: '', description: '' },
  { id: 'hajimete_no_yasashii_tanka', title: 'はじめてのやさしい短歌のつくりかた', type: 'その他著書', year: '', publisher: '日本文芸社', purchaseUrl: '', description: '' },
  { id: 'ichiban_yasashii_tanka', title: 'のんびり読んで、すんなり身につく　いちばんやさしい短歌', type: 'その他著書', year: '', publisher: '日本文芸社', purchaseUrl: '', description: '' },
  { id: 'alkali_iro_no_kumo', title: 'アルカリ色のくも　宮沢賢治の青春短歌を読む', type: 'その他著書', year: '', publisher: 'NHK出版', collaboration: '共著', purchaseUrl: '', description: '' }
];

const featuredTanka = document.getElementById('featured-tanka');
const worksGrid = document.getElementById('works-grid');
const prevBtn = document.getElementById('prev-tanka');
const nextBtn = document.getElementById('next-tanka');
const counter = document.getElementById('tanka-counter');
const navToggle = document.querySelector('.nav-toggle');
const globalNav = document.getElementById('global-nav');
const siteHeader = document.getElementById('site-header');

const requiredElements = [
  ['featured-tanka', featuredTanka],
  ['prev-tanka', prevBtn],
  ['next-tanka', nextBtn],
  ['works-grid', worksGrid]
];
const missingRequiredElementIds = requiredElements
  .filter(([, element]) => !element)
  .map(([id]) => id);

if (missingRequiredElementIds.length) {
  console.error(`[${BUILD_ID}] Missing required elements: ${missingRequiredElementIds.join(', ')}`);
}

const DESKTOP_TANKA_BREAK_UNITS = 16;
const MOBILE_TANKA_BREAK_UNITS = 16;
const tankaBreakMedia = window.matchMedia('(max-width: 640px)');
const diagnosticParams = new URLSearchParams(window.location.search);
const isScrollDebug = diagnosticParams.get('debugScroll') === '1';
const shouldUseManualRestoration = isScrollDebug && diagnosticParams.get('manualRestoration') === '1';
const shouldForceTop = isScrollDebug && diagnosticParams.get('forceTop') === '1';

let tankaData = [];
let booksData = [];
let currentIndex = 0;
let diagnosticPanel = null;
let diagnosticLatest = null;
let diagnosticEvents = null;
let diagnosticTextarea = null;
let scrollLogTimer = null;
const diagnosticLogs = [];

if (shouldUseManualRestoration && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.__YKM_SCROLL_DIAGNOSTICS__ = diagnosticLogs;
window.__YKM_BUILD_ID__ = BUILD_ID;

function getDisplayBreakUnits() {
  return tankaBreakMedia.matches ? MOBILE_TANKA_BREAK_UNITS : DESKTOP_TANKA_BREAK_UNITS;
}

window.__YKM_TANKA_BREAK_UNITS__ = getDisplayBreakUnits();

function shouldPinCurrentLocationToTop() {
  return shouldKeepInitialTop && (!location.hash || location.hash === '#top');
}

function isWithinInitialTopLock() {
  return performance.now() - initialTopLockStartedAt <= INITIAL_TOP_LOCK_MS;
}

function pinInitialTop(reason) {
  if (!shouldPinCurrentLocationToTop() || !isWithinInitialTopLock()) return;
  const wasOffset = window.scrollY !== 0 || document.documentElement.scrollTop !== 0 || (document.body?.scrollTop ?? 0) !== 0;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  recordDiagnostic('initial-top-pin', { reason, wasOffset });
}

function scheduleInitialTopPin(reason) {
  if (!shouldPinCurrentLocationToTop() || !isWithinInitialTopLock()) return;
  pinInitialTop(reason);
  window.requestAnimationFrame(() => pinInitialTop(`${reason}-raf`));
  window.setTimeout(() => pinInitialTop(`${reason}-120ms`), 120);
  window.setTimeout(() => pinInitialTop(`${reason}-480ms`), 480);
}

function rectFor(selector) {
  const element = document.querySelector(selector);
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return {
    top: Math.round(rect.top * 100) / 100,
    right: Math.round(rect.right * 100) / 100,
    bottom: Math.round(rect.bottom * 100) / 100,
    left: Math.round(rect.left * 100) / 100,
    width: Math.round(rect.width * 100) / 100,
    height: Math.round(rect.height * 100) / 100
  };
}

function activeElementInfo() {
  const element = document.activeElement;
  if (!element) return { tagName: '', id: '', className: '' };
  return {
    tagName: element.tagName || '',
    id: element.id || '',
    className: typeof element.className === 'string' ? element.className : String(element.className || '')
  };
}

function collectDiagnosticSnapshot(eventName, extra = {}) {
  const activeElement = activeElementInfo();
  const visualViewport = window.visualViewport;
  return {
    timestamp: new Date().toISOString(),
    elapsedMs: Math.round(performance.now()),
    buildId: BUILD_ID,
    eventName,
    locationHref: location.href,
    locationHash: location.hash,
    scrollY: Math.round(window.scrollY * 100) / 100,
    documentElementScrollTop: Math.round(document.documentElement.scrollTop * 100) / 100,
    documentElementScrollHeight: document.documentElement.scrollHeight,
    bodyScrollHeight: document.body ? document.body.scrollHeight : null,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    visualViewportWidth: visualViewport ? Math.round(visualViewport.width * 100) / 100 : null,
    visualViewportHeight: visualViewport ? Math.round(visualViewport.height * 100) / 100 : null,
    visualViewportOffsetTop: visualViewport ? Math.round(visualViewport.offsetTop * 100) / 100 : null,
    historyScrollRestoration: 'scrollRestoration' in history ? history.scrollRestoration : 'unsupported',
    activeElementTagName: activeElement.tagName,
    activeElementId: activeElement.id,
    activeElementClassName: activeElement.className,
    featuredHeroRect: rectFor('.featured-hero'),
    featuredCenterRect: rectFor('.featured-center'),
    tankaLayoutRect: rectFor('.tanka-layout'),
    tankaBodyRect: rectFor('.tanka-body'),
    tankaSourceRect: rectFor('.tanka-source'),
    profileOffsetTop: document.getElementById('profile')?.offsetTop ?? null,
    worksOffsetTop: document.getElementById('works')?.offsetTop ?? null,
    missingRequiredElementIds,
    ...extra
  };
}

function renderDiagnosticPanel() {
  if (!isScrollDebug || !diagnosticPanel || !diagnosticLatest || !diagnosticEvents) return;
  const latest = diagnosticLogs[diagnosticLogs.length - 1];
  if (!latest) return;
  diagnosticLatest.textContent = [
    `build=${latest.buildId}`,
    `${latest.eventName} @ ${latest.elapsedMs}ms`,
    `scrollY=${latest.scrollY} hash=${latest.locationHash || '(none)'}`,
    `vh=${latest.innerHeight} vvH=${latest.visualViewportHeight ?? '(n/a)'}`,
    `restoration=${latest.historyScrollRestoration}`
  ].join('\n');
  diagnosticEvents.innerHTML = diagnosticLogs.slice(-8).reverse().map((entry) => (
    `<li><span>${entry.eventName}</span><code>y:${entry.scrollY} h:${entry.locationHash || '-'}</code></li>`
  )).join('');
}

function recordDiagnostic(eventName, extra = {}) {
  if (!isScrollDebug) return;
  diagnosticLogs.push(collectDiagnosticSnapshot(eventName, extra));
  if (diagnosticLogs.length > 240) diagnosticLogs.shift();
  renderDiagnosticPanel();
}

async function copyDiagnosticLogs() {
  const text = JSON.stringify(diagnosticLogs, null, 2);
  try {
    await navigator.clipboard.writeText(text);
    recordDiagnostic('copy-log-success');
  } catch (error) {
    if (diagnosticTextarea) {
      diagnosticTextarea.hidden = false;
      diagnosticTextarea.value = text;
      diagnosticTextarea.focus();
      diagnosticTextarea.select();
    }
    recordDiagnostic('copy-log-fallback', { error: error instanceof Error ? error.message : String(error) });
  }
}

function createDiagnosticPanel() {
  if (!isScrollDebug || diagnosticPanel || !document.body) return;
  diagnosticPanel = document.createElement('aside');
  diagnosticPanel.className = 'scroll-diagnostics';
  diagnosticPanel.setAttribute('aria-label', 'スクロール診断ログ');
  diagnosticPanel.innerHTML = `
    <div class="scroll-diagnostics__head">
      <strong>Scroll diagnostics</strong>
      <button class="scroll-diagnostics__copy" type="button">診断ログをコピー</button>
    </div>
    <pre class="scroll-diagnostics__latest" aria-live="polite"></pre>
    <ol class="scroll-diagnostics__events"></ol>
    <textarea class="scroll-diagnostics__textarea" hidden aria-label="手動コピー用診断ログ"></textarea>
  `;
  document.body.appendChild(diagnosticPanel);
  diagnosticLatest = diagnosticPanel.querySelector('.scroll-diagnostics__latest');
  diagnosticEvents = diagnosticPanel.querySelector('.scroll-diagnostics__events');
  diagnosticTextarea = diagnosticPanel.querySelector('.scroll-diagnostics__textarea');
  diagnosticPanel.querySelector('.scroll-diagnostics__copy')?.addEventListener('click', copyDiagnosticLogs);
  renderDiagnosticPanel();
}

scheduleInitialTopPin('script-start');
recordDiagnostic('script-start', { missingRequiredElementIds });

function sanitizeTankaHtml(html) {
  return html.replace(/<(?!\/?(ruby|rt|rp)\b)[^>]*>/g, '');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getDisplayUnits(html) {
  const template = document.createElement('template');
  template.innerHTML = sanitizeTankaHtml(html);
  const units = [];

  function pushText(text) {
    for (const char of [...text]) {
      if (!char.trim()) continue;
      units.push({ type: 'text', value: char });
    }
  }

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      pushText(node.textContent || '');
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName.toLowerCase() === 'ruby') {
      units.push({ type: 'html', value: sanitizeTankaHtml(node.outerHTML) });
      return;
    }
    Array.from(node.childNodes).forEach(walk);
  }

  Array.from(template.content.childNodes).forEach(walk);
  return units;
}

function buildFixedBreakTankaHtml(html) {
  const displayBreakUnits = getDisplayBreakUnits();
  window.__YKM_TANKA_BREAK_UNITS__ = displayBreakUnits;
  return getDisplayUnits(html).map((unit, index) => {
    const value = unit.type === 'html' ? unit.value : escapeHtml(unit.value);
    const shouldBreak = (index + 1) === displayBreakUnits;
    return shouldBreak ? `${value}<br class="tanka-break">` : value;
  }).join('');
}

async function loadJson(path, fallback) {
  try {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Failed to load ${path}. Using fallback data.`, error);
    return fallback;
  }
}

function renderWorks(books) {
  if (!worksGrid) return;
  const order = ['歌集', 'その他著書'];
  const groups = order
    .map((type) => ({ type, items: books.filter((book) => book.type === type) }))
    .filter((group) => group.items.length);
  worksGrid.innerHTML = groups.map((group) => {
    const items = group.items.map((item) => {
      const title = escapeHtml((item.title || '').replace(/^『|』$/g, ''));
      const seriesLabel = item.seriesLabel ? `<span class="work-label">${escapeHtml(item.seriesLabel)}</span>` : '';
      const collaboration = item.collaboration ? `<span class="work-collaboration">（${escapeHtml(item.collaboration)}）</span>` : '';
      const publisher = item.publisher ? `<span class="work-publisher">${escapeHtml(item.publisher)}</span>` : '';
      return `
        <li class="work-item">
          ${seriesLabel}
          <span class="work-title">『${title}』</span>
          <span class="work-meta">${collaboration}${publisher}</span>
        </li>
      `;
    }).join('');
    return `
      <article class="works-group">
        <h3>${group.type}</h3>
        <ul class="works-list">${items}</ul>
      </article>
    `;
  }).join('');
  recordDiagnostic('after-render-works');
}

function renderTankaError() {
  if (!featuredTanka) return;
  featuredTanka.innerHTML = `
    <div class="tanka-error" role="status" aria-live="polite">
      <p>短歌データを読み込めませんでした。</p>
      <p>時間をおいて再読み込みしてください。</p>
    </div>
  `;
  if (counter) counter.textContent = '';
}

function buildTankaMarkup(item) {
  return `
    <div class="tanka-layout">
      <div class="tanka-body-wrap" id="tanka-body-wrap">
        <p class="tanka-body">${buildFixedBreakTankaHtml(item.html)}</p>
      </div>
      <p class="tanka-source" id="tanka-source">${item.sourceLabel}</p>
    </div>
  `;
}

function renderTanka(index) {
  const item = tankaData[index];
  if (!featuredTanka) {
    recordDiagnostic('render-tanka-missing-featured-tanka');
    return;
  }
  if (!item) {
    renderTankaError();
    return;
  }

  featuredTanka.innerHTML = buildTankaMarkup(item);
  if (counter) counter.textContent = `現在${index + 1}首目、全${tankaData.length}首`;
  recordDiagnostic('after-render-tanka', { currentIndex: index, displayBreakUnits: getDisplayBreakUnits() });
}

function moveTanka(delta) {
  if (!tankaData.length) return;
  currentIndex = (currentIndex + delta + tankaData.length) % tankaData.length;
  renderTanka(currentIndex);
}

function maybeHandleArrowNavigation(event) {
  const target = event.target;
  const tag = target && target.tagName ? target.tagName.toLowerCase() : '';
  if (['input', 'textarea', 'select'].includes(tag) || target?.isContentEditable) return;
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveTanka(-1);
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveTanka(1);
  }
}

function openNav(forceOpen) {
  if (!navToggle || !globalNav) return;
  const next = typeof forceOpen === 'boolean' ? forceOpen : navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(next));
  navToggle.setAttribute('aria-label', next ? 'メニューを閉じる' : 'メニューを開く');
  globalNav.classList.toggle('is-open', next);
}

function showHeader() {
  siteHeader?.classList.remove('is-hidden');
  recordDiagnostic('after-header-show');
}

async function init() {
  createDiagnosticPanel();
  recordDiagnostic('before-init');
  [tankaData, booksData] = await Promise.all([
    loadJson('data/tanka.json', FALLBACK_TANKA),
    loadJson('data/books.json', FALLBACK_BOOKS)
  ]);
  recordDiagnostic('after-json-loaded', {
    tankaCount: Array.isArray(tankaData) ? tankaData.length : null,
    booksCount: Array.isArray(booksData) ? booksData.length : null
  });

  tankaData = (Array.isArray(tankaData) ? tankaData : FALLBACK_TANKA)
    .filter((item) => item.status === 'published')
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  booksData = Array.isArray(booksData) ? booksData : FALLBACK_BOOKS;

  renderWorks(booksData);

  if (!tankaData.length) {
    renderTankaError();
    return;
  }

  renderTanka(currentIndex);
  scheduleInitialTopPin('after-render-tanka');
  showHeader();
}

prevBtn?.addEventListener('click', () => moveTanka(-1));
nextBtn?.addEventListener('click', () => moveTanka(1));
navToggle?.addEventListener('click', () => openNav());
document.querySelectorAll('#global-nav a').forEach((link) => {
  link.addEventListener('click', () => openNav(false));
});

window.addEventListener('resize', () => {
  recordDiagnostic('resize');
  showHeader();
});
tankaBreakMedia.addEventListener?.('change', () => {
  if (tankaData.length) renderTanka(currentIndex);
});
window.addEventListener('orientationchange', () => recordDiagnostic('orientationchange'));
window.addEventListener('hashchange', () => recordDiagnostic('hashchange'));
window.addEventListener('load', () => recordDiagnostic('window-load'));
window.addEventListener('pageshow', (event) => {
  recordDiagnostic('pageshow', { persisted: event.persisted });
  scheduleInitialTopPin('pageshow');
  if (shouldForceTop && !location.hash) {
    window.setTimeout(() => {
      window.scrollTo(0, 0);
      recordDiagnostic('force-top-after-pageshow');
    }, 0);
  }
});
window.addEventListener('beforeunload', () => recordDiagnostic('beforeunload'));
document.addEventListener('DOMContentLoaded', () => {
  createDiagnosticPanel();
  recordDiagnostic('DOMContentLoaded');
});
document.addEventListener('keydown', maybeHandleArrowNavigation);
['scroll', 'wheel', 'mousemove', 'touchstart', 'touchmove', 'pointerdown', 'keydown'].forEach((eventName) => {
  window.addEventListener(eventName, showHeader, { passive: true });
});
window.addEventListener('scroll', () => {
  if (shouldPinCurrentLocationToTop() && isWithinInitialTopLock() && window.scrollY > 0) {
    window.requestAnimationFrame(() => pinInitialTop('scroll-restore-guard'));
  }
  if (!isScrollDebug || scrollLogTimer) return;
  scrollLogTimer = window.setTimeout(() => {
    scrollLogTimer = null;
    recordDiagnostic('scroll');
  }, 200);
}, { passive: true });
document.fonts?.ready?.then(() => recordDiagnostic('fonts-ready'));

init();
