# v13n rev3 共通左端ライン・著作カード・書影・外部リンク調整

## 変更ファイル

- `index.html`
- `styles.css`
- `script.js`
- `data/books.json`
- `tests/featured-tanka.spec.js`
- `tests/diagnostics/scroll-diagnostics.spec.js`
- `assets/books/*.webp`
- `README_v13n_layout_books.md`

## 追加・差し替えした書影

今回同梱の書影を正として使用しました。

- `assets/books/alkali_iro_no_kumo_cover.webp`
- `assets/books/gogo_no_cho_cover.webp`
- `assets/books/hajimete_no_yasashii_tanka_cover.webp`
- `assets/books/hana_no_senga_cover.webp`
- `assets/books/ichiban_yasashii_tanka_cover.webp`
- `assets/books/kin_no_ame_cover.webp`
- `assets/books/toku_kitarimase_cover.webp`

『とく来りませ』は `toku_kitarimase_cover.webp` に変更し、`data/books.json` とフォールバックデータから旧 `toku_koirimasu_cover.webp` 参照を外しました。

## 実装内容

`--content-rail` を追加し、`.header-inner` と `.section` を同じ幅に揃えました。トップブランドの左端と、プロフィール、歌集・著書、はじめての方へ、お知らせ、お問い合わせの見出し左端が同じレールに乗ります。短歌本文は従来どおり `.tanka-layout` / `.tanka-body` の画面中央基準を維持しています。

トップブランドは漢字表記を 1.28rem / 700 にし、英字表記は補助として近接配置しました。スマホ幅では縦並びを維持し、固定ハンバーガーボタンと重ならない幅にしています。

セクション見出しは左揃え、小さめ、中太に統一しました。英字アイブロウは控えめにし、著作タイトル、種別、出版社のサイズと太さに差を付けて、短歌本文以外はゴシック体の階層で整理しています。

著作カードは「歌集」「その他著書」のグループを縦に分け、PCでは歌集3カラム、その他著書2カラムの明確なgridにしました。スマホ幅では1カラムです。

PC版のみ書影サムネイルをカード右側に表示します。サムネイルは 84px 幅、`object-fit: contain` で表紙全体が見えるようにし、各画像に `『タイトル』書影` のaltを設定しました。スマホ版では `.work-cover-button` / `.work-cover` を非表示にしています。

書影クリックで控えめなライトボックスを開く実装を `script.js` に追加しました。背景クリック、閉じるボタン、Escキーで閉じられます。外部ライブラリは追加していません。

お問い合わせは「マネジメント窓口」に統一し、「学校・講演関連」の独立区分を削除しました。外部リンクはお問い合わせセクション内に Instagram / X / 心の花 として追加し、`target="_blank"` と `rel="noopener noreferrer"` を付けています。Instagram / X はリンク遷移のみで、最新投稿表示・埋め込み・API連携は未実装です。

CSS/JSのクエリとbuildIdは以下に更新しました。

- `styles.css?v=20260513-v13n-rev3`
- `script.js?v=20260513-v13n-rev3`
- `v13n-rev3-layout-books-20260513`

## 変更していないもの

- 短歌本文
- 出典
- 自選七首データ
- `data/tanka.json`
- 旧仮名遣い
- ルビ内容
- Safariスクロール復元対策
- キャッシュ対策の方針
- tanka用語統一
- 短歌本文中央基準
- 固定ハンバーガーメニューの基本挙動
- メニュー開閉時の三本線 / × 切替
- `aria-expanded` / `aria-label`
- 前の一首 / 次の一首の基本挙動
- `?debugScroll=1` 診断機能

## Chromium Playwright結果

実行済み。

```text
npx playwright test --project=chromium
39 passed (34.6s)
```

通常表示、`?debugScroll=1`、`#profile`、前の一首 / 次の一首、ハンバーガーメニュー開閉、左端レール、著作カラム幅、PC版書影表示、書影クリック拡大、スマホ版書影非表示、外部リンク、問い合わせ表記を確認しました。

## スクリーンショット保存先

Playwrightで以下を保存しました。

- `screenshots/v13n_chromium_mobile_375_top.png`
- `screenshots/v13n_chromium_mobile_390_top.png`
- `screenshots/v13n_chromium_mobile_430_top.png`
- `screenshots/v13n_chromium_desktop_1366_top.png`

診断確認用:

- `screenshots/diag_375x667_top_v13g.png`
- `screenshots/diag_390x844_debug_v13g.png`
- `screenshots/diag_430x932_hash_profile_v13g.png`
- `screenshots/diag_1366x768_debug_v13g.png`

## git diff --check結果

実行済み。指摘なし。

```text
git diff --check
```

## Safari実機未確認事項

- macOS Safariでトップブランド左端と各セクション見出し左端が揃って見えるか
- macOS Safariで対象書影が控えめに表示されるか
- macOS Safariで書影クリック拡大が自然に見えるか
- iPhone Safariでブランド表示と固定ハンバーガーボタンが重ならないか
- iPhone Safariでスマホ版書影が表示されていないか

## ユーザーに確認してほしい最小項目

macOS Safari:

1. トップの「横山未来子」が以前より認識しやすいか。
2. トップの「横山未来子」の左端と、各セクション見出しの左端が揃って見えるか。
3. 「歌集・著書」のカラム幅が揃って見えるか。
4. PC版で対象書影が書名右側に控えめに表示されるか。
5. 書影クリックでタイトルが判別できる程度に拡大表示されるか。
6. Instagram / X / 心の花 へのリンクが自然な位置にあるか。
7. お問い合わせが「マネジメント窓口」に統一されているか。
8. 短歌本文の中央表示とメニュー開閉が壊れていないか。

iPhone Safari:

1. ブランド表示とハンバーガーボタンが重なっていないか。
2. 見出しが左揃えで不自然に見えないか。
3. スマホ版で書影が表示されていないか。
4. 著作リストが読みやすいか。
5. Instagram / X / 心の花 へのリンクが自然な位置にあるか。
6. お問い合わせが「マネジメント窓口」に統一されているか。
7. 短歌本文の中央表示・前後ボタン・メニュー開閉が壊れていないか。
