"use client";

import { useState, useMemo } from "react";
import type { Match, TeamTimeline } from "@/types/football";
import { detectDramaticMoments, detectHeadToHead } from "@/lib/chart-utils";
import {
  buildChartData,
  type Group,
} from "@/components/charts/chart-shared";
import RaceChartPC from "@/components/charts/RaceChartPC";
import RaceChartSP from "@/components/charts/RaceChartSP";

// ─── Tab Config ───────────────────────────────────────────

const TAB_CONFIG: { key: Group; labelFull: string; labelShort: string }[] = [
  { key: "title",      labelFull: "優勝争い（上位3チーム）", labelShort: "優勝争い" },
  { key: "cl",         labelFull: "CL圏争い（3位〜7位）",    labelShort: "CL圏争い" },
  { key: "relegation", labelFull: "残留争い（16位〜20位）",  labelShort: "残留争い" },
];

// ─── RaceChart ───────────────────────────────────────────

interface RaceChartProps {
  timelines: TeamTimeline[];
  matches: Match[];
  groupTeamIds: {
    title: number[];
    cl: number[];
    relegation: number[];
  };
  safeZoneTeamId: number | null;
}

export default function RaceChart({
  timelines,
  matches,
  groupTeamIds,
  safeZoneTeamId,
}: RaceChartProps) {
  const [group, setGroup] = useState<Group>("title");

  const activeTeamIds = groupTeamIds[group];
  const activeTimelines = timelines.filter((tl) =>
    activeTeamIds.includes(tl.teamId),
  );
  const maxMatchday = activeTimelines[0]?.points.length ?? 0;

  const chartData = useMemo(
    () => buildChartData(activeTimelines, maxMatchday),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [group, maxMatchday],
  );

  const dramaticMoments = useMemo(() => {
    const regular = detectDramaticMoments(activeTimelines);
    const h2h = detectHeadToHead(timelines, matches);
    const h2hDays = new Set(h2h.map((m) => m.matchday));
    return [...regular.filter((m) => !h2hDays.has(m.matchday)), ...h2h].slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, matches]);

  const leaderFinalPoints = activeTimelines[0]?.points.at(-1) ?? 0;
  const safeZoneFinalPoints = safeZoneTeamId
    ? (timelines.find((tl) => tl.teamId === safeZoneTeamId)?.points.at(-1) ?? 0)
    : 0;

  const panelProps = {
    chartData,
    activeTimelines,
    maxMatchday,
    dramaticMoments,
    group,
    leaderFinalPoints,
    safeZoneFinalPoints,
  };

  return (
    <div>
      {/* タブ（3タブ均等幅・SP/PCラベル切り替え） */}
      <div className="flex gap-2 mb-4">
        {TAB_CONFIG.map(({ key, labelFull, labelShort }) => (
          <button
            key={key}
            onClick={() => setGroup(key)}
            className={`flex-1 py-1.5 text-sm rounded border transition-colors ${
              group === key
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span className="hidden md:inline">{labelFull}</span>
            <span className="md:hidden">{labelShort}</span>
          </button>
        ))}
      </div>

      {/* グラフ本体 */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        {/* PC版 */}
        <div className="hidden md:block">
          <RaceChartPC {...panelProps} />
        </div>
        {/* SP版 */}
        <div className="block md:hidden">
          <RaceChartSP {...panelProps} />
        </div>
      </div>
    </div>
  );
}
