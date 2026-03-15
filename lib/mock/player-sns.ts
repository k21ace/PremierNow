/**
 * 選手SNSアカウント モックデータ
 * football-data.org の player.id をキーとして管理
 */

export type PlayerSNS = {
  playerId: number;
  sns: {
    platform: "instagram" | "x" | "youtube" | "tiktok";
    url: string;
    handle: string;
  }[];
};

/** 主要選手のSNSアカウント一覧 */
export const playerSNSData: PlayerSNS[] = [
  {
    // Erling Haaland (Man City)
    playerId: 570,
    sns: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/erlinghaaland/",
        handle: "@erlinghaaland",
      },
      {
        platform: "x",
        url: "https://x.com/ErlingHaaland",
        handle: "@ErlingHaaland",
      },
    ],
  },
  {
    // Mohamed Salah (Liverpool)
    playerId: 8004,
    sns: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/mosalah/",
        handle: "@mosalah",
      },
      {
        platform: "x",
        url: "https://x.com/MoSalah",
        handle: "@MoSalah",
      },
      {
        platform: "youtube",
        url: "https://www.youtube.com/@mohamedsalah",
        handle: "@mohamedsalah",
      },
    ],
  },
  {
    // Bukayo Saka (Arsenal)
    playerId: 432008,
    sns: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/bukayosaka87/",
        handle: "@bukayosaka87",
      },
      {
        platform: "x",
        url: "https://x.com/BukayoSaka87",
        handle: "@BukayoSaka87",
      },
    ],
  },
  {
    // Martin Ødegaard (Arsenal)
    playerId: 373,
    sns: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/martinodegaard/",
        handle: "@martinodegaard",
      },
      {
        platform: "x",
        url: "https://x.com/Martinodegaard8",
        handle: "@Martinodegaard8",
      },
    ],
  },
  {
    // Marcus Rashford (Manchester United)
    playerId: 3664,
    sns: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/marcusrashford/",
        handle: "@marcusrashford",
      },
      {
        platform: "x",
        url: "https://x.com/MarcusRashford",
        handle: "@MarcusRashford",
      },
      {
        platform: "youtube",
        url: "https://www.youtube.com/@marcusrashford",
        handle: "@marcusrashford",
      },
    ],
  },
  {
    // Son Heung-min (Tottenham)
    playerId: 4897,
    sns: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/hm_son7/",
        handle: "@hm_son7",
      },
      {
        platform: "x",
        url: "https://x.com/HeiungMin",
        handle: "@HeiungMin",
      },
    ],
  },
  {
    // Cole Palmer (Chelsea)
    playerId: 835029,
    sns: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/cole.palmer/",
        handle: "@cole.palmer",
      },
    ],
  },
  {
    // Kevin De Bruyne (Man City)
    playerId: 57,
    sns: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/kevindebruyne/",
        handle: "@kevindebruyne",
      },
      {
        platform: "x",
        url: "https://x.com/KevinDeBruyne",
        handle: "@KevinDeBruyne",
      },
    ],
  },
  {
    // Alexander Isak (Newcastle)
    playerId: 160295,
    sns: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/alexanderisak/",
        handle: "@alexanderisak",
      },
      {
        platform: "x",
        url: "https://x.com/AlexanderIsak",
        handle: "@AlexanderIsak",
      },
    ],
  },
  {
    // Ollie Watkins (Aston Villa)
    playerId: 149252,
    sns: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/ollie.watkins_/",
        handle: "@ollie.watkins_",
      },
      {
        platform: "x",
        url: "https://x.com/OllieWatkins_9",
        handle: "@OllieWatkins_9",
      },
    ],
  },
];

/**
 * 選手IDからSNSデータを取得する
 * @returns 見つからない場合は null
 */
export function getPlayerSNS(playerId: number): PlayerSNS | null {
  return playerSNSData.find((p) => p.playerId === playerId) ?? null;
}
