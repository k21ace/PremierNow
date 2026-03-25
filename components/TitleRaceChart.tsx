"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import type { TeamTimeline } from "@/types/football";
import { calcProbabilities } from "@/lib/chart-utils";

interface TitleRaceChartProps {
  timelines: TeamTimeline[];
}

interface TeamEntry {
  teamId: number;
  shortName: string;
  crest: string;
  probability: number;
  color: string;
}

interface SectionProps {
  label: string;
  teams: TeamEntry[];
  started: boolean;
  link?: string;
}

const BUBBLE_MIN = 28;
const BUBBLE_MAX = 64;

function ProbSection({ label, teams, started, link }: SectionProps) {
  const maxProb = teams[0]?.probability ?? 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-1.5">
        <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{label}</p>
        {link && <Link href={link} className="text-xs text-[#00a8e8] hover:underline">詳細を見る →</Link>}
      </div>
      <div className="flex items-end gap-4 flex-wrap">
        {teams.map((team, index) => {
          const size = BUBBLE_MIN + (team.probability / maxProb) * (BUBBLE_MAX - BUBBLE_MIN);
          return (
            <div
              key={team.teamId}
              className="flex flex-col items-center gap-1"
              style={{
                opacity: started ? 1 : 0,
                transition: started ? `opacity 0.3s ease ${index * 0.07}s` : "none",
              }}
            >
              {/* バブル */}
              <div
                className="rounded-full border-2 flex items-center justify-center bg-white dark:bg-gray-900 overflow-hidden"
                style={{
                  width: started ? size : 0,
                  height: started ? size : 0,
                  borderColor: team.color,
                  transition: started
                    ? `width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.07}s, height 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.07}s`
                    : "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={team.crest}
                  alt={team.shortName}
                  style={{ width: "62%", height: "62%" }}
                  className="object-contain"
                />
              </div>
              {/* 確率 */}
              <span
                className="text-xs font-bold font-mono tabular-nums leading-none"
                style={{ color: team.color }}
              >
                {started ? team.probability : 0}%
              </span>
              {/* チーム名 */}
              <span
                className="text-[10px] text-gray-500 dark:text-gray-400 text-center leading-tight"
                style={{ maxWidth: BUBBLE_MAX }}
              >
                {team.shortName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TitleRaceChart({ timelines }: TitleRaceChartProps) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const maxMatchday = timelines[0]?.points.length ?? 0;

  const { titleTeams, clTeams, survivalTeams } = useMemo(() => {
    const probs = calcProbabilities(timelines, maxMatchday);

    const toEntry = (teamId: number, prob: number): TeamEntry | null => {
      const tl = timelines.find((t) => t.teamId === teamId);
      if (!tl) return null;
      return {
        teamId: tl.teamId,
        shortName: tl.teamShortName,
        crest: tl.crestUrl,
        probability: prob >= 1 ? 100 : Math.min(99, Math.round(prob * 100)),
        color: tl.color,
      };
    };

    const title = probs
      .map((p) => toEntry(p.teamId, p.titleProb))
      .filter((t): t is TeamEntry => t !== null && t.probability >= 1)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5);

    const cl = probs
      .map((p) => toEntry(p.teamId, p.clProb))
      .filter((t): t is TeamEntry => t !== null && t.probability >= 1 && t.probability < 100)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5);

    const survival = probs
      .map((p) => toEntry(p.teamId, p.survivalProb))
      .filter((t): t is TeamEntry => t !== null && t.probability < 100)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5);

    return { titleTeams: title, clTeams: cl, survivalTeams: survival };
  }, [timelines, maxMatchday]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setStarted(true), 100);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (titleTeams.length === 0) {
    return (
      <div>
        <p className="text-xs text-gray-400">データを読み込み中...</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="space-y-4">
      <ProbSection label="優勝確率" teams={titleTeams} started={started} link="/charts/race" />
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <ProbSection label="CL圏出場確率" teams={clTeams} started={started} />
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <ProbSection label="残留確率" teams={survivalTeams} started={started} />
      </div>

      <p className="text-[10px] text-gray-400">
        ※ 直近10試合の平均勝点をもとにモンテカルロシミュレーション（5,000回）で算出した推計値です
      </p>
    </div>
  );
}
