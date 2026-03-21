import { NextResponse } from "next/server";
import { getFeaturedMatchDetail } from "@/lib/football-api";
import { FEATURED_MATCH_CONFIG } from "@/lib/match-preview-data";

/**
 * GET /api/live-match
 *
 * 注目カードのライブスコア・ゴール情報を返すエンドポイント。
 * クライアントサイドから 60 秒ごとにポーリングされる。
 * Next.js ルートキャッシュは無効にし、fetchFootball の ISR キャッシュ（60秒）に委ねる。
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const match = await getFeaturedMatchDetail(
      FEATURED_MATCH_CONFIG.homeTeamId,
      FEATURED_MATCH_CONFIG.awayTeamId,
    );

    if (!match) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    return NextResponse.json({
      found: true,
      status: match.status,
      score: match.score,
      goals: match.goals ?? [],
    });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
