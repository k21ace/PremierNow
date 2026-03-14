# デザインガイドライン

## デザインコンセプト

**「データが主役・余白が語る」**

白ベース・クリーンで FBref / Sofascore に近いデザイン。
AI生成デフォルトの過度な角丸・グラデーション・カラフル配色は使わない。

---

## カラーパレット

| 用途 | Tailwind クラス | カラーコード |
|------|----------------|------------|
| ページ背景 | `bg-gray-50` | `#f9fafb` |
| カード背景 | `bg-white` | `#ffffff` |
| ホバー背景 | `bg-gray-50` | `#f9fafb` |
| ボーダー | `border-gray-200` | `#e5e7eb` |
| テキスト（主） | `text-gray-900` | `#111827` |
| テキスト（補助） | `text-gray-500` | `#6b7280` |
| テキスト（薄） | `text-gray-400` | `#9ca3af` |
| アクセント | `text-violet-600` | `#7c3aed` |
| アクセントホバー枠 | `border-violet-300` | `#c4b5fd` |
| 勝利バッジ | `bg-green-600` | `#16a34a` |
| 引き分けバッジ | `bg-gray-400` | `#9ca3af` |
| 敗北バッジ | `bg-red-500` | `#ef4444` |
| CL圏左ボーダー | `border-blue-500` | `#3b82f6` |
| EL圏左ボーダー | `border-orange-400` | `#fb923c` |
| UECL圏左ボーダー | `border-orange-200` | `#fed7aa` |
| 降格圏左ボーダー | `border-red-500` | `#ef4444` |

---

## タイポグラフィ

| 用途 | クラス・フォント |
|------|----------------|
| ページ見出し | `text-xl font-semibold tracking-tight text-gray-900` |
| カード見出し | `font-medium text-gray-900` |
| 本文 | `text-sm text-gray-700 leading-relaxed` |
| 補助テキスト | `text-sm text-gray-500` |
| 数字（必須） | `font-mono tabular-nums` |
| セクションラベル | `text-sm font-medium text-gray-500 uppercase tracking-wider` |
| 日本語本文 | Noto Sans JP（CSS変数 `--font-noto-sans-jp`） |
| 英数字 | Inter（CSS変数 `--font-inter`） |
| 等幅 | Geist Mono（CSS変数 `--font-geist-mono`） |

---

## コンポーネント原則

| ルール | 内容 |
|--------|------|
| 角丸 | `rounded` まで（`rounded-lg` 以上禁止） |
| シャドウ | `shadow-sm` のみ（`shadow-md` 以上禁止） |
| 区切り | ボーダーで区切る（シャドウで浮かせない） |
| テーブルヘッダー | `bg-gray-50 text-gray-500 text-xs uppercase tracking-wider` |
| W/D/L バッジ | `w-6 h-6 text-xs font-bold rounded-sm` 正方形 |
| カードコンテナ | `bg-white border border-gray-200 rounded shadow-sm` |
| ページコンテナ | `max-w-3xl mx-auto px-4 py-6`（幅広は `max-w-5xl`） |
| アクティブタブ | `border-b-2 border-violet-600 text-violet-600 font-medium` |

---

## レスポンシブ対応

- ブレークポイントは Tailwind のデフォルト（`md: 768px`）を使用
- PC版（`md:` 以上）とSP版（`md:` 未満）でコンポーネントを切り替えるパターンを採用
  - `hidden md:block` / `block md:hidden` でPC/SPを出し分け
- テーブルの一部列をスマホ非表示（`hidden md:table-cell`）
- グラフ: PC版 500px・SP版 360px の別コンポーネント

---

## やってはいけないこと

- `rounded-xl` 以上の角丸
- `shadow-md` 以上のシャドウ
- グラデーション背景（`bg-gradient-*`）
- カラフルすぎる配色（アクセントは `violet-600` に統一）
- Hero画像の使用
- 過度なアニメーション（`transition-colors` 程度に留める）
- 数字への `font-mono tabular-nums` 忘れ
