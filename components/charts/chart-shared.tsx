"use client";

import type { DramaticMoment } from "@/lib/chart-utils";
import type { TeamTimeline } from "@/types/football";

export type { DramaticMoment };
export type Group = "title" | "cl" | "relegation";

// ─── Chart Data ───────────────────────────────────────────

const TOTAL_MATCHDAYS = 38;

export function buildChartData(
  timelines: TeamTimeline[],
  maxMatchday: number,
): Record<string, number | undefined>[] {
  return Array.from({ length: TOTAL_MATCHDAYS }, (_, i) => {
    const matchday = i + 1;
    const point: Record<string, number | undefined> = { matchday };
    for (const tl of timelines) {
      if (matchday <= maxMatchday) {
        point[tl.teamShortName] = tl.points[i];
      }
      if (matchday >= maxMatchday) {
        const predIndex = matchday - maxMatchday;
        if (predIndex < tl.predictedPoints.length) {
          point[`${tl.teamShortName}_pred`] = tl.predictedPoints[predIndex];
        }
      }
    }
    return point;
  });
}

// ─── Annotation ───────────────────────────────────────────

export function getAnnotation(
  group: Group,
  finalPoints: number,
  leaderFinalPoints: number,
  safeZoneFinalPoints: number,
): { text: string; color: string } {
  if (group === "title") {
    const gap = leaderFinalPoints - finalPoints;
    return {
      text: gap === 0 ? "首位" : `-${gap}pt`,
      color: gap === 0 ? "#00a8e8" : "#ef4444",
    };
  } else if (group === "cl") {
    const gap = leaderFinalPoints - finalPoints;
    return {
      text: gap === 0 ? "3位" : `-${gap}pt`,
      color: gap === 0 ? "#3b82f6" : "#6b7280",
    };
  } else {
    const gap = Math.max(0, safeZoneFinalPoints - finalPoints);
    return {
      text: gap === 0 ? "残留" : `+${gap}pt`,
      color: "#3b82f6",
    };
  }
}

// ─── Shared Props ─────────────────────────────────────────

export interface ChartPanelProps {
  chartData: Record<string, number | undefined>[];
  activeTimelines: TeamTimeline[];
  maxMatchday: number;
  dramaticMoments: DramaticMoment[];
  group: Group;
  leaderFinalPoints: number;
  safeZoneFinalPoints: number;
}

// ─── Custom Tooltip ───────────────────────────────────────

interface TooltipEntry {
  dataKey: string | number;
  value: number;
  color: string;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: number;
  dramaticMoments?: DramaticMoment[];
}

export function CustomTooltip({
  active,
  payload,
  label,
  dramaticMoments = [],
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const drama = dramaticMoments.find((m) => m.matchday === label);
  const actual = [...payload]
    .filter((e) => !String(e.dataKey).endsWith("_pred"))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  const predicted = [...payload]
    .filter((e) => String(e.dataKey).endsWith("_pred"))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm p-3 text-xs min-w-[140px]">
      {drama && (
        <p className="text-pn-blue font-medium mb-1.5 text-[11px]">
          {drama.isHeadToHead ? "⚔" : "⚡"} {drama.description}
        </p>
      )}
      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">第{label}節</p>
      {actual.map((entry) => (
        <div
          key={String(entry.dataKey)}
          className="flex items-center justify-between gap-4 py-0.5"
        >
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ background: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">{String(entry.dataKey)}</span>
          </span>
          <span className="font-mono tabular-nums font-semibold text-gray-900 dark:text-gray-100">
            {entry.value}pt
          </span>
        </div>
      ))}
      {predicted.length > 0 && (
        <>
          {actual.length > 0 && <hr className="border-gray-100 dark:border-gray-800 my-1.5" />}
          <p className="text-[10px] text-gray-400 mb-1">予測</p>
          {predicted.map((entry) => (
            <div
              key={String(entry.dataKey)}
              className="flex items-center justify-between gap-4 py-0.5"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0 opacity-50"
                  style={{ background: entry.color }}
                />
                <span className="text-gray-400">
                  {String(entry.dataKey).replace("_pred", "")}
                </span>
              </span>
              <span className="font-mono tabular-nums text-gray-500">
                {entry.value}pt
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
