"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CustomTooltip,
  type ChartPanelProps,
  type CustomTooltipProps,
} from "./chart-shared";

const SP_TICKS = [1, 5, 10, 15, 20, 25, 30, 35, 38];

// ─── End Dot（ライン末端にエンブレム）──────────────────

interface EndDotProps {
  cx?: number;
  cy?: number;
  index?: number;
  actualMaxMatchday: number;
  crestUrl: string;
  stroke: string;
  yOffset: number;
}

function EndDot({ cx, cy, index, actualMaxMatchday, crestUrl, stroke, yOffset }: EndDotProps) {
  if (index !== actualMaxMatchday - 1 || cx === undefined || cy === undefined) {
    return <g />;
  }
  const adjustedCy = cy + yOffset;
  return (
    <g>
      <line
        x1={cx} y1={cy}
        x2={cx + 8} y2={adjustedCy}
        stroke={stroke}
        strokeWidth={1}
      />
      <image
        href={crestUrl}
        x={cx + 10}
        y={adjustedCy - 10}
        width={20}
        height={20}
      />
    </g>
  );
}

// ─── RaceChartSP ─────────────────────────────────────────

export default function RaceChartSP({
  chartData,
  activeTimelines,
  maxMatchday,
  dramaticMoments,
}: ChartPanelProps) {
  // 最終勝点が同じチームのエンブレムy座標をずらす
  const teamOffsets = useMemo(() => {
    const finals = activeTimelines.map((tl) => tl.points.at(-1) ?? 0);
    const grouped: Record<number, number[]> = {};
    finals.forEach((pts, i) => {
      if (!grouped[pts]) grouped[pts] = [];
      grouped[pts].push(i);
    });
    const offsets: Record<number, number> = {};
    Object.values(grouped).forEach((indices) => {
      indices.forEach((idx, j) => {
        offsets[idx] = indices.length > 1
          ? (j - (indices.length - 1) / 2) * 14
          : 0;
      });
    });
    return offsets;
  }, [activeTimelines]);

  return (
    <div style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 60, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="matchday"
            ticks={SP_TICKS}
            tick={{ fontSize: 10 }}
            tickFormatter={(v: number) => String(v)}
            label={{
              value: "節",
              position: "insideBottomRight",
              offset: -4,
              fontSize: 10,
              fill: "#6b7280",
            }}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            width={28}
            label={{ value: "" }}
          />
          <Tooltip
            content={(props) => (
              <CustomTooltip
                {...(props as unknown as CustomTooltipProps)}
                dramaticMoments={dramaticMoments}
              />
            )}
          />

          {/* 実績ライン（末端エンブレム） */}
          {activeTimelines.map((tl, teamIdx) => (
            <Line
              key={tl.teamId}
              type="monotone"
              dataKey={tl.teamShortName}
              stroke={tl.color}
              strokeWidth={2}
              dot={(props: { cx?: number; cy?: number; index?: number }) => (
                <EndDot
                  {...props}
                  actualMaxMatchday={maxMatchday}
                  crestUrl={tl.crestUrl}
                  stroke={tl.color}
                  yOffset={teamOffsets[teamIdx] ?? 0}
                />
              )}
              activeDot={{ r: 4, fill: tl.color }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
