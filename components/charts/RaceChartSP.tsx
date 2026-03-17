"use client";

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

// ─── End Dot（ライン末端にチーム名テキスト）────────────

interface EndDotProps {
  cx?: number;
  cy?: number;
  index?: number;
  actualMaxMatchday: number;
  teamName: string;
  stroke: string;
}

function EndDot({ cx, cy, index, actualMaxMatchday, teamName, stroke }: EndDotProps) {
  if (index !== actualMaxMatchday - 1 || cx === undefined || cy === undefined) {
    return <g />;
  }
  return (
    <text x={cx + 4} y={cy + 4} fontSize={9} fontWeight={600} fill={stroke}>
      {teamName}
    </text>
  );
}

// ─── RaceChartSP ─────────────────────────────────────────

export default function RaceChartSP({
  chartData,
  activeTimelines,
  maxMatchday,
  dramaticMoments,
}: ChartPanelProps) {
  return (
    <div style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 55, left: 0, bottom: 10 }}
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

          {/* 実績ライン（末端チーム名ラベル） */}
          {activeTimelines.map((tl) => (
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
                  teamName={tl.teamShortName}
                  stroke={tl.color}
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
