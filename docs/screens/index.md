# 画面一覧

PremierInsight の全画面サマリーです。各画面の詳細は個別ファイルを参照してください。

| 画面名 | URL | ファイルパス | 概要 |
|--------|-----|------------|------|
| [トップページ](top.md) | `/` | `app/page.tsx` | ピックアップ記事（featured記事最大3件）と最新試合結果（直近3試合）を表示 |
| [順位表](standings.md) | `/standings` | `app/standings/page.tsx` | プレミアリーグ全20チームの順位表。PC版テーブル・SP版カードリスト。直近5試合フォーム付き |
| [試合結果・日程](matches.md) | `/matches` | `app/matches/page.tsx` | 節ごとの試合結果・日程。節切り替えナビ・日付グルーピング・得点者表示 |
| [得点王ランキング](scorers.md) | `/scorers` | `app/scorers/page.tsx` | 得点王・アシストランキング。1〜3位バッジ・イニシャルアバター |
| [レースチャート](charts-race.md) | `/charts/race` | `app/charts/race/page.tsx` | 勝点推移折れ線グラフ。優勝争い・CL圏争い・残留争いの3タブ切り替え |
| [スタイル分析](charts-style.md) | `/charts/style` | `app/charts/style/page.tsx` | 全20チームの得点×失点散布図。Y軸反転（下ほど失点多い） |
| [記事一覧](articles.md) | `/articles` | `app/articles/page.tsx` | MDX記事一覧。タグフィルター付き |
| [記事詳細](articles.md) | `/articles/[slug]` | `app/articles/[slug]/page.tsx` | MDX記事本文。前後ナビ・動的メタデータ |

---

## ナビゲーション構成

```
Header（全ページ共通）
├── 順位表   → /standings
├── 試合結果 → /matches
├── 得点王   → /scorers
├── 分析     → /charts/race  ← /charts/* でアクティブ
└── 記事     → /articles

チャートサブナビ（/charts/* 配下）
├── レースチャート → /charts/race
└── スタイル分析   → /charts/style
```

---

## レンダリング方式

| 画面 | レンダリング | revalidate |
|------|------------|-----------|
| トップページ | ISR | 1800秒 |
| 順位表 | ISR | 3600秒 |
| 試合結果・日程 | ISR（動的） | 1800秒 |
| 得点王 | ISR | 21600秒 |
| レースチャート | ISR | 3600秒 |
| スタイル分析 | ISR | 3600秒 |
| 記事一覧 | Static（ファイルシステム） | — |
| 記事詳細 | ISR（generateStaticParams） | 3600秒 |
