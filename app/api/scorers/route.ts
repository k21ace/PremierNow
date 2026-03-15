import { NextRequest, NextResponse } from "next/server";
import { getScorers } from "@/lib/football-api";
import { SEASONS } from "@/lib/seasons";

/**
 * GET /api/scorers?season={year}
 * クライアントサイドのシーズン切り替えに使用するプロキシ API Route。
 * サーバー側で football-data.org API キーを保持したまま JSON を返す。
 */
export async function GET(req: NextRequest) {
  const seasonParam = req.nextUrl.searchParams.get("season");
  const year = seasonParam ? Number(seasonParam) : undefined;

  // 有効なシーズン年かチェック（存在しないシーズンのリクエストを拒否）
  if (year !== undefined && !SEASONS.some((s) => s.year === year)) {
    return NextResponse.json({ error: "Invalid season" }, { status: 400 });
  }

  try {
    const data = await getScorers(year);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
