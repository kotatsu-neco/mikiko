# v13n 共通左端ライン・ブランド強化・著作カード整列・PC版書影サムネイル表示

## 変更ファイル

- `index.html`
- `styles.css`
- `script.js`
- `data/books.json`
- `tests/featured-tanka.spec.js`
- `tests/diagnostics/scroll-diagnostics.spec.js`
- `README_v13n_layout_books.md`

## 共通左端ライン

`--site-width` を `min(1120px, calc(100vw - 32px))` に統一し、`.header-inner` と `.section` が同じ幅を使うようにしました。`.section-heading.center` は左揃え扱いにし、`.section-heading.narrow` も左端をレールに置くよう変更しています。

短歌本文は従来どおり `.tanka-layout` / `.tanka-body` の中央基準を維持しています。短歌本文は左揃えにしていません。

## トップブランド表示

`.brand-ja` を `clamp(1.16rem, 1.75vw, 1.34rem)`、やや太めにし、漢字表記を公式サイト名として認識しやすくしました。PC幅では `YOKOYAMA Mikiko` を近接した横並びにし、iPhone幅では縦並びを維持しています。

## セクション見出し

見出しは左揃え、小さめ、中太の入口表示にしました。英字アイブロウはさらに控えめにし、見出し自体ではなく本文・著作情報へ視線が流れるようにしています。

## 著作カード

「歌集」「その他著書」のグループ幅をPC版で均等2カラムにしました。各著作は同じカード構造にし、書名・種別・出版社の階層をゴシック体で整理しています。スマホ幅では1カラムです。

## PC版書影サムネイル

`data/books.json` に以下を追加しました。

- 『午後の蝶』: `assets/books/gogo_no_cho_cover.webp`
- 『とく来りませ』: `assets/books/toku_koirimasu_cover.webp`

PC版では該当カードの書名右側に `82px` 幅の控えめなサムネイルを表示します。`object-fit: contain` で表紙全体が見えるようにし、alt は以下です。

- `『午後の蝶』書影`
- `『とく来りませ』書影`

スマホ版では `.work-cover { display: none; }` にしており、トップページには書影を表示しません。

## 文字階層

短歌本文は明朝体の特別扱いを維持し、それ以外は基本ゴシック体です。ブランド、セクション見出し、グループ見出し、著作タイトル、出版社でサイズと太さを分け、のっぺり感を減らしています。

## 変更していないもの

- 短歌本文
- 出典
- 自選七首データ
- `data/tanka.json`
- 旧仮名遣い
- ルビ内容
- v13h Safariスクロール復元対策
- v13j キャッシュ対策の方針
- v13i tanka用語統一
- v13k2 短歌本文中央基準
- v13l 固定ハンバーガーメニューの基本挙動
- メニュー開閉時の三本線 / × 切替
- `aria-expanded` / `aria-label`
- 前の一首 / 次の一首の基本挙動

## Chromium Playwright結果

実行済み。

```text
PATH=/usr/local/bin:$PATH npx playwright test --project=chromium
39 passed (32.8s)
```

通常表示、`?debugScroll=1`、`#profile`、前の一首 / 次の一首、ハンバーガーメニュー開閉、左端レール、著作グループ幅、PC版書影表示、スマホ版書影非表示、書影altを確認しました。

## スクリーンショット保存先

Playwright実行時に以下を保存します。

- `screenshots/v13n_chromium_mobile_375_top.png`
- `screenshots/v13n_chromium_mobile_390_top.png`
- `screenshots/v13n_chromium_mobile_430_top.png`
- `screenshots/v13n_chromium_desktop_1366_top.png`

375x667 / 390x844 / 1366x768 は目視確認済みです。ブランド表示とハンバーガーボタンは重ならず、短歌本文の中央基準も維持されています。

## git diff --check結果

実行済み。指摘なし。

```text
git diff --check
```

## Safari実機未確認事項

- macOS Safariでトップブランド左端と各セクション見出し左端が揃って見えるか
- macOS Safariで書影サムネイルが控えめに見えるか
- iPhone Safariでブランド表示と固定ハンバーガーボタンが重ならないか
- iPhone Safariでスマホ版書影が表示されていないか

## ユーザーに確認してほしい最小項目

macOS Safari:

1. トップの「横山未来子」が以前より認識しやすいか。
2. トップの「横山未来子」の左端と、各セクション見出しの左端が揃って見えるか。
3. 「歌集・著書」のカラム幅が揃って見えるか。
4. PC版で『午後の蝶』『とく来りませ』の書影が書名右側に控えめに表示されるか。
5. 見出し・著作タイトル・出版社などに文字階層があり、のっぺり感が減っているか。
6. 短歌本文の中央表示が悪化していないか。
7. メニュー開閉が壊れていないか。

iPhone Safari:

1. ブランド表示とハンバーガーボタンが重なっていないか。
2. 見出しが左揃えで不自然に見えないか。
3. スマホ版で書影が表示されていないか。
4. 著作リストが読みやすいか。
5. 短歌本文の中央表示・前後ボタン・メニュー開閉が壊れていないか。
