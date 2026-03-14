/**
 * football-data.org チームID → チームカラー対応表
 * 無名チームはフォールバックカラーパレットを使用
 */
const TEAM_COLORS: Record<number, string> = {
  57:   "#EF0107", // Arsenal FC
  58:   "#670E36", // Aston Villa
  61:   "#034694", // Chelsea FC
  62:   "#003399", // Everton FC
  63:   "#CC0000", // Fulham FC
  64:   "#C8102E", // Liverpool FC
  65:   "#6CABDD", // Manchester City
  66:   "#DA291C", // Manchester United
  67:   "#241F20", // Newcastle United
  73:   "#132257", // Tottenham Hotspur
  76:   "#FDB913", // Wolverhampton Wanderers
  338:  "#003090", // Leicester City
  340:  "#D71920", // Southampton FC
  349:  "#3A64A3", // Ipswich Town
  351:  "#DD0000", // Nottingham Forest
  354:  "#1B458F", // Crystal Palace
  397:  "#0057B8", // Brighton & Hove Albion
  402:  "#e30613", // Brentford FC
  563:  "#7A263A", // West Ham United
  1044: "#B50E12", // AFC Bournemouth
};

const FALLBACK_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6",
  "#f59e0b", "#10b981", "#3b82f6", "#ef4444",
];

export function getTeamColor(teamId: number): string {
  return TEAM_COLORS[teamId] ?? FALLBACK_COLORS[teamId % FALLBACK_COLORS.length];
}
