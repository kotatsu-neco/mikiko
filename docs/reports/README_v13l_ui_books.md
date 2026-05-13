# v13l 見出し調整・ファーストビュー位置調整・固定メニュー整理・著作表記修正

## 変更ファイル

- `index.html`
- `styles.css`
- `script.js`
- `data/books.json`
- `tests/featured-tanka.spec.js`
- `tests/diagnostics/scroll-diagnostics.spec.js`
- `README_v13l_ui_books.md`

## 見出しサイズ調整

セクション見出しを `clamp(1.32rem, 2.1vw, 1.85rem)` へ下げ、英字アイブロウも小さめ、低彩度、letter-spacing 控えめにしました。見出しは入口の目印に留め、プロフィール本文・著作情報へ視線が移るようにしています。

## iPhoneファーストビュー調整

640px以下で `.featured-tanka` を `translateY(32px)` し、短歌本文を少し下げました。あわせて操作ボタン側の上余白を抑え、短歌本文と前の一首 / 次の一首の間隔が過剰にならないようにしています。v13k2の「短歌本文そのものを画面横中央に置く」方針は維持しています。

## ブランド表示と固定メニュー

ブランド表示は `.site-header` 内でトップの一部として表示し、スクロール追従させない扱いにしました。モバイル / タブレット幅の `.nav-toggle` は `position: fixed` で右上に残るようにし、スクロール後もメニューを開けます。メニュー開状態の三本線 / × 切替、`aria-expanded`、`aria-label` の整合は維持しています。

## コンテンツの引き付け方

カードの角丸と影を抑え、プロフィール本文と著作情報の余白・罫線・テキスト階層を調整しました。装飾を増やさず、本文と著作情報の読みやすさを少し前に出しています。

## 著作表示

`data/books.json` をユーザー指定に合わせて更新しました。

- 歌集: 第一歌集から第六歌集までの順序ラベルを追加
- 出版社: 短歌研究社、青磁社、ふらんす堂、砂子屋書房を表示
- その他著書: 4点を「その他著書」に統合
- 共著表記: 『アルカリ色のくも　宮沢賢治の青春短歌を読む』のみ `（共著）`
- `セレクション歌人 30横山未来子集` と `アルカリ色のくも　宮沢賢治の青春短歌を読む` は指定どおりの空白で登録

## 変更していないもの

- 短歌本文
- 自選七首データ
- `data/tanka.json`
- 旧仮名遣い
- ルビ内容
- v13h Safariスクロール復元対策
- v13jのbuildId / cache bust方針
- v13i tanka用語統一
- v13k2 短歌本文中央基準
- 前の一首 / 次の一首の基本挙動
- debugScroll診断、ログコピー、manualRestoration / forceTop

## Chromium Playwright結果

実行済み。

```text
PATH=/usr/local/bin:$PATH npx playwright test --project=chromium
37 passed (25.8s)
```

通常URL、`?debugScroll=1`、`#profile`、前の一首 / 次の一首、固定メニュー、三本線 / × 切替、`aria-expanded` / `aria-label`、著作表示を確認しました。

## スクリーンショット保存先

Playwright実行時に以下を保存します。

- `screenshots/v13l_chromium_mobile_375_top.png`
- `screenshots/v13l_chromium_mobile_390_top.png`
- `screenshots/v13l_chromium_mobile_430_top.png`
- `screenshots/v13l_chromium_desktop_1366_top.png`

375x667 / 390x844 / 1366x768 は目視確認済みです。短歌本文の横中央基準、本文2列表示、ボタンとの非重なりを確認しました。

## git diff --check結果

実行済み。指摘なし。

```text
git diff --check
```

## Safari実機未確認事項

- iPhone Safariで短歌本文が上に寄りすぎず、ボタンとの間隔が自然か
- iPhone Safariでスクロール後もメニューを開けるか
- macOS Safariで短歌本文の中央表示が悪化していないか
- Safari実機で著作表示が指定どおり見えるか

## ユーザーに確認してほしい最小項目

iPhone Safari:

1. 短歌本文が画面上部に寄りすぎず、少し下がって見えるか。
2. 前の一首 / 次の一首 と短歌本文の間隔が自然か。
3. ハンバーガーメニューがスクロール後も開けるか。
4. メニューを開くと右上ボタンが × になるか。
5. × を押すと閉じて三本線に戻るか。
6. セクション見出しが強すぎないか。
7. 著作情報が指定どおり表示されているか。

macOS Safari:

1. 短歌本文の中央表示が悪化していないか。
2. ブランド表示とメニューの見え方が自然か。
3. セクション見出しが強すぎないか。
4. 著作情報が指定どおり表示されているか。
