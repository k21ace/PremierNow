import type { Match, Standing, TeamTimeline } from "@/types/football";
import { getTeamColor } from "./team-colors";

// ─── TeamStyle ────────────────────────────────────────────

export interface TeamStyle {
  teamId: number;
  teamName: string;
  shortName: string;
  crestUrl: string;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  played: number;
  ppg: number;
}

/**
 * 順位表データから各チームの攻撃力・守備力スタイルを算出する。
 * ScatterChart の散布図データとして使用する。
 */
export function calcTeamStyles(standings: Standing[]): TeamStyle[] {
  return standings.map((s) => ({
    teamId: s.team.id,
    teamName: s.team.name,
    shortName: s.team.shortName,
    crestUrl: s.team.crest,
    goalsFor: s.goalsFor,
    goalsAgainst: s.goalsAgainst,
    points: s.points,
    played: s.playedGames,
    ppg: s.playedGames > 0 ? s.points / s.playedGames : 0,
  }));
}

const TOTAL_MATCHDAYS = 38;

/** ドラマチックな瞬間（首位交代・大幅順位変動・直接対決） */
export interface DramaticMoment {
  matchday: number;
  description: string;
  isHeadToHead?: boolean;
}

/**
 * 終了済み試合データから各チームの節ごとの勝点推移を計算する。
 *
 * - 試合未消化の節（ブランクGW）は前節の勝点を引き継ぐ
 * - 直近5節の avgPPG から38節まで予測勝点を計算する
 * - 返り値は最終勝点の降順でソート済み
 */
export function calcPointsTimeline(matches: Match[]): TeamTimeline[] {
  if (matches.length === 0) return [];

  // 全チームを収集
  const teamsMap = new Map<number, { id: number; name: string; shortName: string; tla: string; crest: string }>();
  for (const m of matches) {
    teamsMap.set(m.homeTeam.id, m.homeTeam);
    teamsMap.set(m.awayTeam.id, m.awayTeam);
  }

  // matchday でグループ化
  const byMatchday = new Map<number, Match[]>();
  for (const m of matches) {
    if (!byMatchday.has(m.matchday)) byMatchday.set(m.matchday, []);
    byMatchday.get(m.matchday)!.push(m);
  }

  const maxMatchday = Math.max(...matches.map((m) => m.matchday));
  const timelines: TeamTimeline[] = [];

  for (const [teamId, team] of teamsMap) {
    let cumulative = 0;
    const points: number[] = [];

    for (let day = 1; day <= maxMatchday; day++) {
      const dayMatches = byMatchday.get(day) ?? [];
      const match = dayMatches.find(
        (m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId,
      );
      if (match) {
        const isHome = match.homeTeam.id === teamId;
        const home = match.score.fullTime.home ?? 0;
        const away = match.score.fullTime.away ?? 0;
        if (home === away) {
          cumulative += 1;
        } else if ((isHome && home > away) || (!isHome && away > home)) {
          cumulative += 3;
        }
      }
      points.push(cumulative);
    }

    // avgPPG: 直近5節のデルタ平均
    const last5Deltas: number[] = [];
    for (let i = Math.max(1, points.length - 5); i < points.length; i++) {
      last5Deltas.push(points[i] - points[i - 1]);
    }
    const avgPPG =
      last5Deltas.length > 0
        ? last5Deltas.reduce((a, b) => a + b, 0) / last5Deltas.length
        : 1;

    // predictedPoints: 現在節（index 0）〜38節
    const currentPoints = points[points.length - 1];
    const remaining = TOTAL_MATCHDAYS - maxMatchday;
    const predictedPoints: number[] = [currentPoints];
    for (let i = 1; i <= remaining; i++) {
      predictedPoints.push(Math.round(currentPoints + avgPPG * i));
    }

    timelines.push({
      teamId,
      teamName: team.name,
      teamShortName: team.tla,
      color: getTeamColor(teamId),
      crestUrl: team.crest,
      points,
      avgPPG,
      predictedPoints,
    });
  }

  return timelines.sort((a, b) => (b.points.at(-1) ?? 0) - (a.points.at(-1) ?? 0));
}

/**
 * タイムラインから「ドラマチックな瞬間」を検出する。
 * - 首位が交代した節
 * - 1節で3位以上の順位変動があったチームがいる節
 * 最大3件を重篤度の高い順で返す。
 */
export function detectDramaticMoments(timelines: TeamTimeline[]): DramaticMoment[] {
  if (timelines.length < 2) return [];

  const maxMatchday = timelines[0].points.length;
  const scored: (DramaticMoment & { severity: number })[] = [];

  let prevRanks: Record<number, number> = {};
  let prevLeaderId: number | null = null;

  for (let day = 1; day <= maxMatchday; day++) {
    const standings = timelines
      .map((tl) => ({ teamId: tl.teamId, teamShortName: tl.teamShortName, points: tl.points[day - 1] }))
      .sort((a, b) => b.points - a.points);

    const currentRanks: Record<number, number> = {};
    standings.forEach((s, i) => { currentRanks[s.teamId] = i + 1; });

    const currentLeaderId = standings[0].teamId;

    if (day >= 2) {
      // 首位交代
      if (prevLeaderId !== null && currentLeaderId !== prevLeaderId) {
        const newLeader = timelines.find((tl) => tl.teamId === currentLeaderId);
        scored.push({
          matchday: day,
          description: `${newLeader?.teamShortName ?? "?"} 首位浮上`,
          severity: 3,
        });
      }

      // 3位以上の順位変動
      for (const tl of timelines) {
        const prev = prevRanks[tl.teamId] ?? 0;
        const curr = currentRanks[tl.teamId] ?? 0;
        if (prev === 0) continue;
        const swing = prev - curr; // 正 = 順位上昇
        if (Math.abs(swing) >= 3) {
          scored.push({
            matchday: day,
            description: `${tl.teamShortName} ${swing > 0 ? "▲" : "▼"}${Math.abs(swing)}位`,
            severity: Math.abs(swing),
          });
        }
      }
    }

    prevRanks = currentRanks;
    prevLeaderId = currentLeaderId;
  }

  // matchday ごとに最大重篤度のものを1件にまとめ、上位3件を返す
  const byMatchday = new Map<number, (typeof scored)[0]>();
  for (const m of scored) {
    const existing = byMatchday.get(m.matchday);
    if (!existing || existing.severity < m.severity) {
      byMatchday.set(m.matchday, m);
    }
  }

  return [...byMatchday.values()]
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3)
    .map(({ matchday, description }) => ({ matchday, description }));
}

/**
 * 最終順位1位・2位の直接対決を試合データから検出する。
 * - timelines は最終勝点降順ソート済みを前提とする（index 0=1位, index 1=2位）
 * - 返り値は matchday 昇順、最大2件
 */
export function detectHeadToHead(
  timelines: TeamTimeline[],
  matches: Match[],
): DramaticMoment[] {
  if (timelines.length < 2) return [];

  const team1Id = timelines[0].teamId;
  const team2Id = timelines[1].teamId;
  const team1Tla = timelines[0].teamShortName;
  const team2Tla = timelines[1].teamShortName;

  const h2hMatches = matches
    .filter(
      (m) =>
        m.status === "FINISHED" &&
        ((m.homeTeam.id === team1Id && m.awayTeam.id === team2Id) ||
          (m.homeTeam.id === team2Id && m.awayTeam.id === team1Id)),
    )
    .sort((a, b) => a.matchday - b.matchday)
    .slice(0, 2);

  return h2hMatches.map((m) => {
    const home = m.score.fullTime.home ?? 0;
    const away = m.score.fullTime.away ?? 0;
    const homeTla = m.homeTeam.id === team1Id ? team1Tla : team2Tla;
    const awayTla = m.awayTeam.id === team1Id ? team1Tla : team2Tla;
    return {
      matchday: m.matchday,
      description: `${homeTla} vs ${awayTla} (${home}–${away})`,
      isHeadToHead: true,
    };
  });
}
