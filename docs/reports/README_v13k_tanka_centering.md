# v13k 短歌本文中央揃え・iPhone表示調整・メニュー開閉ボタン改善

## 変更ファイル

- `index.html`
- `styles.css`
- `script.js`
- `tests/featured-tanka.spec.js`
- `tests/diagnostics/scroll-diagnostics.spec.js`
- `README_v13k_tanka_centering.md`

## 中央ズレの原因仮説

Safari で `.tanka-layout` の `width: fit-content`、`display: flex`、`flex-direction: row-reverse`、縦書き本文、ルビが組み合わさり、親要素の幅計算と実際の描画範囲にずれが出ていた可能性が高いと判断しました。以前の診断でも、本文の実描画矩形が layout の想定幅から外側へ出る傾向がありました。

## 採用したCSS方針

- `.tanka-layout` を `fit-content + flex row-reverse` から `display: grid` に変更しました。
- grid は `grid-template-areas: "source body spacer"` とし、短歌本文の左右に同じ幅の余白カラムを置きました。
- `.tanka-layout` に `--tanka-layout-width` を持たせ、短歌本文そのものを中央配置の基準にしました。
- `.tanka-body-wrap` は `grid-area: body`、`.tanka-source` は `grid-area: source` として、出典が本文の左側にあり、下端が揃う構造を維持しました。
- `.tanka-body` は `width: max-content` とし、本文の実描画幅を layout 計算に反映しやすくしました。
- 出典は左側の余白カラムへ置き、短歌本文の横中央位置に影響しない「おまけ」として扱います。

## 変更前後の扱い

- 変更前
  - `.tanka-layout`: `width: fit-content`
  - `.tanka-layout`: `display: flex`
  - `.tanka-layout`: `flex-direction: row-reverse`
  - 本文と出典の実描画幅が Safari で親の幅計算から外れやすい構造
- 変更後
  - `.tanka-layout`: `width: var(--tanka-layout-width)`
  - `.tanka-layout`: `display: grid`
  - `.tanka-layout`: `grid-template-columns: minmax(0, 1fr) max-content minmax(0, 1fr)`
  - `.tanka-body-wrap`: `grid-area: body`
  - `.tanka-source`: `grid-area: source`
  - `tanka-bodyRect` の中心が viewport の横中央に近いことを Playwright で確認
  - `tanka-bodyRect` / `tanka-sourceRect` が `tankaLayoutRect` から大きくはみ出さないことを Playwright で確認

## iPhoneで3列化して見える問題への対応方針

本文データや出典は変更せず、固定改行位置を `16` 表示単位に戻しました。句切れ推測ではなく、表示単位ベースの固定改行方針は維持しています。

一度 `22` 表示単位を試しましたが、iPhone幅では長い列が高さ制約に当たり、短歌本文そのものが3列に見える可能性がありました。今回の修正では短歌本文を明示的に2列へ戻し、あわせてモバイル時の文字サイズ、行高、字間、出典サイズを少し抑えました。

## ハンバーガーメニューボタン

- 閉状態では従来どおり三本線を表示します。
- 開状態では同じ `.nav-toggle` 内の3本線をCSS transformで「×」表示へ変化させます。
- ボタンの大きさ、位置、丸い外形は維持しました。
- `prefers-reduced-motion: reduce` では transition を無効化しています。
- 参考URL `https://honokatanka.com/` はテキスト取得のみ確認しました。実ブラウザでの視覚確認は未実施です。

## aria-expanded / aria-label

- 閉状態
  - `aria-expanded="false"`
  - `aria-label="メニューを開く"`
- 開状態
  - `aria-expanded="true"`
  - `aria-label="メニューを閉じる"`

JS の `openNav()` で、開閉状態と `aria-label` が同時に更新されるようにしました。

## Chromium Playwright結果

- 実行コマンド: `PATH=/usr/local/bin:$PATH npx playwright test --project=chromium`
- 結果: `35 passed`

確認した主な内容:

- 通常表示で短歌本文が表示される
- `?debugScroll=1` 診断機能が壊れていない
- `tankaLayoutRect`, `tankaBodyRect`, `tankaSourceRect` を取得できる
- `tankaBodyRect` と `tankaSourceRect` が `tankaLayoutRect` から大きく外へはみ出していない
- 出典を除いた `tankaBodyRect` の中心が画面中央に近い
- 375x667 / 390x844 / 430x932 / 1366x768 を含む viewport で表示確認
- 390x844 でモバイル改行単位が `16` になっている
- 390x844 で短歌本文が2列相当の幅に収まる
- 前の一首 / 次の一首 が動く
- メニュー閉状態は三本線
- メニュー開状態は「×」へ変化
- `aria-expanded` と `aria-label` が開閉に合わせて変化

## スクリーンショット保存先

- `screenshots/v13k_chromium_mobile_375_top.png`
- `screenshots/v13k_chromium_mobile_390_top.png`
- `screenshots/v13k_chromium_mobile_430_top.png`
- `screenshots/v13k_chromium_desktop_1366_top.png`

## git diff --check結果

- 問題なし

## 変更していないもの

- 短歌本文
- 出典
- `data/tanka.json`
- 自選七首データ
- 旧仮名遣い
- ルビ内容
- v13h Safariスクロール復元対策
- `?debugScroll=1` 診断機能
- manualRestoration / forceTop 診断スイッチ
- 前の一首 / 次の一首 の基本挙動
- tanka用語統一

## Safari実機未確認事項

- iPhone Safari で出典を除いた短歌本文が画面中央に見えるか
- iPhone Safari で短歌本文そのものが3列化して見えないか
- macOS Safari で既存の見え方が悪化していないか
- macOS Safari / iPhone Safari でメニュー開閉ボタンが三本線 / × として自然に切り替わるか
- WebKit Playwright 確認

## ユーザー実機確認用の最小項目

iPhone Safariで見ること:

1. 出典を除いた短歌本文が画面中央に見えるか。
2. 短歌本文そのものが不自然な3列に見えないか。
3. 前の一首 / 次の一首 が動くか。
4. メニューを開くと右上ボタンが「×」になるか。
5. 「×」を押すとメニューが閉じ、三本線に戻るか。

macOS Safariで見ること:

1. 出典を除いた短歌本文が画面中央に見えるか。
2. 既存の見え方が悪化していないか。
3. メニュー開閉ボタンが三本線 / × で切り替わるか。
