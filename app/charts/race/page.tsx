import { getMatches, getStandings, getHomeAwayStandings } from "@/lib/football-api";
import { calcPointsTimeline, calcTeamStyles, calcHomeAwayStats } from "@/lib/chart-utils";
import { getUnderstatTeams, getUnderstatPlayers, calcTeamXgStats } from "@/lib/understat";
import { matchToSimulator } from "@/lib/simulator-utils";
import RaceChart from "./RaceChart";
import XgClient from "../xg/XgClient";
import StyleChartPC from "@/components/charts/StyleChartPC";
import StyleChartSP from "@/components/charts/StyleChartSP";
import HomeAwayClient from "../home-away/HomeAwayClient";
import SimulatorClient from "../simulator/SimulatorClient";
import { createMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = createMetadata(
  "プレミアリーグ 分析 2025-26 | PremierNow",
  "レースチャート・xG分析・スタイル分析・H/A比較・順位予測を一画面で。",
  "/charts/race",
  "プレミアリーグ 分析 2025-26",
);

export default async function AnalysisPage() {
  // ─── データ取得 ────────────────────────────────────────
  const [finishedData, standingsData, homeAwayData, scheduledData] = await Promise.all([
    getMatches({ status: "FINISHED" }),
    getStandings(),
    getHomeAwayStandings(),
    getMatches({ status: "SCHEDULED" }),
  ]);

  // レースチャート
  const timelines = calcPointsTimeline(finishedData.matches ?? []);
  const table =
    standingsData.standings.find((s) => s.type === "TOTAL")?.table ?? [];
  const groupTeamIds = {
    title: table.slice(0, 3).map((s) => s.team.id),
    cl: table.slice(2, 7).map((s) => s.team.id),
    relegation: table.slice(15, 20).map((s) => s.team.id),
  };
  const safeZoneTeamId = table[16]?.team.id ?? null;

  // スタイル分析
  const teamStyles = calcTeamStyles(table);
  const season = standingsData.season;
  const seasonLabel = season
    ? `${season.startDate.slice(0, 4)}–${season.endDate.slice(2, 4)}`
    : "";

  // H/A比較
  const haStats = calcHomeAwayStats(homeAwayData.home, homeAwayData.away);

  // 順位予測
  const standings =
    standingsData.standings.find((s) => s.type === "TOTAL")?.table ??
    standingsData.standings[0]?.table ?? [];
  const scheduledMatches = (scheduledData.matches ?? [])
    .filter((m) => m.status === "SCHEDULED" || m.status === "TIMED")
    .sort((a, b) => a.matchday - b.matchday);
  const allMatches = scheduledMatches.map(matchToSimulator);
  const allMatchdays = [...new Set(scheduledMatches.map((m) => m.matchday))].sort(
    (a, b) => a - b,
  );
  const displayMatchdays = allMatchdays.slice(0, 3);

  // xG（失敗しても他セクションに影響しない）
  let xgTeamStats = null;
  let xgPlayers = null;
  try {
    const [teamsData, playersData] = await Promise.all([
      getUnderstatTeams(2025),
      getUnderstatPlayers(2025),
    ]);
    xgTeamStats = calcTeamXgStats(teamsData);
    xgPlayers = playersData;
  } catch {
    // xGデータは任意
  }

  return (
    <main className="min-h-screen bg-pn-bg py-6 space-y-12">

      {/* ── レースチャート ── */}
      <section className="max-w-5xl mx-auto px-4">
        <RaceChart
          timelines={timelines}
          matches={finishedData.matches ?? []}
          groupTeamIds={groupTeamIds}
          safeZoneTeamId={safeZoneTeamId}
        />
      </section>

      {/* ── xG分析 ── */}
      <section className="max-w-5xl mx-auto px-4">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-1">
          xG 分析
          <span className="ml-2 text-sm font-normal text-gray-500">2025-26</span>
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Understat のデータをもとにした期待得点（xG）分析。
        </p>
        {xgTeamStats && xgPlayers ? (
          <XgClient teamStats={xgTeamStats} players={xgPlayers} />
        ) : (
          <div className="bg-white border border-gray-200 rounded p-8 text-center text-sm text-gray-500">
            データを取得できませんでした。しばらく経ってからアクセスしてください。
          </div>
        )}
      </section>

      {/* ── スタイル分析 ── */}
      <section className="max-w-5xl mx-auto px-4">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-1">
          攻撃スタイル分析
          {seasonLabel && (
            <span className="ml-2 text-sm font-normal text-gray-500">{seasonLabel}</span>
          )}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          右上ほど得点力・守備力ともに優れたチーム。中央の点線は全チームの平均値。
        </p>
        <div className="bg-white border border-gray-200 rounded shadow-sm p-2">
          <div className="hidden md:block">
            <StyleChartPC teamStyles={teamStyles} />
          </div>
          <div className="block md:hidden">
            <StyleChartSP teamStyles={teamStyles} />
          </div>
        </div>
      </section>

      {/* ── H/A比較 ── */}
      {/* HomeAwayClient は内部で max-w-5xl mx-auto px-4 を持つためセクションヘッダのみ別途配置 */}
      <section>
        <div className="max-w-5xl mx-auto px-4 mb-0">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            ホーム vs アウェイ 成績比較
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            ホームとアウェイで成績に差があるチームを分析します。
            差が大きいチームほどホームの雰囲気に影響されやすい傾向があります。
          </p>
        </div>
        <HomeAwayClient stats={haStats} />
      </section>

      {/* ── 順位予測 ── */}
      {/* SimulatorClient は内部でレイアウトを管理するためヘッダのみ別途配置 */}
      <section>
        <div className="max-w-5xl mx-auto px-4 mb-4">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            順位予測シミュレーター
          </h2>
        </div>
        <SimulatorClient
          standings={standings}
          allMatches={allMatches}
          displayMatchdays={displayMatchdays}
        />
      </section>

    </main>
  );
}
