const tankaData = [
  {
    textHtml: '胸もとに水の反照うけて立つきみの四囲より<ruby>啓<rt>ひら</rt></ruby>かるる夏',
    plainText: '胸もとに水の反照うけて立つきみの四囲より啓かるる夏',
    source: '『樹下のひとりの眠りのために』'
  },
  {
    textHtml: '逢ひしことの温度を永く保たむととざせり耳をまなこを喉を',
    plainText: '逢ひしことの温度を永く保たむととざせり耳をまなこを喉を',
    source: '『水をひらく手』'
  },
  {
    textHtml: '蜜吸ひては花のうへにて踏み替ふる蝶の脚ほそしわがまなかひに',
    plainText: '蜜吸ひては花のうへにて踏み替ふる蝶の脚ほそしわがまなかひに',
    source: '『花の線画』'
  },
  {
    textHtml: '眼をあけてゐられぬ空の下に寝むわれらの髪に蟻迷ふまで',
    plainText: '眼をあけてゐられぬ空の下に寝むわれらの髪に蟻迷ふまで',
    source: '『花の線画』'
  },
  {
    textHtml: '巻貝のかたちに我のねむるときあかるき金の雨となりて来よ',
    plainText: '巻貝のかたちに我のねむるときあかるき金の雨となりて来よ',
    source: '『金の雨』'
  },
  {
    textHtml: '永遠の午後あるごとく橋脚に水面のあかりまつはりてをり',
    plainText: '永遠の午後あるごとく橋脚に水面のあかりまつはりてをり',
    source: '『午後の蝶』'
  },
  {
    textHtml: '星に星のふるへ伝はり手のなかの万年筆をかちりと閉めつ',
    plainText: '星に星のふるへ伝はり手のなかの万年筆をかちりと閉めつ',
    source: '『とく来りませ』'
  }
];

const viewer = document.getElementById('tanka-viewer');
const prevBtn = document.getElementById('prev-tanka');
const nextBtn = document.getElementById('next-tanka');
const counter = document.getElementById('tanka-counter');
const stage = document.querySelector('.tanka-stage');
const controls = document.querySelector('.tanka-controls');
const navToggle = document.querySelector('.nav-toggle');
const globalNav = document.getElementById('global-nav');
let currentIndex = 0;
let resizeTimer = null;

function countVisibleChars(text) {
  return [...text.replace(/\s+/g, '')].length;
}

function baseFontSize(charCount, viewportWidth) {
  if (viewportWidth <= 430) {
    if (charCount >= 34) return 25;
    if (charCount >= 31) return 27;
    return 29;
  }
  if (viewportWidth <= 640) {
    if (charCount >= 34) return 28;
    if (charCount >= 31) return 30;
    return 32;
  }
  if (charCount >= 34) return 31;
  if (charCount >= 31) return 34;
  return 37;
}

function fitTanka(frame, body, source) {
  const viewportWidth = window.innerWidth;
  const charCount = countVisibleChars(body.textContent || '');
  const rubyCount = body.querySelectorAll('rt').length;
  const frameStyles = window.getComputedStyle(frame);
  const sourceWidth = source.getBoundingClientRect().width || 0;
  const gap = parseFloat(frameStyles.columnGap || frameStyles.gap || '0') || 0;
  const framePaddingTop = parseFloat(frameStyles.paddingTop || '0') || 0;
  const framePaddingBottom = parseFloat(frameStyles.paddingBottom || '0') || 0;
  const controlsHeight = controls?.getBoundingClientRect().height || 0;
  const headerHeight = stage?.querySelector('.tanka-stage-header')?.getBoundingClientRect().height || 0;
  const availableHeight = Math.max(280, viewer.clientHeight - framePaddingTop - framePaddingBottom);
  const availableWidth = Math.max(120, frame.clientWidth - sourceWidth - gap - 8);

  const minFont = viewportWidth <= 430 ? 18 : viewportWidth <= 640 ? 21 : 26;
  const maxFont = viewportWidth <= 430 ? 28 : viewportWidth <= 640 ? 31 : 38;
  let fontSize = Math.min(maxFont, Math.max(minFont, baseFontSize(charCount + rubyCount, viewportWidth)));

  body.style.setProperty('--tanka-font-size', `${fontSize}px`);

  requestAnimationFrame(() => {
    let safety = 0;
    while ((body.getBoundingClientRect().height > availableHeight || body.getBoundingClientRect().width > availableWidth) && fontSize > minFont && safety < 48) {
      fontSize -= 1;
      body.style.setProperty('--tanka-font-size', `${fontSize}px`);
      safety += 1;
    }

    while (body.getBoundingClientRect().height < availableHeight - 72 && body.getBoundingClientRect().width < availableWidth - 8 && fontSize < maxFont && safety < 96) {
      fontSize += 1;
      body.style.setProperty('--tanka-font-size', `${fontSize}px`);
      if (body.getBoundingClientRect().height > availableHeight || body.getBoundingClientRect().width > availableWidth) {
        fontSize -= 1;
        body.style.setProperty('--tanka-font-size', `${fontSize}px`);
        break;
      }
      safety += 1;
    }

    // keep the poem vertically centered without colliding with controls
    const neededStageHeight = headerHeight + controlsHeight + body.getBoundingClientRect().height + 120;
    if (stage && stage.getBoundingClientRect().height < neededStageHeight) {
      stage.style.minHeight = `${Math.ceil(neededStageHeight)}px`;
    }
  });
}

function renderTanka(index) {
  const item = tankaData[index];
  viewer.innerHTML = `
    <div class="tanka-frame">
      <div class="tanka-source">${item.source}</div>
      <div class="tanka-column-wrap">
        <p class="tanka-body">${item.textHtml}</p>
      </div>
    </div>
  `;

  counter.textContent = `${index + 1} / ${tankaData.length}`;

  const frame = viewer.querySelector('.tanka-frame');
  const body = viewer.querySelector('.tanka-body');
  const source = viewer.querySelector('.tanka-source');
  fitTanka(frame, body, source);
}

function moveTanka(direction) {
  currentIndex = (currentIndex + direction + tankaData.length) % tankaData.length;
  renderTanka(currentIndex);
}

prevBtn?.addEventListener('click', () => moveTanka(-1));
nextBtn?.addEventListener('click', () => moveTanka(1));

window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => renderTanka(currentIndex), 120);
});

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  globalNav?.classList.toggle('is-open');
});

document.querySelectorAll('#global-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    globalNav?.classList.remove('is-open');
  });
});

renderTanka(currentIndex);
