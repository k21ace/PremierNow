# 分析ページ（統合）

## 1. 画面概要

| 項目 | 内容 |
|------|------|
| 画面名 | 分析 |
| URL | `/charts/race` |
| `page.tsx` | `app/charts/race/page.tsx` |
| 関連コンポーネント | `RaceChart`、`XgClient`、`StyleChartPC`、`StyleChartSP`、`HomeAwayClient`、`SimulatorClient` |
| 目的 | レースチャート・xG分析・スタイル分析・H/A比較・順位予測を1ページに縦並びで表示する |

ユーザーができること（セクション順）:
1. **レースチャート** — 3タブ（優勝争い / CL圏 / 残留争い）で勝点推移を確認
2. **xG分析** — 全チーム・選手の期待得点ランキングを確認
3. **スタイル分析** — 得点力・守備力の散布図でチーム戦術傾向を確認
4. **H/A比較** — ホームとアウェイの成績差を確認
5. **順位予測** — 残り試合の結果を予測して最終順位をシミュレーション

---

## 2. 使用コンポーネント一覧

| コンポーネント名 | ファイルパス | 役割 |
|----------------|------------|------|
| `AnalysisPage` | `app/charts/race/page.tsx` | Server Component。全セクションのデータ取得・組み立て |
| `RaceChart` | `app/charts/race/RaceChart.tsx` | Client Component。タブ切り替え・勝点推移グラフ |
| `RaceChartPC` | `components/charts/RaceChartPC.tsx` | Recharts グラフ PC版 |
| `RaceChartSP` | `components/charts/RaceChartSP.tsx` | Recharts グラフ SP版 |
| `XgClient` | `app/charts/xg/XgClient.tsx` | Client Component。xG分析グラフ |
| `StyleChartPC` | `components/charts/StyleChartPC.tsx` | スタイル分析散布図 PC版 |
| `StyleChartSP` | `components/charts/StyleChartSP.tsx` | スタイル分析散布図 SP版 |
| `HomeAwayClient` | `app/charts/home-away/HomeAwayClient.tsx` | Client Component。H/A比較チャート・テーブル |
| `SimulatorClient` | `app/charts/simulator/SimulatorClient.tsx` | Client Component。順位予測シミュレーター |
| `ChartsLayout` | `app/charts/layout.tsx` | 子要素をそのまま描画（ナビなし） |

---

## 3. データ取得

| 関数名 | エンドポイント | revalidate | 用途 |
|--------|--------------|-----------|------|
| `getMatches({ status: "FINISHED" })` | `GET /competitions/PL/matches?status=FINISHED` | 3600秒 | 終了済み試合から勝点推移を計算 |
| `getStandings()` | `GET /competitions/PL/standings` | 3600秒 | 順位表・スタイル分析・シミュレーター用 |
| `getHomeAwayStandings()` | `GET /competitions/PL/standings` (HOME/AWAY) | 3600秒 | H/A比較用 |
| `getMatches({ status: "SCHEDULED" })` | `GET /competitions/PL/matches?status=SCHEDULED` | 3600秒 | 順位予測シミュレーター用 |
| `getUnderstatTeams(2025)` | Understat スクレイピング | — | xG分析（失敗しても他セクションに影響しない） |
| `getUnderstatPlayers(2025)` | Understat スクレイピング | — | xG選手ランキング |

主要4フェッチは `Promise.all` で並列取得。xGは別途 try/catch で取得。

---

## 4. APIレスポンス → 画面変数 対応表

### calcPointsTimeline（勝点推移計算）

`finishedData.matches` → `calcPointsTimeline()` → `timelines: TeamTimeline[]`

| API項目名（英語） | 変数名（TypeScript） | 型 | 表示箇所 | 備考 |
|-----------------|-------------------|-----|--------|------|
| `match.homeTeam.id` / `match.awayTeam.id` | `teamId` | `number` | チーム識別 | 全チームを自動収集 |
| `match.homeTeam.tla` / `match.awayTeam.tla` | `teamShortName` | `string` | グラフの折れ線ラベル・Tooltip | 3文字略称（例: ARS） |
| `match.homeTeam.crest` / `match.awayTeam.crest` | `crestUrl` | `string` | 終端エンブレムDot | — |
| `match.score.fullTime.home/away` | `points[]` | `number[]` | 節ごと累計勝点（Y軸） | 各節のデルタ（0/1/3）を累積 |
| — | `avgPPG` | `number` | 予測計算に使用 | 直近5節平均勝点/節 |
| — | `predictedPoints[]` | `number[]` | 予測点線（PC版のみ） | avgPPGで38節まで外挿 |
| — | `color` | `string` | 折れ線の色 | `lib/team-colors.ts` のマッピングを使用 |

### getStandings（グループ定義）

| API項目名（英語） | 変数名（TypeScript） | 型 | 用途 |
|-----------------|-------------------|-----|------|
| `standings[TOTAL].table[0-2].team.id` | `groupTeamIds.title` | `number[]` | 優勝争いタブのチームID |
| `standings[TOTAL].table[2-6].team.id` | `groupTeamIds.cl` | `number[]` | CL圏争いタブのチームID |
| `standings[TOTAL].table[15-19].team.id` | `groupTeamIds.relegation` | `number[]` | 残留争いタブのチームID |
| `standings[TOTAL].table[16].team.id` | `safeZoneTeamId` | `number \| null` | 降格圏境界チームID（アノテーション用） |

---

## 5. 状態管理

| コンポーネント | state名 | 型 | 初期値 | 役割 |
|-------------|---------|-----|-------|------|
| `RaceChart` | `group` | `"title" \| "cl" \| "relegation"` | `"title"` | 現在選択中のタブグループ |

`group` が変わると `activeTeamIds`・`activeTimelines`・`chartData`・`dramaticMoments` が `useMemo` で再計算される。

---

## 6. SEO設定

| 項目 | 値 |
|------|-----|
| `title` | `"プレミアリーグ 優勝争い・降格争いチャート 2025-26 | PremierNow"` |
| `description` | `"節ごとの勝点推移を可視化。優勝争いと降格争いをリアルタイムで追えます。"` |
| OGP画像 | `/api/og?title=プレミアリーグ+優勝争い・降格争いチャート+2025-26`（動的生成） |
| Twitter Card | `summary_large_image` |
| JSON-LD | なし |

---

## 7. YAxis の domain

`RaceChartPC` / `RaceChartSP` ともに `domain={[0, (dataMax) => Math.ceil(dataMax / 10) * 10 + 5]}` を設定。
データの最大勝点を 10 の倍数に切り上げ +5 した値を上限とすることで、上部の余白を最小化している。

## 8. 既知の課題・TODO

- ブランクGW（チームによって試合数が異なる節）では前節の勝点を引き継ぐ処理を行っているが、複数節にまたがる試合未消化は考慮できていない
- SP版は予測・ハイライト・アノテーションを非表示にしているため情報量が少ない（末端エンブレムで視認性を確保）
- `calcDramaticEvents` の zone_change 検出は全試合データを毎回走査するため、試合数が多いとやや重い
