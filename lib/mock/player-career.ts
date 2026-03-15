/**
 * 選手キャリア履歴 モックデータ
 * クラブのcrestUrlはfootball-data.org形式（PL所属クラブのみ設定）
 */

export type PlayerCareerEntry = {
  season: string; // 例: "2022-23"
  club: string;
  crestUrl?: string; // エンブレムURL（football-data.org）
  goals: number;
  assists: number;
  appearances: number;
  note?: string; // 例: "ローン移籍"
};

export type PlayerCareer = {
  playerId: number;
  career: PlayerCareerEntry[];
};

// football-data.org クレストURL（チームID）
const CREST = {
  manCity: "https://crests.football-data.org/65.png",
  arsenal: "https://crests.football-data.org/57.png",
  liverpool: "https://crests.football-data.org/64.png",
  manUtd: "https://crests.football-data.org/66.png",
  astonVilla: "https://crests.football-data.org/58.png",
  chelsea: "https://crests.football-data.org/61.png",
};

export const playerCareerData: PlayerCareer[] = [
  {
    // Erling Haaland (570) - Man City
    playerId: 570,
    career: [
      {
        season: "2025-26",
        club: "Manchester City",
        crestUrl: CREST.manCity,
        goals: 22,
        assists: 6,
        appearances: 28,
      },
      {
        season: "2024-25",
        club: "Manchester City",
        crestUrl: CREST.manCity,
        goals: 27,
        assists: 5,
        appearances: 31,
      },
      {
        season: "2023-24",
        club: "Manchester City",
        crestUrl: CREST.manCity,
        goals: 22,
        assists: 7,
        appearances: 29,
      },
      {
        season: "2022-23",
        club: "Manchester City",
        crestUrl: CREST.manCity,
        goals: 36,
        assists: 8,
        appearances: 35,
      },
      {
        season: "2021-22",
        club: "Borussia Dortmund",
        goals: 22,
        assists: 8,
        appearances: 24,
      },
      {
        season: "2020-21",
        club: "Borussia Dortmund",
        goals: 27,
        assists: 8,
        appearances: 28,
      },
      {
        season: "2019-20",
        club: "Borussia Dortmund / RB Salzburg",
        goals: 19,
        assists: 6,
        appearances: 22,
        note: "1月にBVBへ移籍",
      },
    ],
  },

  {
    // Bukayo Saka (432008) - Arsenal
    playerId: 432008,
    career: [
      {
        season: "2025-26",
        club: "Arsenal",
        crestUrl: CREST.arsenal,
        goals: 14,
        assists: 12,
        appearances: 32,
      },
      {
        season: "2024-25",
        club: "Arsenal",
        crestUrl: CREST.arsenal,
        goals: 12,
        assists: 10,
        appearances: 30,
      },
      {
        season: "2023-24",
        club: "Arsenal",
        crestUrl: CREST.arsenal,
        goals: 16,
        assists: 9,
        appearances: 35,
      },
      {
        season: "2022-23",
        club: "Arsenal",
        crestUrl: CREST.arsenal,
        goals: 14,
        assists: 11,
        appearances: 38,
      },
      {
        season: "2021-22",
        club: "Arsenal",
        crestUrl: CREST.arsenal,
        goals: 11,
        assists: 7,
        appearances: 38,
      },
      {
        season: "2020-21",
        club: "Arsenal",
        crestUrl: CREST.arsenal,
        goals: 5,
        assists: 7,
        appearances: 32,
      },
    ],
  },

  {
    // Mohamed Salah (8004) - Liverpool
    playerId: 8004,
    career: [
      {
        season: "2025-26",
        club: "Liverpool",
        crestUrl: CREST.liverpool,
        goals: 20,
        assists: 14,
        appearances: 32,
      },
      {
        season: "2024-25",
        club: "Liverpool",
        crestUrl: CREST.liverpool,
        goals: 29,
        assists: 18,
        appearances: 37,
      },
      {
        season: "2023-24",
        club: "Liverpool",
        crestUrl: CREST.liverpool,
        goals: 18,
        assists: 10,
        appearances: 32,
      },
      {
        season: "2022-23",
        club: "Liverpool",
        crestUrl: CREST.liverpool,
        goals: 19,
        assists: 12,
        appearances: 32,
      },
      {
        season: "2021-22",
        club: "Liverpool",
        crestUrl: CREST.liverpool,
        goals: 23,
        assists: 13,
        appearances: 35,
      },
      {
        season: "2020-21",
        club: "Liverpool",
        crestUrl: CREST.liverpool,
        goals: 22,
        assists: 5,
        appearances: 31,
      },
      {
        season: "2016-17",
        club: "AS Roma",
        goals: 15,
        assists: 11,
        appearances: 31,
        note: "ローン移籍後に移籍",
      },
      {
        season: "2015-16",
        club: "Fiorentina",
        goals: 9,
        assists: 4,
        appearances: 26,
        note: "ローン移籍",
      },
      {
        season: "2014-15",
        club: "Chelsea",
        crestUrl: CREST.chelsea,
        goals: 0,
        assists: 0,
        appearances: 3,
      },
    ],
  },

  {
    // Martin Ødegaard (373) - Arsenal
    playerId: 373,
    career: [
      {
        season: "2025-26",
        club: "Arsenal",
        crestUrl: CREST.arsenal,
        goals: 8,
        assists: 10,
        appearances: 27,
      },
      {
        season: "2024-25",
        club: "Arsenal",
        crestUrl: CREST.arsenal,
        goals: 6,
        assists: 8,
        appearances: 22,
      },
      {
        season: "2023-24",
        club: "Arsenal",
        crestUrl: CREST.arsenal,
        goals: 8,
        assists: 10,
        appearances: 35,
      },
      {
        season: "2022-23",
        club: "Arsenal",
        crestUrl: CREST.arsenal,
        goals: 15,
        assists: 7,
        appearances: 36,
      },
      {
        season: "2021-22",
        club: "Arsenal",
        crestUrl: CREST.arsenal,
        goals: 7,
        assists: 7,
        appearances: 33,
      },
      {
        season: "2020-21",
        club: "Real Sociedad",
        goals: 4,
        assists: 2,
        appearances: 19,
        note: "ローン移籍",
      },
      {
        season: "2019-20",
        club: "Real Sociedad",
        goals: 7,
        assists: 4,
        appearances: 31,
        note: "ローン移籍",
      },
    ],
  },

  {
    // Marcus Rashford (3664) - Manchester United
    playerId: 3664,
    career: [
      {
        season: "2025-26",
        club: "Aston Villa",
        crestUrl: CREST.astonVilla,
        goals: 7,
        assists: 4,
        appearances: 18,
        note: "ローン移籍",
      },
      {
        season: "2024-25",
        club: "Manchester United",
        crestUrl: CREST.manUtd,
        goals: 7,
        assists: 3,
        appearances: 26,
      },
      {
        season: "2023-24",
        club: "Manchester United",
        crestUrl: CREST.manUtd,
        goals: 8,
        assists: 5,
        appearances: 33,
      },
      {
        season: "2022-23",
        club: "Manchester United",
        crestUrl: CREST.manUtd,
        goals: 17,
        assists: 6,
        appearances: 35,
      },
      {
        season: "2021-22",
        club: "Manchester United",
        crestUrl: CREST.manUtd,
        goals: 5,
        assists: 9,
        appearances: 25,
      },
      {
        season: "2020-21",
        club: "Manchester United",
        crestUrl: CREST.manUtd,
        goals: 21,
        assists: 15,
        appearances: 37,
      },
    ],
  },
];

/**
 * 選手IDからキャリアデータを取得する
 */
export function getPlayerCareer(playerId: number): PlayerCareer | null {
  return playerCareerData.find((p) => p.playerId === playerId) ?? null;
}
