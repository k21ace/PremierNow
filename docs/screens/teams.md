# チーム画面

## 概要

| 項目 | 内容 |
|------|------|
| パス | `/teams`（一覧）・`/teams/[id]`（詳細） |
| コンポーネント | `app/teams/page.tsx`（Server）・`app/teams/[id]/page.tsx`（Server）・`app/teams/[id]/TeamDetailClient.tsx`（Client） |
| データソース | `getStandings()`（一覧・詳細）・`getMatches({status:'FINISHED'})`（詳細） |
| キャッシュ | standings: 3600秒（1時間）・matches: 1800秒（30分） |
| ナビラベル | **チーム**（ヘッダー6項目中4番目） |

---

## /teams（チーム一覧）

### 表示内容

- `getStandings()` で取得した全20クラブをグリッド表示
- 2列（モバイル）〜5列（PC）のレスポンシブグリッド
- 順位帯ごとに左ボーダー色付き（UCL=青・UEL=オレンジ・UECL=薄オレンジ・降格=赤）

### カード内容

| 要素 | 内容 |
|---|---|
| エンブレム | 48×48 |
| クラブ名 | shortName |
| 順位 | `{position}位` |
| 勝点 | `{points}pt`（font-bold） |
| 成績 | `{won}勝{draw}分{lost}負` |

各カードは `/teams/[id]` へのリンク。

---

## /teams/[id]（チーム詳細）

### 構成

Server Component（`page.tsx`）が standings + finished matches を並列取得し、Client Component（`TeamDetailClient.tsx`）に渡す。

### データ取得（Server Component）

- `getStandings()` → TOTAL / HOME / AWAY の3テーブル取得
- `getMatches({status:'FINISHED'})` → 終了済み全試合
- チームIDでフィルター → 直近10試合（古い順）を `MatchSummary[]` に変換
- 存在しないIDは `notFound()` で404

### MatchSummary 型

```ts
interface MatchSummary {
  id: number;
  utcDate: string;
  isHome: boolean;
  opponentId: number;
  opponentName: string;
  opponentShortName: string;
  opponentCrest: string;
  scored: number;
  conceded: number;
  result: "W" | "D" | "L";
}
```

### セクション構成

#### セクション1: チームヘッダー
- エンブレム（64×64）+ チーム名（text-2xl）+ TLA
- 統計カード5枚: 順位・勝点・得点・失点・得失点差
- 勝/分/負 カウント

#### セクション2: トレンドグラフ
- Recharts ResponsiveContainer + LineChart（高さ180px）
- X軸: 相手チームTLA + H/A（例: `ARS H`）、30度傾斜
- 2系列: 得点（violet-600）・失点（gray-400）
- Tooltip・Legend付き

#### セクション3: 直近試合リスト
- 直近10試合を新しい順で表示
- 各行: 日付・W/D/Lバッジ・H/A・相手エンブレム・相手名・スコア
- hover:bg-gray-50

#### セクション4: ホーム/アウェイ成績テーブル
- トータル・ホーム・アウェイの3行
- 列: 試合数・勝・分・負・得点・失点・得失点差・勝点

### generateMetadata
- title: `{チーム名} 成績・スタッツ 2025-26 | PremierInsight`
- OGP画像: `/api/og?title=...` で動的生成

---

## コンポーネント依存関係

```
app/teams/page.tsx (Server)
  └── lib/football-api.ts#getStandings

app/teams/[id]/page.tsx (Server)
  └── TeamDetailClient.tsx (Client)   ← トレンドグラフ・リスト・テーブル
  └── lib/football-api.ts#getStandings
  └── lib/football-api.ts#getMatches
```
