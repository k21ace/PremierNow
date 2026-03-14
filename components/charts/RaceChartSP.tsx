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

// ─── Custom Dot（20px エンブレム・ラベルなし）────────────

interface CustomDotProps {
  cx?: number;
  cy?: number;
  index?: number;
  actualMaxMatchday: number;
  crestUrl: string;
  teamName: string;
  stroke: string;
}

function CustomDot({
  cx,
  cy,
  index,
  actualMaxMatchday,
  crestUrl,
  teamName,
  stroke,
}: CustomDotProps) {
  if (index !== actualMaxMatchday - 1 || cx === undefined || cy === undefined) {
    return <g />;
  }
  const clipId = `crest-sp-${teamName}`;
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={10} />
        </clipPath>
      </defs>
      <image
        x={cx - 10}
        y={cy - 10}
        width={20}
        height={20}
        href={crestUrl}
        clipPath={`url(#${clipId})`}
      />
      <circle cx={cx} cy={cy} r={10} fill="none" stroke="white" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={11} fill="none" stroke={stroke} strokeWidth={1} />
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
  return (
    <div style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
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

          {/* 実績ラインのみ（予測・ハイライトなし） */}
          {activeTimelines.map((tl) => (
            <Line
              key={tl.teamId}
              type="monotone"
              dataKey={tl.teamShortName}
              stroke={tl.color}
              strokeWidth={2}
              dot={(props: { cx?: number; cy?: number; index?: number }) => (
                <CustomDot
                  {...props}
                  actualMaxMatchday={maxMatchday}
                  crestUrl={tl.crestUrl}
                  teamName={tl.teamShortName}
                  stroke={tl.color}
                />
              )}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
