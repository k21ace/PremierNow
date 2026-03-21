"use client";

import { useState, useEffect } from "react";
import type { Goal, MatchStatus, Score } from "@/types/football";

export type LiveMatchData = {
  status: MatchStatus;
  score: Score;
  goals: Goal[];
};

type Props = {
  initialData: LiveMatchData;
  homeTeam: { id: number; shortName: string };
  awayTeam: { id: number; shortName: string };
};

const LIVE_STATUSES: MatchStatus[] = ["IN_PLAY", "PAUSED"];
const DONE_STATUSES: MatchStatus[] = ["FINISHED", "CANCELLED", "POSTPONED", "SUSPENDED"];

function StatusBadge({ status }: { status: MatchStatus }) {
  if (status === "IN_PLAY") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
        </span>
        LIVE
      </span>
    );
  }
  if (status === "PAUSED") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
        <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" />
        HT
      </span>
    );
  }
  if (status === "FINISHED") {
    return (
      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">FT</span>
    );
  }
  return null;
}

function GoalList({
  goals,
  homeTeamId,
  homeShortName,
  awayShortName,
}: {
  goals: Goal[];
  homeTeamId: number;
  homeShortName: string;
  awayShortName: string;
}) {
  if (goals.length === 0) return null;

  const sorted = [...goals].sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0));

  return (
    <div className="space-y-1 mt-2">
      {sorted.map((g, i) => {
        const isHome = g.team.id === homeTeamId;
        return (
          <div
            key={i}
            className={`flex items-center gap-1.5 text-xs ${isHome ? "justify-start" : "justify-end"}`}
          >
            {isHome ? (
              <>
                <span className="text-gray-400 dark:text-gray-500 font-mono tabular-nums text-[10px]">
                  {g.minute ?? "?"}′
                  {g.type === "OWN" && <span className="ml-0.5 text-red-400">(OG)</span>}
                  {g.type === "PENALTY" && <span className="ml-0.5 text-blue-400">(PK)</span>}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{g.scorer.name}</span>
                <span className="text-base leading-none">⚽</span>
              </>
            ) : (
              <>
                <span className="text-base leading-none">⚽</span>
                <span className="text-gray-700 dark:text-gray-300">{g.scorer.name}</span>
                <span className="text-gray-400 dark:text-gray-500 font-mono tabular-nums text-[10px]">
                  {g.minute ?? "?"}′
                  {g.type === "OWN" && <span className="ml-0.5 text-red-400">(OG)</span>}
                  {g.type === "PENALTY" && <span className="ml-0.5 text-blue-400">(PK)</span>}
                </span>
              </>
            )}
            <span className="text-[9px] text-gray-400 dark:text-gray-600 shrink-0">
              {isHome ? homeShortName : awayShortName}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function LiveScore({ initialData, homeTeam, awayTeam }: Props) {
  const [data, setData] = useState<LiveMatchData>(initialData);

  const isLive = LIVE_STATUSES.includes(data.status);
  const isDone = DONE_STATUSES.includes(data.status);
  const showScore = isLive || isDone;

  useEffect(() => {
    if (!isLive) return;

    const poll = async () => {
      try {
        const res = await fetch("/api/live-match");
        if (!res.ok) return;
        const json = await res.json();
        if (json.found) {
          setData({ status: json.status, score: json.score, goals: json.goals ?? [] });
        }
      } catch {
        // ネットワークエラーは無視して次のポーリングを待つ
      }
    };

    const id = setInterval(poll, 60_000);
    return () => clearInterval(id);
  }, [isLive]);

  if (!showScore) return null;

  const homeGoals = data.score.fullTime.home ?? 0;
  const awayGoals = data.score.fullTime.away ?? 0;
  const htHome = data.score.halfTime.home;
  const htAway = data.score.halfTime.away;

  return (
    <div className="mb-5">
      {/* ステータス + スコア */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {isDone ? "試合結果" : "現在のスコア"}
        </p>
        <StatusBadge status={data.status} />
      </div>

      <div className="flex items-center justify-center gap-4 mb-1">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-gray-400 dark:text-gray-500">{homeTeam.shortName}</span>
          <span className="font-mono font-bold text-3xl text-gray-900 dark:text-gray-100 tabular-nums">
            {homeGoals}
          </span>
        </div>
        <span className="text-xl font-bold text-gray-300 dark:text-gray-600">–</span>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-gray-400 dark:text-gray-500">{awayTeam.shortName}</span>
          <span className="font-mono font-bold text-3xl text-gray-900 dark:text-gray-100 tabular-nums">
            {awayGoals}
          </span>
        </div>
      </div>

      {/* ハーフタイムスコア（前半終了後に表示） */}
      {htHome !== null && htAway !== null && data.status !== "IN_PLAY" && (
        <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 font-mono tabular-nums mb-1">
          前半 {htHome} – {htAway}
        </p>
      )}

      {/* 得点者リスト */}
      <GoalList
        goals={data.goals}
        homeTeamId={homeTeam.id}
        homeShortName={homeTeam.shortName}
        awayShortName={awayTeam.shortName}
      />
    </div>
  );
}
