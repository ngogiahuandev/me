/* eslint-disable no-console */
import { unstable_cache } from "next/cache";

import type { Activity } from "../components/contribution-graph";

type GitHubContributionsResponse = {
  contributions: Activity[];
};

export const getCachedContributions = unstable_cache(
  async (username: string) => {
    const baseUrl =
      process.env.GITHUB_CONTRIBUTIONS_API_URL || "https://github-contributions-api.jogruber.de";
    const url = `${baseUrl}/v4/${username}?y=last`;
    const startedAt = Date.now();

    console.info(`[github:contributions] Fetching ${JSON.stringify({ username, url })}`);

    let res: Response;
    try {
      res = await fetch(url);
    } catch (error) {
      console.error(
        `[github:contributions] Network error ${JSON.stringify({
          username,
          durationMs: Date.now() - startedAt,
          error: error instanceof Error ? { name: error.name, message: error.message } : error,
        })}`,
      );
      throw error;
    }

    console.info(
      `[github:contributions] Response received ${JSON.stringify({
        username,
        status: res.status,
        statusText: res.statusText,
        durationMs: Date.now() - startedAt,
      })}`,
    );

    if (!res.ok) {
      const body = (await res.text()).slice(0, 500);
      console.error(
        `[github:contributions] Request failed ${JSON.stringify({
          username,
          status: res.status,
          body,
        })}`,
      );
      throw new Error(`GitHub contributions request failed with status ${res.status}`);
    }

    const data = (await res.json()) as GitHubContributionsResponse;
    if (!Array.isArray(data.contributions)) {
      console.error(
        `[github:contributions] Unexpected response shape ${JSON.stringify({
          username,
          keys: Object.keys(data),
        })}`,
      );
      throw new Error("GitHub contributions response did not include a contributions array");
    }

    console.info(
      `[github:contributions] Data ready ${JSON.stringify({
        username,
        days: data.contributions.length,
        firstDate: data.contributions.at(0)?.date,
        lastDate: data.contributions.at(-1)?.date,
        total: data.contributions.reduce((sum, activity) => sum + activity.count, 0),
      })}`,
    );

    return data.contributions;
  },
  ["github-contributions"],
  { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
);
