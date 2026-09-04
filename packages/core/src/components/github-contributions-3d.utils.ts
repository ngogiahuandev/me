import type { ContributionDay } from "./github-contributions-3d";

const DAY_IN_MS = 86_400_000;
const DAYS_PER_WEEK = 7;

export type ContributionCell = ContributionDay & {
  dayIndex: number;
  height: number;
  weekIndex: number;
};

export const createContributionCells = (data: ContributionDay[]): ContributionCell[] => {
  if (data.length === 0) return [];

  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = sorted[0];
  if (!firstDate) return [];

  const firstTimestamp = Date.parse(`${firstDate.date}T00:00:00Z`);
  const firstDay = new Date(firstTimestamp).getUTCDay();

  return sorted.map((day) => {
    const date = new Date(`${day.date}T00:00:00Z`);
    const elapsedDays = Math.round((date.getTime() - firstTimestamp) / DAY_IN_MS);

    return {
      ...day,
      dayIndex: date.getUTCDay(),
      height: day.count === 0 ? 0.12 : Math.min(6.5, 0.22 + Math.log10(day.count / 2 + 1) * 2.8),
      weekIndex: Math.floor((firstDay + elapsedDays) / DAYS_PER_WEEK),
    };
  });
};
