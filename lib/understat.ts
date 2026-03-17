import { unstable_cache } from "next/cache";

// ─── Types ────────────────────────────────────────────────

export type UnderstatMatchHistory = {
  xG: number;
  xGA: number;
  npxG: number;
  npxGA: number;
  scored: number;
  missed: number;
  result: "w" | "d" | "l";
  date: string;
  h_a: "h" | "a";
};

export type UnderstatTeam = {
  id: string;
  title: string;
  history: UnderstatMatchHistory[];
};

export type UnderstatPlayer = {
  id: string;
  player_name: string;
  team_title: string;
  games: string;
  goals: string;
  xG: string;
  assists: string;
  xA: string;
  shots: string;
  key_passes: string;
  npg: string;
  npxG: string;
};

export type TeamXgStats = {
  teamName: string;
  xG: number;
  xGA: number;
  scored: number;
  missed: number;
  xGDiff: number;
  xGADiff: number;
  npxG: number;
};

// ─── Session ──────────────────────────────────────────────

/** HTML を取得し Set-Cookie ヘッダーから PHPSESSID を返す */
async function getSessionCookie(season: number): Promise<string> {
  const res = await fetch(`https://understat.com/league/EPL/${season}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`Understat session fetch failed: ${res.status}`);
  // "PHPSESSID=xxx; ..., UID=xxx; ..." から全cookie文字列を組み立てる
  const raw = res.headers.getSetCookie?.() ?? [];
  if (raw.length) {
    return raw.map((c) => c.split(";")[0]).join("; ");
  }
  // Node 18 では getSetCookie() がない場合は get() にフォールバック
  return res.headers.get("set-cookie")?.split(",").map((c) => c.trim().split(";")[0]).join("; ") ?? "";
}

// ─── Base fetcher (session → API) ─────────────────────────

async function fetchLeagueData(
  season: number,
): Promise<{ teams: Record<string, UnderstatTeam>; players: UnderstatPlayer[] }> {
  const cookie = await getSessionCookie(season);

  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": `https://understat.com/league/EPL/${season}`,
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json, text/javascript, */*; q=0.01",
  };
  if (cookie) headers["Cookie"] = cookie;

  const res = await fetch(
    `https://understat.com/getLeagueData/EPL/${season}`,
    { headers },
  );
  if (!res.ok) throw new Error(`getLeagueData failed: ${res.status}`);

  const json = (await res.json()) as {
    teams: Record<string, UnderstatTeam>;
    players: UnderstatPlayer[];
  };
  return json;
}

// ─── Cached Fetchers ──────────────────────────────────────

export const getUnderstatTeams = unstable_cache(
  async (season: number = 2025): Promise<Record<string, UnderstatTeam>> => {
    const data = await fetchLeagueData(season);
    return data.teams;
  },
  ["understat-teams"],
  { revalidate: 86400 },
);

export const getUnderstatPlayers = unstable_cache(
  async (season: number = 2025): Promise<UnderstatPlayer[]> => {
    const data = await fetchLeagueData(season);
    return data.players;
  },
  ["understat-players"],
  { revalidate: 86400 },
);

// ─── Data Processing ──────────────────────────────────────

export function calcTeamXgStats(
  teams: Record<string, UnderstatTeam>,
): TeamXgStats[] {
  return Object.values(teams)
    .map((team) => {
      const xG = team.history.reduce((s, m) => s + m.xG, 0);
      const xGA = team.history.reduce((s, m) => s + m.xGA, 0);
      const scored = team.history.reduce((s, m) => s + m.scored, 0);
      const missed = team.history.reduce((s, m) => s + m.missed, 0);
      return {
        teamName: team.title,
        xG: Math.round(xG * 10) / 10,
        xGA: Math.round(xGA * 10) / 10,
        scored,
        missed,
        xGDiff: Math.round((scored - xG) * 10) / 10,
        xGADiff: Math.round((xGA - missed) * 10) / 10,
        npxG:
          Math.round(
            team.history.reduce((s, m) => s + m.npxG, 0) * 10,
          ) / 10,
      };
    })
    .sort((a, b) => b.xG - a.xG);
}
