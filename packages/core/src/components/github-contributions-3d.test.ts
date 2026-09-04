import { describe, expect, test } from "bun:test";

import { createContributionCells } from "./github-contributions-3d.utils";

describe("createContributionCells", () => {
  test("sorts dates and maps them into the seven-row calendar", () => {
    const cells = createContributionCells([
      { date: "2026-01-05", count: 9, level: 4 },
      { date: "2026-01-04", count: 0, level: 0 },
    ]);

    expect(cells.map(({ date, dayIndex, weekIndex }) => ({ date, dayIndex, weekIndex }))).toEqual([
      { date: "2026-01-04", dayIndex: 0, weekIndex: 0 },
      { date: "2026-01-05", dayIndex: 1, weekIndex: 0 },
    ]);
  });

  test("keeps empty days thin and uses a capped logarithmic scale for active days", () => {
    const cells = createContributionCells([
      { date: "2026-01-04", count: 0, level: 0 },
      { date: "2026-01-05", count: 100, level: 4 },
    ]);

    expect(cells[0]?.height).toBe(0.12);
    expect(cells[1]?.height).toBeGreaterThan(0);
    expect(cells[1]?.height).toBeLessThanOrEqual(6.5);
  });

  test("keeps calendar positions when dates are missing", () => {
    const cells = createContributionCells([
      { date: "2026-01-04", count: 1, level: 1 },
      { date: "2026-01-12", count: 1, level: 1 },
    ]);

    expect(cells[1]).toMatchObject({ dayIndex: 1, weekIndex: 1 });
  });

  test("caps extreme contribution counts", () => {
    const cells = createContributionCells([{ date: "2026-01-05", count: 1_000_000, level: 4 }]);

    expect(cells[0]?.height).toBe(6.5);
  });
});
