"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CustomTooltip,
  type ChartPanelProps,
  type CustomTooltipProps,
} from "./chart-shared";

const SP_TICKS = [1, 5, 10, 15, 20, 25, 30, 35, 38];

// ─── Custom Legend ────────────────────────────────────────

interface LegendEntry {
  value?: string;
  color?: string;
}

function SpLegend({ payload }: { payload?: LegendEntry[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 16px",
        justifyContent: "center",
        padding: "12px 0 0",
      }}
    >
      {(payload ?? []).map((entry, i) => (
        <span
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            color: "#555",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 24,
              height: 3,
              background: entry.color,
              borderRadius: 2,
            }}
          />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

// ─── RaceChartSP ─────────────────────────────────────────

export default function RaceChartSP({
  chartData,
  activeTimelines,
  dramaticMoments,
}: ChartPanelProps) {
  return (
    <div style={{ height: 420 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
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
          <Legend
            verticalAlign="bottom"
            height={60}
            content={(props) => (
              <SpLegend payload={props.payload as LegendEntry[]} />
            )}
          />

          {/* 実績ライン */}
          {activeTimelines.map((tl) => (
            <Line
              key={tl.teamId}
              type="monotone"
              dataKey={tl.teamShortName}
              name={tl.teamShortName}
              stroke={tl.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: tl.color }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
