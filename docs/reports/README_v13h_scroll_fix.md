# v13h Safari 更新時ジャンプ対策報告

## 実装内容

- 通常表示でも `script.js` の実行開始直後に `history.scrollRestoration = 'manual'` を設定しました。
- 初期URLが hash なし、または `#top` の場合だけ、初期表示をトップへ固定する処理を追加しました。
- Safari の遅延スクロール復元を想定し、初期表示直後の短時間だけ `pageshow`、描画後、scroll event に対してトップ固定を補強しています。
- `#profile`, `#works`, `#beginners`, `#news`, `#contact` など、明示的な hash 付きURLではトップ固定を行わず、アンカー移動を妨げない方針にしています。
- `?debugScroll=1` 診断パネル、ログコピー、`manualRestoration=1`、`forceTop=1` の診断スイッチは残しました。

## 変更ファイル

- `script.js`
- `tests/diagnostics/scroll-diagnostics.spec.js`
- `README_v13h_scroll_fix.md`

## 変更していないこと

- 短歌本文
- 出典
- 自選七首データ
- `data/tanka.json`
- `data/books.json`
- デザイン、配色、縦書きレイアウトの大幅変更

## 確認済み

- Chromium Playwright 確認
  - 実行コマンド: `PATH=/usr/local/bin:$PATH npx playwright test --project=chromium`
  - 結果: `31 passed`
- 通常URLで診断パネルが出ないこと
- 通常URLで `history.scrollRestoration` が `manual` になること
- 通常URLで一度スクロールした後に reload してもトップへ戻ること
- `?debugScroll=1` の診断パネルとログコピーが引き続き動くこと
- `?debugScroll=1&manualRestoration=1` が引き続き動くこと
- `?debugScroll=1&forceTop=1` が引き続き動くこと
- `/#profile` および `/?debugScroll=1#profile` でプロフィール位置へ移動できること
- 既存の短歌表示安定テストが通ること
- `git diff --check`

## 未確認

- macOS Safari 実機での更新時ジャンプ解消
- iPhone Safari 実機での更新時ジャンプ解消
- WebKit Playwright 確認

`Playwright does not support webkit on mac13` は環境制約として扱い、WebKit Playwright は実行していません。

## 推測

実機ログでは hash なしURLで `locationHash` は空、`after-render-tanka` 後も `scrollY` は `0` のまま、その後の scroll event で `scrollY: 2135` に移動していました。また `?debugScroll=1&manualRestoration=1` では更新後トップ表示で安定していたため、主因は Safari / ブラウザのスクロール位置復元と判断しています。

今回の実装は、その判断に基づき `history.scrollRestoration = 'manual'` を通常表示にも適用し、hash なしまたは `#top` の初期表示だけをトップ固定するものです。

## 後続確認対象

- iPhone Safari 実機で、通常URLを中段までスクロール後に更新してトップに留まること
- iPhone Safari 実機で、`#profile` 付きURLがプロフィールへ移動すること
- iPhone Safari 実機で、`?debugScroll=1` の診断ログが取得できること
- macOS Safari 実機で同じ確認を行うこと
- 実機確認後、診断パネルと診断スイッチをいつ削除するか判断すること

iPhone Safari 実機確認はユーザー側確認待ちです。
