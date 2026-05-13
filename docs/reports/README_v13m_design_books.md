# v13m 見出し・ブランド・著作リスト調整／書影assets保管

## 変更ファイル

- `index.html`
- `styles.css`
- `script.js`
- `tests/featured-tanka.spec.js`
- `tests/diagnostics/scroll-diagnostics.spec.js`
- `assets/books/gogo_no_cho_cover.webp`
- `assets/books/toku_koirimasu_cover.webp`
- `README_v13m_design_books.md`

## 見出しをさらに弱めた方法

セクション見出しを `clamp(1.18rem, 1.75vw, 1.52rem)` まで下げ、英字アイブロウも `0.58rem`、低彩度、字間控えめにしました。見出しは読む入口として残しつつ、短歌本文・プロフィール本文・著作情報より前に出ないように調整しています。

## 著作リストをゴシック体にした方法

`.work-title` と `.work-title-line` を本文用のゴシック系 `var(--body-font)` に統一しました。書名は少しだけ太くし、種別ラベル・出版社は小さめに分けて、情報リストとして読みやすくしています。

## トップブランド表示の調整

PC幅では「横山未来子」と `YOKOYAMA Mikiko` を横並びに近いロックアップへ変更しました。漢字表記は少し太く、アルファベット表記は従の扱いです。iPhone幅では縦並びを維持し、固定ハンバーガーボタンと重なりにくい幅に抑えています。

## 『アルカリ色のくも』の共著表示

表示順を以下に変更しました。

```text
『アルカリ色のくも　宮沢賢治の青春短歌を読む』（共著） NHK出版
```

`（共著）` は書名直後に置き、出版社とは別の表示要素にしました。

## assetsに保管した書影

- `assets/books/gogo_no_cho_cover.webp`
- `assets/books/toku_koirimasu_cover.webp`

書影は素材保管のみです。トップページ、著作リスト、短歌表示エリア、背景には表示していません。`data/books.json` への画像パス追加も今回は行っていません。

## デザイン/UI観点での追加提案

今回実装した改善点は、見出しをさらに標識化し、著作リストを情報として読みやすくし、トップブランドの認識性を少し上げたことです。

追加で改善した方がよい点は、将来の著作詳細ページを作る場合に、歌集とその他著書を同じカードで並べず、書影・刊行順・出版社・紹介文を分けて読める構成にすることです。

今回あえて実装しなかった点は、2点だけの書影表示です。現時点で出すと著作一覧のバランスが崩れるため、素材保管に留めました。

書影が揃ったら、別ページの著書一覧で、刊行順の歌集タイムライン、その他著書の用途別分類、書影サイズの統一、購入先や出版社リンクの扱いを検討するとよいです。

## 変更していないもの

- 短歌本文
- 自選七首データ
- `data/tanka.json`
- 旧仮名遣い
- ルビ内容
- v13h Safariスクロール復元対策
- v13j cache bust / buildId 方針
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
38 passed (30.8s)
```

通常表示、`?debugScroll=1`、`#profile`、前の一首 / 次の一首、ハンバーガーメニュー開閉、著作リストのゴシック体、共著表示位置、書影assetsの存在、書影が画面未表示であることを確認しました。

## スクリーンショット保存先

Playwright実行時に以下を保存します。

- `screenshots/v13m_chromium_mobile_375_top.png`
- `screenshots/v13m_chromium_mobile_390_top.png`
- `screenshots/v13m_chromium_mobile_430_top.png`
- `screenshots/v13m_chromium_desktop_1366_top.png`

375x667 / 390x844 / 1366x768 は目視確認済みです。トップブランド表示とハンバーガーボタンは重ならず、短歌本文の中央基準も維持されています。

## git diff --check結果

実行済み。指摘なし。

```text
git diff --check
```

## Safari実機未確認事項

- iPhone Safariで見出しがまだ強すぎないか
- iPhone Safariで著作リストがゴシック体に見えるか
- iPhone Safariでブランド表示とハンバーガーボタンが重ならないか
- macOS Safariでトップブランド表示が自然か
- Safari実機で書影がトップページに表示されていないか

## ユーザーに確認してほしい最小項目

iPhone Safari:

1. 見出しがまだ強すぎないか。
2. 著作リストがゴシック体になっているか。
3. トップの「横山未来子」が以前より認識しやすいか。
4. ブランド表示とハンバーガーボタンが重なっていないか。
5. 『アルカリ色のくも　宮沢賢治の青春短歌を読む』（共著） NHK出版 の順で見えるか。
6. 書影がトップページに表示されていないか。
7. ハンバーガーメニュー開閉が壊れていないか。

macOS Safari:

1. 見出しがまだ強すぎないか。
2. 著作リストがゴシック体になっているか。
3. トップの「横山未来子」表示が自然か。
4. 著作表示が指定どおりか。
5. 書影がトップページに表示されていないか。
