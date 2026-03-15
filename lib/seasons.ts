export type Season = {
  /** 表示名 例: "2025-26" */
  label: string;
  /** API用パラメータ 例: 2025 */
  year: number;
};

export const SEASONS: Season[] = [
  { label: "2025-26", year: 2025 },
  { label: "2024-25", year: 2024 },
  { label: "2023-24", year: 2023 },
];

export const DEFAULT_SEASON = 2025;
