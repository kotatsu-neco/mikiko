## 原因

PC版ファーストビューの崩れは、短歌本文を逐字表示するために1文字ごとの `span.tanka-unit` に分割し、さらに `styles.css` 後半で `.poem-body` を `display: inline-flex` / `flex-direction: column`、各文字を `inline-flex` にしていたことが主因です。

この指定により、`.poem-body` に設定された `writing-mode: vertical-rl` の自然な縦書き組版ではなく、flexレイアウトの子要素として文字単位が配置され、縦書き本文として成立しない状態になっていました。

また、出典は JavaScript で本文の実寸を測って `position: absolute` の `left/top` を計算していました。逐字span化後の実寸やviewport差分に影響されやすく、本文と出典が一体の短歌表示グループとして安定しない原因になっていました。

## 修正内容

- `index.html`
  - ファーストビュー上の可視見出し「自選短歌」を削除しました。
  - 構造上の `h1` と `h2` は `visually-hidden` として保持しました。
  - ファーストビューは短歌本文、出典、控えめな切り替え操作が主になる構造にしました。

- `styles.css`
  - `.poem-body` を通常の縦書き本文に戻し、`writing-mode: vertical-rl`、`text-orientation: mixed`、`line-height`、`letter-spacing`、viewport連動の `font-size` / `max-height` で調整しました。
  - 1文字span用の flex / opacity animation 指定を削除しました。
  - 本文と出典を同じ `.poem-layout` 内の flex グループとして配置し、出典が本文の左側・下端揃えに見えるようにしました。
  - ヘッダーを fixed の浮遊ピルから absolute の控えめな表示へ変更し、背景・枠・影を外して短歌鑑賞の邪魔にならないよう弱めました。

- `script.js`
  - 逐字表示用の文字分割、タイマー、クリックで全文表示する処理を削除しました。
  - `data/tanka.json` の `html` を安全化したうえで、`ruby` を含む静的HTMLとして `.poem-body` に描画する方式へ戻しました。
  - 出典位置を JavaScript で絶対配置計算する処理を削除し、CSSレイアウトに任せるようにしました。

## 逐字表示の扱い

今回は無効化しました。

理由は、既存の逐字表示実装が短歌本文を1文字ごとの flex 要素に変換し、縦書きとルビを壊していたためです。今回の最優先条件は「演出より可読性」なので、まず静的な縦書き表示として安定させています。

## ヘッダー/見出しの扱い

「自選短歌」「自選七首」系の見出しはファーストビュー上に表示しないようにしました。

アクセシビリティ上の構造見出しとして、`横山未来子 公式ウェブサイト` と `自選短歌` は `visually-hidden` で保持しています。

ヘッダーは固定フロートをやめ、透明・小さめ・影なしの absolute 配置に変更しました。初期表示後は既存の自動非表示処理でさらに弱まります。

## 確認済み

- 静的確認
  - `index.html` / `styles.css` / `script.js` の構造を確認しました。
  - `data/tanka.json` / `data/books.json` は維持し、短歌本文・出典は変更していません。
  - 短歌本文はHTML直書きに戻さず、JSONから読み込む構造を維持しています。

- ローカルサーバー確認
  - `python3 -m http.server 8000` を起動しました。
  - `http://127.0.0.1:8000/` が HTTP 200 を返すことを確認しました。
  - `http://127.0.0.1:8000/data/tanka.json` が HTTP 200 を返すことを確認しました。

- Playwright確認
  - 未実行です。環境に `node` / `npm` / `npx` / Playwright がありませんでした。

- スクリーンショット確認
  - 未実行です。Playwrightがなく、代替として試した Safari WebDriver は Safari 側で `Allow remote automation` が無効のためセッション作成できませんでした。

## 未確認

- iPhone Safari
- macOS Safari 実機目視
- 公開URL
- Playwrightによるviewport別スクリーンショット

## 既知の課題

逐字表示は現在無効です。再導入する場合は、本文を1文字ごとの flex 要素にせず、縦書き文脈と `ruby` を壊さない単位で表示制御する必要があります。少なくともルビ付き文字は親文字＋ルビを1単位として扱い、`prefers-reduced-motion: reduce` では無効化してください。

## ユーザーに実機確認してほしいこと

- PC 1366 x 768 で短歌本文・出典・操作ボタンが1画面に収まるか。
- ファーストビューに「自選七首」「自選短歌」等の大きな見出しが見えていないか。
- 出典が本文の左側・下端揃えに見え、孤立していないか。
- iPhone Safari で本文とボタンが重ならないか。
