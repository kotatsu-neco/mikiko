# v13g Safari 更新時ジャンプ診断パッチ報告

## 対象

- リポジトリ: `kotatsu-neco/mikiko`
- ローカルブランチ: `main`
- ローカル HEAD: `8a611f93638afa5dcaefd22ebba653e935237dd2`
- remote origin: `https://github.com/kotatsu-neco/mikiko.git`
- GitHub Pages 設定: ローカルファイルからは未確認
- 作業対象: GitHub `main` を正本とする想定で実施

## 現状把握

- `index.html`: `#top` の特集短歌、`#profile`、`#works`、`#timeline` などのセクションと、ハッシュリンクを持つグローバルナビで構成されています。短歌本文や出典テキストは変更していません。
- `styles.css`: 特集短歌は `100svh` のヒーロー領域内で縦書き表示され、下部に前後ボタンが固定配置されています。通常表示のデザインは変更せず、診断モード専用パネルのスタイルだけを追加しました。
- `script.js`: JSON 読み込み後に作品一覧と短歌を描画し、ヘッダー表示制御と短歌切り替えを行います。通常表示の動作は維持し、`?debugScroll=1` の場合だけ診断ログを有効化しました。

## 実装内容

- `?debugScroll=1` のときだけ、スクロール診断パネルを表示するようにしました。
- 診断ログを `window.__YKM_SCROLL_DIAGNOSTICS__` に保持し、画面上のコピーボタンから JSON として取得できるようにしました。
- クリップボードコピーに失敗した場合は、手動コピー用 textarea を表示するフォールバックを追加しました。
- `?debugScroll=1&manualRestoration=1` のときだけ `history.scrollRestoration = 'manual'` を設定します。
- `?debugScroll=1&forceTop=1` かつハッシュなしの場合だけ、`pageshow` 後にトップへ戻す診断スイッチを追加しました。
- 診断ログには、時刻、イベント名、URL/hash、スクロール位置、document/body 高さ、viewport/visualViewport、`history.scrollRestoration`、active element、主要要素の rect、`#profile`/`#works` の `offsetTop` を記録します。
- 記録イベント: `script-start`, `DOMContentLoaded`, `window-load`, `pageshow`, `before-init`, `after-json-loaded`, `after-render-works`, `after-render-poem`, `after-header-show`, `resize`, `orientationchange`, `scroll`, `hashchange`, `beforeunload`。
- 追加で、フォント読み込み完了確認用に `fonts-ready` も記録します。

## 変更ファイル

- `script.js`
- `styles.css`
- `tests/diagnostics/scroll-diagnostics.spec.js`
- `README_v13g_diagnostics.md`

既存の `playwright.config.js` は Chromium プロジェクトとローカル HTTP サーバー設定として使用しました。

## 変更していないこと

- 短歌本文
- 出典
- `data/tanka.json`
- `data/books.json`
- 通常アクセス時のデザイン
- 短歌の選定・表示順・切り替え仕様

## 静的調査で見つけた原因候補

- Safari のページ復元時に、`history.scrollRestoration` とハッシュ位置復元がヒーロー描画前後の高さ変化と競合している可能性があります。
- JSON 読み込み後に短歌本文が描画されるため、`pageshow` や初期スクロール復元のタイミングと DOM 高さの確定タイミングがずれる可能性があります。
- `100svh`、縦書き、ルビ、フォント読み込みにより、Safari で初期レイアウト確定が Chromium と異なる可能性があります。
- ヘッダー表示制御はスクロールやタッチ入力に連動しますが、今回の診断では原因確定までは行っていません。

## 確認済み

- Chromium Playwright 確認
  - 実行コマンド: `npx playwright test --project=chromium`
  - 結果: `29 passed`
- スクリーンショット確認
  - `screenshots/diag_375x667_top_v13g.png`
  - `screenshots/diag_390x844_debug_v13g.png`
  - `screenshots/diag_430x932_hash_profile_v13g.png`
  - `screenshots/diag_1366x768_debug_v13g.png`
- 確認 URL
  - `/`
  - `/?debugScroll=1`
  - `/?debugScroll=1&forceTop=1`
  - `/?debugScroll=1&manualRestoration=1`
  - `/#profile`
  - `/?debugScroll=1#profile`
- 確認 viewport
  - `375x667`
  - `390x844`
  - `430x932`
  - `1366x768`

## 未確認

- WebKit Playwright 確認
- macOS Safari 実機確認
- iPhone Safari 実機確認

`Playwright does not support webkit on mac13` は現在環境の制約として記録します。この制約の解消作業は行っていません。

## 推測と次の最小手順

今回の変更は Safari 問題の確定修正ではなく、更新時ジャンプの発生タイミングを採取するための診断パッチです。Safari 実機で次の URL を開き、再読み込みや戻る操作の直後に診断ログをコピーすると、`pageshow`、ハッシュ復元、描画完了、viewport 変化の順序を比較できます。

- `/?debugScroll=1`
- `/?debugScroll=1&manualRestoration=1`
- `/?debugScroll=1&forceTop=1`
- `/?debugScroll=1#profile`

ログ比較後、もし `manualRestoration=1` または `forceTop=1` でのみ症状が止まる場合は、その結果を根拠に Safari 限定の最小修正へ進めます。
