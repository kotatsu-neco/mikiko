## 原因

PC版ファーストビューの表示崩れは、逐字表示のために短歌本文を1文字ごとの `span.tanka-unit` に分割し、`.tanka-body` と各文字単位を flex 要素として扱っていたことが主因です。

このため、本文に指定した `writing-mode: vertical-rl` の自然な縦書き組版ではなく、flex 子要素として文字が配置され、短歌本文が縦書きとして成立しない状態になっていました。

また、出典は JavaScript で本文の実寸を測って `position: absolute` の `left/top` を計算していました。逐字span化後の実寸や viewport 差分の影響を受けやすく、本文と出典が一体の短歌表示グループとして中央に見えない原因になっていました。

## 修正内容

- `index.html`
  - ファーストビュー上の可視見出し「自選短歌」を削除しました。
  - 構造上の `h1` と `h2` は `visually-hidden` で保持しました。
  - `1/7` の視覚表示を削除し、現在位置はスクリーンリーダー向けの `aria-live` テキストだけに残しました。

- `styles.css`
  - `.tanka-body` を通常の縦書き本文に戻し、`writing-mode: vertical-rl`、`text-orientation: mixed`、`line-height`、`letter-spacing` を指定しました。
  - 本文と出典を同じ `.tanka-layout` 内の表示グループとして扱い、グループ自体を中央配置するため `width: fit-content` と中央配置の flex レイアウトに変更しました。
  - `.tanka-layout` は `flex-direction: row-reverse`、`align-items: flex-end` とし、出典が本文の左側に出つつ、本文下端と出典下端が揃う構造にしました。
  - ヘッダーは固定フロートをやめ、透明・小さめ・影なしの absolute 配置にして、短歌鑑賞の邪魔にならないよう弱めました。

- `script.js`
  - 逐字表示用の文字分割、タイマー、クリックで全文表示する処理を削除しました。
  - `data/tanka.json` の `html` を安全化し、`ruby` を含む静的HTMLとして描画する方式へ戻しました。
  - 折り返しは CSS 任せにせず、表示単位に分解して16表示文字で `<br>` を挿入する方式にしました。
  - ルビ付き文字は親文字＋ルビを1表示単位として扱い、HTMLタグ文字列の長さや `rt` の文字数では数えていません。

- `playwright.config.js` / `tests/featured-tanka.spec.js`
  - Chromium専用のPlaywright確認を追加しました。
  - 390 x 844 / 430 x 932 / 1366 x 768 / 1440 x 900 / 1920 x 1080 を確認対象にしました。
  - 各viewportで全7首を巡回し、中央配置、`1/7` 非表示、本文と出典の下端揃え、縦書き、ボタン重なり、1画面内の収まりを確認します。

## 逐字表示の扱い

今回は無効化しました。

既存の逐字表示は、短歌本文を1文字ごとの flex 要素に変換して縦書きとルビを壊していたためです。今回の優先順位は演出より可読性なので、静的な縦書き表示を安定させることを優先しました。

## ヘッダー/見出しの扱い

ファーストビュー上の「自選短歌」「自選七首」系の可視見出しは削除しました。

アクセシビリティ上の構造見出しとして、`横山未来子 公式ウェブサイト` と `自選短歌` は `visually-hidden` で保持しています。

ヘッダーは fixed の浮遊ピルではなく、透明・小さめ・影なしの absolute 配置にしました。初期表示後は既存の自動非表示処理でさらに弱まります。

## 音数と表示文字数

短歌は三十一文字ではなく三十一音です。五・七・五・七・七も文字数ではなく音数です。

ただし今回のUI修正で扱ったのは、短歌の音数ではなく、表示文字数・ルビ込み描画サイズ・縦書き時の表示領域です。レイアウト調整や折り返し位置は音数では決めていません。

## 折り返し方針

折り返しは「固定表示文字数基準」を採用しました。

句切れ基準ではありません。短歌の句切れを推測して不規則に切ることを避けるため、描画時に本文を表示単位へ分解し、16表示文字で明示的に折り返しています。

ルビ付き文字は、親文字とルビをまとめて1表示単位として数えます。HTMLタグの文字列長、`rt` の文字数、音数は折り返し計算に使っていません。

## 下端揃え

本文と出典は同じ `.tanka-layout` の中に置き、縦書きの本文を右、出典を左に並べています。

`.tanka-layout` は `align-items: flex-end` を使うため、本文の最下端と出典の最下端が同じ表示グループ内で揃う構造です。出典だけを絶対配置で後から動かす処理は削除しました。

## 確認済み

- 静的確認
  - `index.html` / `styles.css` / `script.js` の構造を確認しました。
  - `data/tanka.json` / `data/books.json` は維持し、短歌本文・出典は変更していません。
  - 短歌本文はHTML直書きに戻さず、JSONから読み込む構造を維持しています。
  - `data/tanka.json` / `data/books.json` は `python3 -m json.tool` でJSONとして妥当であることを確認しました。
  - 旧逐字表示用の `tanka-unit` / `data-animating` / `startTankaAnimation` は現行コードからなくなっています。

- ローカルサーバー確認
  - `python3 -m http.server 8000` を起動しました。
  - `http://127.0.0.1:8000/` が HTTP 200 を返すことを確認しました。
  - `http://127.0.0.1:8000/data/tanka.json` が HTTP 200 を返すことを確認しました。

- Chromium Playwright確認
  - `npm install -D @playwright/test` を実行しました。
  - `npx playwright install chromium` を実行しました。
  - `npx playwright test --project=chromium` を実行し、5件すべて成功しました。
  - 確認viewportは 390 x 844 / 430 x 932 / 1366 x 768 / 1440 x 900 / 1920 x 1080 です。
  - 確認内容は、短歌表示グループの中央配置、`1/7` の非表示、本文と出典の下端揃え、縦書き維持、ボタン非重なり、PC版で一首が1画面に収まることです。

- スクリーンショット確認
  - Chromium Playwrightで以下を保存しました。
  - 保存画像を確認し、短歌表示グループの中央配置、`1/7` 非表示、縦書き維持、ボタン非重なりを確認しました。
  - `screenshots/v13_fix_chromium_mobile_390_top.png`
  - `screenshots/v13_fix_chromium_mobile_430_top.png`
  - `screenshots/v13_fix_chromium_desktop_1366_top.png`
  - `screenshots/v13_fix_chromium_desktop_1440_top.png`
  - `screenshots/v13_fix_chromium_desktop_1920_top.png`

## 未確認

- WebKit Playwright確認
- macOS Safari実機確認
- iPhone Safari実機確認
- 375 x 667 / 768 x 1024 のChromium Playwright確認
- 公開URLでの確認

WebKit Playwright確認は、現在の環境で `Playwright does not support webkit on mac13` が出るため未実行です。このエラーは環境制約として扱い、今回の作業では解消対象にしていません。

## 既知の課題

逐字表示は現在無効です。再導入する場合は、縦書き文脈と `ruby` を壊さない単位で表示制御する必要があります。少なくともルビ付き文字は親文字＋ルビを1単位として扱い、`prefers-reduced-motion: reduce` では無効化してください。

今回の折り返しは固定表示文字数基準です。句切れ基準の美しい折り返しにする場合は、推測ではなく、歌ごとの表示分割位置をデータとして明示する必要があります。

## ユーザーに実機確認してほしいこと

- PC 1366 x 768 で短歌本文・出典・操作ボタンが1画面に収まるか。
- スマホ版とPC版の両方で、本文 + 出典の短歌表示グループが画面中央付近に見えるか。
- 出典が本文の左側にあり、本文下端と出典下端が揃って見えるか。
- ファーストビューに「自選七首」「自選短歌」「TOP DISPLAY」「トップページの短歌表示」等の可視見出しが出ていないか。
- `1/7` が画面上から消えているか。
- iPhone Safari で本文・出典・ボタンが重ならないか。
