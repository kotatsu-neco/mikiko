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
  { id: 'jukano_hitori_no_nemuri', title: '樹下のひとりの眠りのために', type: '歌集', year: '', publisher: '', purchaseUrl: '', description: '' },
  { id: 'mizuwo_hiraku_te', title: '水をひらく手', type: '歌集', year: '', publisher: '', purchaseUrl: '', description: '' },
  { id: 'hanano_senga', title: '花の線画', type: '歌集', year: '', publisher: '', purchaseUrl: '', description: '' },
  { id: 'kinno_ame', title: '金の雨', type: '歌集', year: '', publisher: '', purchaseUrl: '', description: '' },
  { id: 'gogo_no_cho', title: '午後の蝶', type: '歌集', year: '', publisher: '', purchaseUrl: '', description: '' },
  { id: 'toku_koirimasu', title: 'とく来りませ', type: '歌集', year: '', publisher: '', purchaseUrl: '', description: '' },
  { id: 'selection_kajin_30', title: 'セレクション歌人30 横山未来子集', type: '歌文集', year: '', publisher: '', purchaseUrl: '', description: '' },
  { id: 'hajimete_no_yasashii_tanka', title: 'はじめてのやさしい短歌のつくりかた', type: '著書', year: '', publisher: '', purchaseUrl: '', description: '' },
  { id: 'ichiban_yasashii_tanka', title: 'のんびり読んで、すんなり身につく　いちばんやさしい短歌', type: '著書', year: '', publisher: '', purchaseUrl: '', description: '' }
];

const featuredPoem = document.getElementById('featured-poem');
const worksGrid = document.getElementById('works-grid');
const prevBtn = document.getElementById('prev-tanka');
const nextBtn = document.getElementById('next-tanka');
const counter = document.getElementById('tanka-counter');
const navToggle = document.querySelector('.nav-toggle');
const globalNav = document.getElementById('global-nav');
const siteHeader = document.getElementById('site-header');

let tankaData = [];
let booksData = [];
let currentIndex = 0;
let headerTimer = null;
const headerHideDelay = 2400;

function sanitizePoemHtml(html) {
  return html.replace(/<(?!\/?(ruby|rt|rp)\b)[^>]*>/g, '');
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
  const order = ['歌集', '歌文集', '著書'];
  const groups = order.map((type) => ({ type, items: books.filter((book) => book.type === type) }));
  worksGrid.innerHTML = groups.map((group) => {
    const items = group.items.map((item) => `<li>${item.title ? `『${item.title.replace(/^『|』$/g, '')}』` : ''}</li>`).join('');
    return `
      <article class="works-group">
        <h3>${group.type}</h3>
        <ul>${items}</ul>
      </article>
    `;
  }).join('');
}

function renderPoemError() {
  featuredPoem.innerHTML = `
    <div class="poem-error" role="status" aria-live="polite">
      <p>短歌データを読み込めませんでした。</p>
      <p>時間をおいて再読み込みしてください。</p>
    </div>
  `;
  if (counter) counter.textContent = '';
}

function buildPoemMarkup(item) {
  return `
    <div class="poem-layout">
      <div class="poem-body-wrap" id="poem-body-wrap">
        <p class="poem-body">${sanitizePoemHtml(item.html)}</p>
      </div>
      <p class="poem-source" id="poem-source">${item.sourceLabel}</p>
    </div>
  `;
}

function renderPoem(index) {
  const item = tankaData[index];
  if (!item) {
    renderPoemError();
    return;
  }

  featuredPoem.innerHTML = buildPoemMarkup(item);
  if (counter) counter.textContent = `${index + 1} / ${tankaData.length}`;
}

function movePoem(delta) {
  if (!tankaData.length) return;
  currentIndex = (currentIndex + delta + tankaData.length) % tankaData.length;
  renderPoem(currentIndex);
}

function maybeHandleArrowNavigation(event) {
  const target = event.target;
  const tag = target && target.tagName ? target.tagName.toLowerCase() : '';
  if (['input', 'textarea', 'select'].includes(tag) || target?.isContentEditable) return;
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    movePoem(-1);
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    movePoem(1);
  }
}

function openNav(forceOpen) {
  if (!navToggle || !globalNav) return;
  const next = typeof forceOpen === 'boolean' ? forceOpen : navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(next));
  globalNav.classList.toggle('is-open', next);
}

function showHeader() {
  siteHeader?.classList.remove('is-hidden');
  if (headerTimer) window.clearTimeout(headerTimer);
  headerTimer = window.setTimeout(() => {
    if (window.scrollY < window.innerHeight * 0.9 && navToggle?.getAttribute('aria-expanded') !== 'true') {
      siteHeader?.classList.add('is-hidden');
    }
  }, headerHideDelay);
}

async function init() {
  [tankaData, booksData] = await Promise.all([
    loadJson('data/tanka.json', FALLBACK_TANKA),
    loadJson('data/books.json', FALLBACK_BOOKS)
  ]);

  tankaData = (Array.isArray(tankaData) ? tankaData : FALLBACK_TANKA)
    .filter((item) => item.status === 'published')
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  booksData = Array.isArray(booksData) ? booksData : FALLBACK_BOOKS;

  renderWorks(booksData);

  if (!tankaData.length) {
    renderPoemError();
    return;
  }

  renderPoem(currentIndex);
  showHeader();
}

prevBtn?.addEventListener('click', () => movePoem(-1));
nextBtn?.addEventListener('click', () => movePoem(1));
navToggle?.addEventListener('click', () => openNav());
document.querySelectorAll('#global-nav a').forEach((link) => {
  link.addEventListener('click', () => openNav(false));
});

window.addEventListener('resize', () => {
  showHeader();
});
document.addEventListener('keydown', maybeHandleArrowNavigation);
['scroll', 'wheel', 'mousemove', 'touchstart', 'touchmove', 'pointerdown', 'keydown'].forEach((eventName) => {
  window.addEventListener(eventName, showHeader, { passive: true });
});

init();
