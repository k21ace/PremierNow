# 選手スタッツ画面

## 概要

| 項目 | 内容 |
|------|------|
| パス | `/players`（一覧）・`/players/[id]`（詳細） |
| コンポーネント | `app/players/page.tsx`（Server）・`app/players/PlayersView.tsx`（Client）・`app/players/[id]/page.tsx`（Server）・`app/players/[id]/PlayerDetailClient.tsx`（Client） |
| データソース | `getScorers(season?)`（一覧・詳細スタッツ）・`getPlayer(id)`（詳細） |
| キャッシュ | scorers: 21600秒（6時間）・person: 86400秒（24時間） |
| ナビラベル | **Player**（ヘッダー5項目中3番目） |

---

## /players（選手一覧）

### 表示内容

- `getScorers()` で取得した選手をテーブル形式で一覧表示（初期表示: 2025-26シーズン）
- シーズン選択ドロップダウン（2023-24〜2025-26）
- チームフィルター（全チーム or 特定チーム）
- ソート切り替え（得点順 / アシスト順 / 得点+A順）

### テーブル列

| 列 | 内容 |
|---|---|
| # | 順位（1〜3位はバッジ、4位以降は数字） |
| 選手 | イニシャルアバター + 選手名（`/players/[id]` へのリンク、hover:text-violet-600） |
| クラブ | エンブレム画像（20×20）+ shortName |
| 国籍 | nationality（スマホ非表示） |
| 得点 | font-semibold・強調表示 |
| A | アシスト数（未集計は「—」） |
| 出場 | playedMatches（スマホ非表示） |
| 得点+A | goals + assists（スマホ非表示） |
| SNS | プラットフォームアイコンリンク（スマホ非表示） |

> ※「→」詳細リンク列は廃止。選手名そのものをクリックで詳細ページへ遷移。

### シーズン切り替え

- `PlayersView.tsx` の `selectedSeason` state（デフォルト: `DEFAULT_SEASON = 2025`）で管理
- シーズン変更時は `/api/scorers?season={year}` を `fetch` してデータを更新
- 切り替え中はテーブル上に「読み込み中...」オーバーレイを表示
- `lib/seasons.ts` の `SEASONS` 配列（2023-24〜2025-26）を使用

### APIルート

- `app/api/scorers/route.ts`（`GET /api/scorers?season={year}`）
- サーバー側で `FOOTBALL_DATA_API_KEY` を保持したまま JSON を返すプロキシ

---

## /players/[id]（選手詳細）— Fotmob風

### 構成

Server Component（`page.tsx`）が全データをSSRで取得し、Client Component（`PlayerDetailClient.tsx`）に渡す。
Client Component で selectedSeason state を管理し、シーズン切り替えはサーバーロード済みデータを使用（追加fetchなし）。

### データ取得（Server Component）

- `getPlayer(id)` → `/persons/{id}`（ISR 86400秒）
- `getScorers(2025/2024/2023)` × 3シーズンを `Promise.all` で並列取得
- `getPlayerSNS(id)`, `getPlayerDetailStatsAll(id)`, `getPlayerCareer(id)`（モック・同期）
- 存在しない ID は `notFound()` で 404

### セクション構成

#### セクション1: ヘッダー
- イニシャルアバター（w-20 h-20・text-2xl・violet-100背景）
- 選手名（text-3xl font-bold）
- 国旗emoji（`lib/nationality-flag.ts#getFlagEmoji`）+ 国籍（football-data.org は国名形式 "Norway" 等）
- 所属チームエンブレム（22×22）+ `currentTeam.name`（null の場合「所属チーム不明」）
- ポジション（POS）・生年月日・年齢（calcAge() で計算）

#### セクション2: スタッツ（シーズン切り替え付き）
- 「スタッツ」テキストのすぐ右隣にシーズン選択ドロップダウン（`flex items-center gap-3`）
- **APIスタッツ（MetricCard×4）**: 得点・アシスト・出場試合・得点+A
- **詳細スタッツ（2列グリッド×4カード）**: シュート / パス / ドリブル・守備 / カード
- 詳細スタッツは `lib/mock/player-stats.ts` から `getPlayerDetailStatsAll()` で取得
- 対応データなし → 「データは準備中です」

#### セクション3: シーズン成績テーブル
- 3シーズン分を縦テーブルで表示（シーズン・クラブ・得点・A・出場）
- 選択中シーズン行は `bg-violet-50` でハイライト・「選択中」バッジ
- データなし行は「—」表示

#### セクション4: SNSリンク
- `lib/mock/player-sns.ts` からデータ取得
- プラットフォームカード（アイコン + ハンドル + 「プロフィールを見る →」）
- データなし → 「SNS情報は準備中です」

#### セクション5: クラブキャリア（タイムライン）
- `lib/mock/player-career.ts` からデータ取得（Haaland・Saka・Salah・Odegaard・Rashford）
- タイムライン形式（左: violet-400ドット＋縦線 / 右: クラブカード）
- カード内: クラブエンブレム + クラブ名 + note + 年度 + G/A/出場数
- データなし → 「キャリアデータは準備中です」

### generateMetadata
- title: `{選手名} スタッツ 2025-26 | PremierNow`
- OGP画像: `/api/og?title=...` で動的生成

---

## モックデータ

| ファイル | 型 | 対象選手 |
|---|---|---|
| `lib/mock/player-sns.ts` | `PlayerSNS` | Haaland, Salah, Saka, Odegaard, Rashford, Son, Palmer, De Bruyne, Isak, Watkins（10名） |
| `lib/mock/player-stats.ts` | `PlayerDetailStats` | 上記10名（一部複数シーズン分） |
| `lib/mock/player-career.ts` | `PlayerCareer` | Haaland, Saka, Salah, Odegaard, Rashford（5名） |

---

## コンポーネント依存関係

```
app/players/page.tsx (Server)
  └── PlayersView.tsx (Client)              ← シーズン切り替え・フィルター・ソート・テーブル
        └── /api/scorers?season=N           ← クライアントサイドシーズン取得
        └── lib/seasons.ts                  ← シーズン定義
  └── lib/mock/player-sns.ts               ← SNSモックデータ（初期ロード）
  └── lib/football-api.ts#getScorers       ← 初期スコアラーデータ

app/api/scorers/route.ts (API Route)
  └── lib/football-api.ts#getScorers
  └── lib/seasons.ts

app/players/[id]/page.tsx (Server)
  └── PlayerDetailClient.tsx (Client)       ← selectedSeason state・全セクション描画
  └── lib/football-api.ts#getPlayer
  └── lib/football-api.ts#getScorers (×3シーズン並列)
  └── lib/mock/player-sns.ts
  └── lib/mock/player-stats.ts
  └── lib/mock/player-career.ts
```

---

## SNSアイコン対応

| プラットフォーム | lucide-react アイコン |
|---|---|
| instagram | `Instagram` |
| x | `Twitter` |
| youtube | `Youtube` |
| tiktok | `Music2`（代替） |
