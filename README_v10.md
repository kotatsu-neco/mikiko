# yokoyama_site_update_v10

## 今回の修正
- 短歌本文の書体を UD明朝 優先へ変更
- ルビも UD明朝 優先へ変更
- それ以外の本文・見出し・ナビゲーションは UDゴシック 優先を維持
- アクセシビリティ寄りの配慮は v9 の内容を継続

## フォント方針
- 短歌本文・ルビ:
  - BIZ UDPMincho
  - BIZ UDMincho Medium
  - Yu Mincho Demibold
  - Yu Mincho
  - Hiragino Mincho ProN
  - Noto Serif JP
- それ以外:
  - BIZ UDPGothic
  - BIZ UDGothic
  - Yu Gothic UI
  - YuGothic
  - Hiragino Sans
  - Meiryo
  - Noto Sans JP

## 確認済み
- CSS上で短歌本文とルビが UD明朝 優先へ切替済み
- それ以外は UDゴシック 優先のまま

## 未確認
- 実機 Safari での最終見え方
- 端末ごとの搭載フォント差
