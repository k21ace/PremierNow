import type { Goal, MatchStatus, Score } from "@/types/football";

/**
 * 注目カード — 静的設定ファイル
 *
 * ※ けが人・出場停止情報は試合直前に手動で更新してください。
 *    football-data.org 無料プランでは負傷者情報は提供されないため静的管理です。
 *
 * utcDate / venue / homeTeam / awayTeam は football-data.org API から自動取得します。
 * 更新時は以下のフィールドのみ変更してください:
 *   - homeTeamId / awayTeamId
 *   - quizSlug（lib/quiz-data.ts の slug と一致させること）
 *   - previewArticleSlug（content/articles/{slug}.mdx と一致させること）
 *   - homeInjuries / awayInjuries
 *   - scorePrediction（省略可）
 *
 * 【移籍検知】
 * InjuryInfo に playerId（football-data.org の選手ID）を設定すると、
 * ページ描画時に GET /persons/{id} で currentTeam を照合し、
 * 移籍済みの選手は注目カードから自動除外されます。
 * 選手IDは https://www.football-data.org/v4/persons/{id} で確認できます。
 * playerId 未設定の選手は照合されず、そのまま表示されます。
 */

export type InjuryInfo = {
  /** 選手名（日本語） */
  playerName: string;
  /** 負傷箇所 or 累積警告など */
  reason: string;
  /** injury = けが / suspension = 出場停止 */
  status: "injury" | "suspension";
  /** 復帰予定（例: "4月上旬"・"未定"・"シーズン終了"） */
  returnDate?: string;
  /** true の場合、この試合で復帰予定 */
  returning?: boolean;
  /** 情報ソースの URL */
  sourceUrl?: string;
  /**
   * football-data.org の選手ID（/persons/{id}）。
   * 設定すると移籍チェックが有効になり、移籍済みの場合は自動除外される。
   * 未設定の場合はチェックをスキップしてそのまま表示する。
   */
  playerId?: number;
};

/** football-data.org API から取得した試合データと injuries をマージした型（FeaturedMatchCard の Props） */
export type FeaturedMatchConfig = {
  /** football-data.org の数値試合ID（ライブポーリング用） */
  apiMatchId: number;
  /** URL パラメータ用 ID（例: "brighton-vs-liverpool"） */
  matchId: string;
  homeTeam: {
    /** football-data.org チーム ID */
    id: number;
    name: string;
    shortName: string;
    crest: string;
    injuries: InjuryInfo[];
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
    injuries: InjuryInfo[];
  };
  /** UTC 日時（ISO 8601） */
  utcDate: string;
  matchday: number;
  venue: string;
  /** 試合ステータス */
  status: MatchStatus;
  /** 試合中・終了後のスコア情報 */
  liveScore?: Score;
  /** 得点リスト（試合中・終了後） */
  goals?: Goal[];
  /** /quiz/[slug] の slug に対応 */
  quizSlug: string;
  /** /articles/[slug] のマッチプレビュー記事スラッグ */
  previewArticleSlug: string;
  /** スコア予想 */
  scorePrediction?: ScorePrediction;
};

export type ScorePrediction = {
  /** ホームチームの予想得点 */
  homeGoals: number;
  /** アウェイチームの予想得点 */
  awayGoals: number;
  /** ホーム勝利確率（0〜100） */
  homeWinPct: number;
  /** 引き分け確率（0〜100） */
  drawPct: number;
  /** アウェイ勝利確率（0〜100） */
  awayWinPct: number;
  /** 予想の根拠・コメント */
  comment?: string;
};

/** 静的管理が必要な設定のみを保持する型 */
export type FeaturedMatchStaticConfig = {
  /** ホームチームの football-data.org チームID */
  homeTeamId: number;
  /** アウェイチームの football-data.org チームID */
  awayTeamId: number;
  /** /articles/quiz/[slug] 用スラッグ */
  quizSlug: string;
  /** /articles/[slug] のマッチプレビュー記事スラッグ */
  previewArticleSlug: string;
  /** ホームチームの負傷者・出場停止情報 */
  homeInjuries: InjuryInfo[];
  /** アウェイチームの負傷者・出場停止情報 */
  awayInjuries: InjuryInfo[];
  /** スコア予想 */
  scorePrediction?: ScorePrediction;
};

// ─────────────────────────────────────────────────────────────────────────────
// 注目カード設定（手動更新が必要な項目のみ）
// utcDate / venue / チーム名 / エンブレムは API から自動取得されます
// ─────────────────────────────────────────────────────────────────────────────

export const FEATURED_MATCH_CONFIG: FeaturedMatchStaticConfig = {
  homeTeamId: 67,  // Newcastle United FC
  awayTeamId: 71,  // Sunderland AFC
  quizSlug: "newcastle-vs-sunderland",
  previewArticleSlug: "matchpreview-matchday31-newcastle-sunderland",
  homeInjuries: [
    {
      playerName: "サンドロ・トナーリ",
      reason: "大腿部の負傷",
      status: "injury",
      returnDate: "未定",
      playerId: undefined, // Sandro Tonali
    },
    {
      playerName: "エミル・クラフト",
      reason: "膝の負傷",
      status: "injury",
      returnDate: "2026年6月上旬",
      playerId: undefined, // Emil Krafth
    },
    {
      playerName: "ファビアン・シェア",
      reason: "足首の負傷",
      status: "injury",
      returnDate: "2026年4月中旬",
      playerId: undefined, // Fabian Schär
    },
    {
      playerName: "ブルーノ・ギマランイス",
      reason: "筋肉損傷",
      status: "injury",
      returnDate: "2026年4月中旬",
      playerId: undefined, // Bruno Guimarães
    },
    {
      playerName: "ルイス・マイリー",
      reason: "膝の負傷",
      status: "injury",
      returnDate: "2026年4月上旬",
      playerId: undefined, // Lewis Miley
    },
  ],
  awayInjuries: [
    {
      playerName: "ロビン・ルーフス",
      reason: "ハムストリング損傷",
      status: "injury",
      returnDate: "未定",
      playerId: undefined, // Robin Roefs
    },
    {
      playerName: "ダニエル・バラード",
      reason: "ハムストリング損傷",
      status: "injury",
      returnDate: "未定",
      playerId: undefined, // Daniel Ballard
    },
    {
      playerName: "ベルトラン・トラオレ",
      reason: "膝の負傷",
      status: "injury",
      returnDate: "2026年5月上旬",
      playerId: undefined, // Bertrand Traoré
    },
    {
      playerName: "ジョスラン・タ・ビ",
      reason: "軽い外傷",
      status: "injury",
      returnDate: "2026年4月中旬",
      playerId: undefined, // Jocelin Ta Bi
    },
    {
      playerName: "ニルソン・アンギュロ",
      reason: "筋肉損傷",
      status: "injury",
      returnDate: "2026年4月下旬",
      playerId: undefined, // Nilson Angulo
    },
    {
      playerName: "ロメイン・マンドル",
      reason: "ハムストリング損傷",
      status: "injury",
      returnDate: "2026年5月下旬",
      playerId: undefined, // Romaine Mundle
    },
  ],
  scorePrediction: {
    homeGoals: 2,
    awayGoals: 1,
    homeWinPct: 48,
    drawPct: 27,
    awayWinPct: 25,
    comment: "セント・ジェームズ・パークの熱狂的なサポーターを背に、ニューカッスルがタインウェアダービーをホームで制すると予想。ただし勝ち点差2の僅差で、サンダーランドも一発逆転の力を秘めている。",
  },
};
