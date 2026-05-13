# README_v13o_cleanup_embed

## 概要
v13o は、公開前の仕上げとして以下を実施した版です。

- お知らせ欄への X 公式埋め込み追加
- X 埋め込み失敗時の fallback リンク維持
- 不自然な本文の差し替え
- お問い合わせの「マネジメント窓口」統一維持
- 旧書影ファイル `assets/books/toku_koirimasu_cover.webp` の削除
- 内部の報告書整理開始

## 変更ファイル
- `index.html`
- `styles.css`
- `script.js`
- `tests/featured-tanka.spec.js`
- `playwright.config.js`
- `docs/reports/README_v13o_cleanup_embed.md`
- `git_diff_check_v13o.txt`

## X埋め込みの追加内容
お知らせ欄の下に `X最新投稿` の小セクションを追加しました。

- `a.twitter-timeline` を配置
- `data-height="360"`
- `data-chrome="noheader nofooter transparent noborders"`
- `data-dnt="true"`

見た目が主役になりすぎないよう、`.x-embed-shell` 側で高さ上限と外枠を抑えています。

## X埋め込みfallbackの内容
X タイムラインが読み込めない環境でも、以下のリンクが残る構成です。

- 文言: `Xプロフィールを見る`
- URL: `https://x.com/yokoyama_mikiko`
- 属性: `target="_blank" rel="noopener noreferrer"`

`script.js` では `.twitter-timeline` が存在する場合のみ `https://platform.twitter.com/widgets.js` を動的挿入し、既に同一 `src` の script がある場合は重複挿入しないようにしました。

## Instagramはリンクのみであること
Instagram はリンクのみです。埋め込み、スクレイピング、最新投稿の自動表示は追加していません。

## 心の花リンクの扱い
心の花はリンクのみです。埋め込みや外部スクリプトは追加していません。

## `toku_koirimasu_cover.webp` 削除結果
- `assets/books/toku_koirimasu_cover.webp`: 削除済み
- `assets/books/toku_kitarimase_cover.webp`: 存在確認済み

### grep確認
ランタイム参照としての `toku_koirimasu_cover.webp` は残していません。

以下の文字列は、**否定確認のテスト** または **過去報告書本文** に残っています。

- `tests/featured-tanka.spec.js` の `not.toContain('toku_koirimasu_cover.webp')`
- `docs/reports/README_v13m_design_books.md` の過去記録
- `docs/reports/README_v13n_layout_books.md` の過去記録

## `toku_kitarimase_cover.webp` 正本化の確認
以下で確認しました。

- `data/books.json`
- `script.js` の fallback books
- `tests/featured-tanka.spec.js`
- `assets/books/toku_kitarimase_cover.webp`

## 差し替えた本文
旧:

> 難しい説明を先に置かず、短歌そのものに静かに向き合える導線を優先しています。学校関係者、講演依頼を検討される方にも届く設計です。

新:

> 難しい説明を先に置かず、短歌そのものに静かに向き合える入口です。番組・授業・講演などをきっかけに知った方も、まずは一首から作品世界に触れられます。

## 問い合わせ窓口を「マネジメント窓口」に統一した内容
問い合わせ表示は `マネジメント窓口` を維持し、別口の問い合わせ区分は追加していません。

本文側では、

> 番組・授業・講演などに関するご相談を含め、窓口はマネジメント窓口へ一本化しています。

という見え方にし、「学校・講演関連」という独立区分は復活させていません。

## `office@example.jp` の扱い
`office@example.jp` は仮表記のまま残しています。実装側では正式メールアドレスへ変更していません。

### 公開前確認対象
- `office@example.jp` を正式な公開用アドレスへ差し替えるかどうか

## 内部フォルダ整理の内容
今回から、過去の報告書類を `docs/reports/` へ移動しました。

### 移動したファイル
- `README_v07.md`
- `README_v08.md`
- `README_v09.md`
- `README_v10.md`
- `README_v11.md`
- `README_v12.md`
- `README_v13.md`
- `README_v13_fix.md`
- `README_v13g_diagnostics.md`
- `README_v13h_scroll_fix.md`
- `README_v13k_tanka_centering.md`
- `README_v13l_ui_books.md`
- `README_v13m_design_books.md`
- `README_v13n_layout_books.md`

スクリーンショットは既存の `screenshots/` を維持しました。

`.gitignore` は確認し、以下が既に除外済みであることを確認しました。

- `node_modules/`
- `test-results/`
- `screenshots/`
- `*.zip`

## 整理しなかったファイルと理由
- `.git/`: 変更禁止対象のため未対応
- `node_modules/`: 作業対象外のため未削除
- `test-results/`: 既存のまま。成果物zipには含めない
- `mobile-preview.html`: 今回の必須対象外のため維持
- `package.json` / `package-lock.json`: package追加なしのため維持

## 変更していないもの
- `data/tanka.json`
- 自選七首本文
- ルビ
- 旧仮名遣い
- 出典
- 短歌中心レイアウトの基本方針
- Instagramリンクのみ方針
- 心の花リンクのみ方針

## buildId / cache query
更新しました。

- `styles.css?v=20260513-v13o`
- `script.js?v=20260513-v13o`
- `BUILD_ID = 'v13o-cleanup-embed-20260513'`

## 検証結果
### 実施できたもの
- `node --check script.js`: 成功
- `node --check tests/featured-tanka.spec.js`: 成功
- `git diff --check`: 成功
- 文字列確認 / ファイル存在確認 / 削除確認: 実施

### 実施できなかったもの
- Chromium Playwright 実表示確認
- v13o 用スクリーンショット保存
- X 公式埋め込みの実レンダリング確認
- localhost 上でのブラウザ表示確認

### 実施できなかった理由
このコンテナ環境では、Playwright 実行時に以下の問題が発生しました。

1. 既定 Playwright browser が未配置
2. system Chromium 指定後も `page.goto('http://127.0.0.1:8000/')` が `net::ERR_BLOCKED_BY_ADMINISTRATOR` で停止
3. Chromium CLI headless screenshot もタイムアウトし、安定した描画確認ができなかった

そのため、v13o は **静的確認中心** です。ブラウザ実表示はユーザー実機または Codex / 別環境での確認が必要です。

## スクリーンショット保存先
- 既存: `screenshots/`
- v13o 新規: **未保存**（上記理由により未実施）

## `git diff --check` 結果
- `git_diff_check_v13o.txt` 参照
- 結果: 問題なし

## Safari実機未確認事項
- X 公式埋め込みの表示可否
- X 埋め込み失敗時の見え方
- 書影ライトボックス
- 既存の短歌表示とハンバーガー挙動への副作用

## ユーザーに確認してほしい最小項目
1. お知らせ欄の X セクションが目立ちすぎないか
2. X が表示されない場合でも `Xプロフィールを見る` リンクが自然に見えるか
3. お問い合わせが `マネジメント窓口` 一本に見えるか
4. `office@example.jp` を正式アドレスへ差し替えるか
5. 書影・短歌・ハンバーガー挙動が既存と比べて崩れていないか
