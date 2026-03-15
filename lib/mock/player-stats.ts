/**
 * 選手詳細スタッツ モックデータ
 * football-data.org の無料プランでは取得できない項目（シュート数・パス精度等）をモックで補完
 */

export type PlayerDetailStats = {
  playerId: number;
  season: number; // シーズン開始年 例: 2025 → 2025-26
  minutesPlayed: number;
  shots: number;
  shotsOnTarget: number;
  shotAccuracy: number; // %
  passAccuracy: number; // %
  keyPasses: number;
  dribbles: number;
  tackles: number;
  yellowCards: number;
  redCards: number;
};

export const playerDetailStatsData: PlayerDetailStats[] = [
  // ─── Erling Haaland (570) ─────────────────────────
  {
    playerId: 570,
    season: 2025,
    minutesPlayed: 2485,
    shots: 91,
    shotsOnTarget: 47,
    shotAccuracy: 52,
    passAccuracy: 67,
    keyPasses: 14,
    dribbles: 16,
    tackles: 4,
    yellowCards: 2,
    redCards: 0,
  },
  {
    playerId: 570,
    season: 2024,
    minutesPlayed: 2790,
    shots: 106,
    shotsOnTarget: 52,
    shotAccuracy: 49,
    passAccuracy: 65,
    keyPasses: 18,
    dribbles: 19,
    tackles: 5,
    yellowCards: 3,
    redCards: 0,
  },
  {
    playerId: 570,
    season: 2023,
    minutesPlayed: 2611,
    shots: 98,
    shotsOnTarget: 49,
    shotAccuracy: 50,
    passAccuracy: 64,
    keyPasses: 15,
    dribbles: 14,
    tackles: 3,
    yellowCards: 1,
    redCards: 0,
  },

  // ─── Mohamed Salah (8004) ─────────────────────────
  {
    playerId: 8004,
    season: 2025,
    minutesPlayed: 2718,
    shots: 68,
    shotsOnTarget: 34,
    shotAccuracy: 50,
    passAccuracy: 82,
    keyPasses: 64,
    dribbles: 72,
    tackles: 18,
    yellowCards: 1,
    redCards: 0,
  },
  {
    playerId: 8004,
    season: 2024,
    minutesPlayed: 2502,
    shots: 72,
    shotsOnTarget: 36,
    shotAccuracy: 50,
    passAccuracy: 80,
    keyPasses: 58,
    dribbles: 66,
    tackles: 20,
    yellowCards: 2,
    redCards: 0,
  },

  // ─── Bukayo Saka (432008) ─────────────────────────
  {
    playerId: 432008,
    season: 2025,
    minutesPlayed: 2880,
    shots: 74,
    shotsOnTarget: 34,
    shotAccuracy: 46,
    passAccuracy: 84,
    keyPasses: 72,
    dribbles: 88,
    tackles: 34,
    yellowCards: 3,
    redCards: 0,
  },
  {
    playerId: 432008,
    season: 2024,
    minutesPlayed: 2610,
    shots: 62,
    shotsOnTarget: 28,
    shotAccuracy: 45,
    passAccuracy: 83,
    keyPasses: 65,
    dribbles: 76,
    tackles: 29,
    yellowCards: 2,
    redCards: 0,
  },

  // ─── Martin Ødegaard (373) ────────────────────────
  {
    playerId: 373,
    season: 2025,
    minutesPlayed: 2430,
    shots: 52,
    shotsOnTarget: 24,
    shotAccuracy: 46,
    passAccuracy: 89,
    keyPasses: 96,
    dribbles: 42,
    tackles: 48,
    yellowCards: 4,
    redCards: 0,
  },
  {
    playerId: 373,
    season: 2024,
    minutesPlayed: 1980,
    shots: 40,
    shotsOnTarget: 18,
    shotAccuracy: 45,
    passAccuracy: 88,
    keyPasses: 72,
    dribbles: 36,
    tackles: 38,
    yellowCards: 3,
    redCards: 0,
  },

  // ─── Marcus Rashford (3664) ───────────────────────
  {
    playerId: 3664,
    season: 2025,
    minutesPlayed: 1620,
    shots: 38,
    shotsOnTarget: 16,
    shotAccuracy: 42,
    passAccuracy: 78,
    keyPasses: 28,
    dribbles: 44,
    tackles: 14,
    yellowCards: 2,
    redCards: 0,
  },
  {
    playerId: 3664,
    season: 2024,
    minutesPlayed: 2340,
    shots: 56,
    shotsOnTarget: 24,
    shotAccuracy: 43,
    passAccuracy: 79,
    keyPasses: 38,
    dribbles: 62,
    tackles: 18,
    yellowCards: 3,
    redCards: 1,
  },

  // ─── Son Heung-min (4897) ─────────────────────────
  {
    playerId: 4897,
    season: 2025,
    minutesPlayed: 2610,
    shots: 62,
    shotsOnTarget: 28,
    shotAccuracy: 45,
    passAccuracy: 81,
    keyPasses: 52,
    dribbles: 58,
    tackles: 22,
    yellowCards: 2,
    redCards: 0,
  },

  // ─── Cole Palmer (835029) ─────────────────────────
  {
    playerId: 835029,
    season: 2025,
    minutesPlayed: 2790,
    shots: 84,
    shotsOnTarget: 38,
    shotAccuracy: 45,
    passAccuracy: 82,
    keyPasses: 88,
    dribbles: 54,
    tackles: 28,
    yellowCards: 3,
    redCards: 0,
  },
  {
    playerId: 835029,
    season: 2024,
    minutesPlayed: 3150,
    shots: 96,
    shotsOnTarget: 44,
    shotAccuracy: 46,
    passAccuracy: 81,
    keyPasses: 96,
    dribbles: 62,
    tackles: 32,
    yellowCards: 4,
    redCards: 0,
  },

  // ─── Kevin De Bruyne (57) ─────────────────────────
  {
    playerId: 57,
    season: 2025,
    minutesPlayed: 1890,
    shots: 42,
    shotsOnTarget: 18,
    shotAccuracy: 43,
    passAccuracy: 88,
    keyPasses: 82,
    dribbles: 36,
    tackles: 30,
    yellowCards: 2,
    redCards: 0,
  },

  // ─── Alexander Isak (160295) ──────────────────────
  {
    playerId: 160295,
    season: 2025,
    minutesPlayed: 2520,
    shots: 76,
    shotsOnTarget: 38,
    shotAccuracy: 50,
    passAccuracy: 74,
    keyPasses: 24,
    dribbles: 42,
    tackles: 8,
    yellowCards: 1,
    redCards: 0,
  },

  // ─── Ollie Watkins (149252) ───────────────────────
  {
    playerId: 149252,
    season: 2025,
    minutesPlayed: 2700,
    shots: 68,
    shotsOnTarget: 32,
    shotAccuracy: 47,
    passAccuracy: 72,
    keyPasses: 22,
    dribbles: 28,
    tackles: 16,
    yellowCards: 2,
    redCards: 0,
  },
];

/**
 * 選手IDとシーズン年から詳細スタッツを取得する
 */
export function getPlayerDetailStats(
  playerId: number,
  season: number,
): PlayerDetailStats | null {
  return (
    playerDetailStatsData.find(
      (s) => s.playerId === playerId && s.season === season,
    ) ?? null
  );
}

/**
 * 選手IDの全シーズン詳細スタッツを取得する
 */
export function getPlayerDetailStatsAll(playerId: number): PlayerDetailStats[] {
  return playerDetailStatsData.filter((s) => s.playerId === playerId);
}
