# Yokoyama site update v8

## 今回の修正
- 短歌本文を縦一行固定に近づけるため、縦書き本文に `white-space: nowrap` を追加。
- フォント調整ロジックを、`scrollHeight/clientHeight` 依存から、本文の実描画高さ `getBoundingClientRect().height` と viewer の利用可能高さ比較へ変更。
- 出典のDOM順を本文の左側へ変更し、`align-items:flex-end` により歌の下端揃えへ修正。
- ルビ付き歌の表示崩れを抑えるため、`rt` サイズと行高を再調整。

## 原因整理
1. 以前の実装では本文が viewer 全高を持った flex 要素になっており、高さ不足時に縦書き本文が複数列へ回りやすかった。
2. 自動調整ロジックが `scrollHeight` を見ていたため、縦書きの列回りを正しく検知できていなかった。
3. 出典は本文の右側に配置されており、指定と逆だった。

## 確認
- Chromium の headless screenshot で 390x844 / 768x1200 / 1440x1600 の表示確認を実施。
- ルビ付きの一首目で本文が複数列化しないことを確認。
- 出典が歌の左側で下端揃えになるよう確認。
