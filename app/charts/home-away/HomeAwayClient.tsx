"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import type { HomeAwayStats } from "@/lib/chart-utils";

interface Props {
  stats: HomeAwayStats[];
}

function formatDiff(n: number) {
  return n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
}

function DiffBadge({ diff }: { diff: number }) {
  if (diff >= 0.5) {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-mono tabular-nums bg-green-50 text-green-700">
        +{diff.toFixed(2)}pt
      </span>
    );
  }
  if (diff <= -0.5) {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-mono tabular-nums bg-blue-50 text-blue-700">
        {diff.toFixed(2)}pt
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-xs font-mono tabular-nums bg-gray-100 text-gray-500">
      {diff.toFixed(2)}pt
    </span>
  );
}

function DiffCell({ diff }: { diff: number }) {
  if (diff >= 0.5) {
    return (
      <span className="font-mono tabular-nums text-green-600">
        {formatDiff(diff)}
      </span>
    );
  }
  if (diff <= -0.5) {
    return (
      <span className="font-mono tabular-nums text-blue-600">
        {formatDiff(diff)}
      </span>
    );
  }
  return (
    <span className="font-mono tabular-nums text-gray-400">
      {formatDiff(diff)}
    </span>
  );
}

export default function HomeAwayClient({ stats }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const gridColor = isDark ? "#374151" : "#f0f0f0";
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const axisTickColor = isDark ? "#9ca3af" : undefined;

  // セクション1 用ソート（絶対的なPPGの高さで順位付け）
  const homeStrong = [...stats].sort((a, b) => b.home.ppg - a.home.ppg).slice(0, 5);
  const awayStrong = [...stats].sort((a, b) => b.away.ppg - a.away.ppg).slice(0, 5);

  // セクション2 棒グラフ（ホーム勝点降順）
  const chartData = [...stats]
    .sort((a, b) => b.home.points - a.home.points)
    .map((s) => ({
      name: s.shortName,
      ホーム: s.home.points,
      アウェイ: s.away.points,
    }));

  // セクション3 テーブル（ホーム勝点降順）
  const tableData = [...stats].sort((a, b) => b.home.points - a.home.points);

  // statsMap for Tooltip lookup
  const statsMap = new Map(stats.map((s) => [s.shortName, s]));

  interface TooltipArgs {
    active?: boolean;
    payload?: Array<{ payload: { name: string } }>;
  }
  const CustomTooltip = ({ active, payload }: TooltipArgs) => {
    if (!active || !payload?.length) return null;
    const s = statsMap.get(payload[0]?.payload?.name ?? "");
    if (!s) return null;
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm p-3 text-xs min-w-[180px]">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{s.teamName}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
          <div>
            <p className="text-pn-blue font-medium mb-1">ホーム</p>
            <p className="text-gray-600 dark:text-gray-400">{s.home.played}試合 {s.home.won}勝{s.home.drawn}分{s.home.lost}負</p>
            <p className="text-gray-600 dark:text-gray-400">得{s.home.goalsFor} 失{s.home.goalsAgainst}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{s.home.points}pt (PPG {s.home.ppg.toFixed(2)})</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">アウェイ</p>
            <p className="text-gray-600 dark:text-gray-400">{s.away.played}試合 {s.away.won}勝{s.away.drawn}分{s.away.lost}負</p>
            <p className="text-gray-600 dark:text-gray-400">得{s.away.goalsFor} 失{s.away.goalsAgainst}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{s.away.points}pt (PPG {s.away.ppg.toFixed(2)})</p>
          </div>
        </div>
      </div>
    );
  };

  const customLegend = () => (
    <div style={{ display: "flex", gap: 16, justifyContent: "center", fontSize: 12 }}>
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ background: "#00a8e8", width: 12, height: 12, display: "inline-block", marginRight: 4 }} />
        ホーム
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ background: "#d1d5db", width: 12, height: 12, display: "inline-block", marginRight: 4 }} />
        アウェイ
      </span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* ─── セクション1: ホーム強豪・アウェイ強豪 TOP5 ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ホームが強いチーム */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-green-50 dark:bg-green-950/30">
            <h2 className="text-sm font-semibold text-green-800 dark:text-green-300">
              ホームが強いチーム TOP5
            </h2>
            <p className="text-xs text-green-600 dark:text-green-400">ホームPPGが高い順</p>
          </div>
          <ul>
            {homeStrong.map((s, i) => (
              <li
                key={s.teamId}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono tabular-nums w-4">{i + 1}</span>
                <Image src={s.crestUrl} alt={s.teamName} width={20} height={20} className="object-contain shrink-0" />
                <span className="text-sm text-gray-900 dark:text-gray-100 flex-1 min-w-0 truncate">{s.shortName}</span>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold font-mono tabular-nums text-green-700 dark:text-green-400">
                    ホーム {s.home.ppg.toFixed(2)} PPG
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-mono tabular-nums">
                    アウェイ {s.away.ppg.toFixed(2)} PPG
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* アウェイが強いチーム */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-blue-50 dark:bg-blue-950/30">
            <h2 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
              アウェイが強いチーム TOP5
            </h2>
            <p className="text-xs text-blue-600 dark:text-blue-400">アウェイPPGが高い順</p>
          </div>
          <ul>
            {awayStrong.map((s, i) => (
              <li
                key={s.teamId}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-xs text-gray-400 font-mono tabular-nums w-4">{i + 1}</span>
                <Image src={s.crestUrl} alt={s.teamName} width={20} height={20} className="object-contain shrink-0" />
                <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{s.shortName}</span>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold font-mono tabular-nums text-blue-700 dark:text-blue-400">
                    アウェイ {s.away.ppg.toFixed(2)} PPG
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-mono tabular-nums">
                    ホーム {s.home.ppg.toFixed(2)} PPG
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── セクション2: 全チーム横棒グラフ ─────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
          全チーム ホーム vs アウェイ 勝点比較
        </h2>

        {/* PC */}
        <div className="hidden md:block">
          <ResponsiveContainer width="100%" height={700}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: axisColor }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: axisColor }}
                width={72}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={customLegend} />
              <Bar dataKey="ホーム" fill="#00a8e8" barSize={14} radius={[0, 2, 2, 0]}>
                <LabelList dataKey="ホーム" position="right" style={{ fontSize: 10, fill: "#00a8e8" }} />
              </Bar>
              <Bar dataKey="アウェイ" fill="#d1d5db" barSize={14} radius={[0, 2, 2, 0]}>
                <LabelList dataKey="アウェイ" position="right" style={{ fontSize: 10, fill: "#9ca3af" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SP */}
        <div className="md:hidden overflow-x-auto">
          <div style={{ minWidth: 500 }}>
            <BarChart
              layout="vertical"
              width={500}
              height={600}
              data={chartData}
              margin={{ top: 4, right: 44, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                width={64}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={customLegend} />
              <Bar dataKey="ホーム" fill="#00a8e8" barSize={12} radius={[0, 2, 2, 0]}>
                <LabelList dataKey="ホーム" position="right" style={{ fontSize: 9, fill: "#00a8e8" }} />
              </Bar>
              <Bar dataKey="アウェイ" fill="#d1d5db" barSize={12} radius={[0, 2, 2, 0]}>
                <LabelList dataKey="アウェイ" position="right" style={{ fontSize: 9, fill: "#9ca3af" }} />
              </Bar>
            </BarChart>
          </div>
        </div>
      </div>

      {/* ─── セクション3: 詳細テーブル ────────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">詳細スタッツ</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-3 py-2 text-left">クラブ</th>
                <th className="px-2 py-2 text-center">H 試合</th>
                <th className="px-2 py-2 text-center">H 勝点</th>
                <th className="px-2 py-2 text-center hidden md:table-cell">H 得点</th>
                <th className="px-2 py-2 text-center hidden md:table-cell">H 失点</th>
                <th className="px-2 py-2 text-center">A 試合</th>
                <th className="px-2 py-2 text-center">A 勝点</th>
                <th className="px-2 py-2 text-center hidden md:table-cell">A 得点</th>
                <th className="px-2 py-2 text-center hidden md:table-cell">A 失点</th>
                <th className="px-2 py-2 text-center">差</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((s) => (
                <tr
                  key={s.teamId}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Image src={s.crestUrl} alt={s.teamName} width={18} height={18} className="object-contain shrink-0" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{s.shortName}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center font-mono tabular-nums text-gray-700 dark:text-gray-300">{s.home.played}</td>
                  <td className="px-2 py-2.5 text-center font-mono tabular-nums font-semibold text-gray-900 dark:text-gray-100">{s.home.points}</td>
                  <td className="px-2 py-2.5 text-center font-mono tabular-nums text-gray-700 dark:text-gray-300 hidden md:table-cell">{s.home.goalsFor}</td>
                  <td className="px-2 py-2.5 text-center font-mono tabular-nums text-gray-700 dark:text-gray-300 hidden md:table-cell">{s.home.goalsAgainst}</td>
                  <td className="px-2 py-2.5 text-center font-mono tabular-nums text-gray-700 dark:text-gray-300">{s.away.played}</td>
                  <td className="px-2 py-2.5 text-center font-mono tabular-nums font-semibold text-gray-900 dark:text-gray-100">{s.away.points}</td>
                  <td className="px-2 py-2.5 text-center font-mono tabular-nums text-gray-700 dark:text-gray-300 hidden md:table-cell">{s.away.goalsFor}</td>
                  <td className="px-2 py-2.5 text-center font-mono tabular-nums text-gray-700 dark:text-gray-300 hidden md:table-cell">{s.away.goalsAgainst}</td>
                  <td className="px-2 py-2.5 text-center">
                    <DiffCell diff={s.homeDiff} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
