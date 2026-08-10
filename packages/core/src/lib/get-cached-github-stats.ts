/* eslint-disable no-console */
"use server";

import { unstable_cache } from "next/cache";

export type GitHubStatsData = {
  commits: number;
  repos: number;
  stars: number;
  followers: number;
};

const EMPTY: GitHubStatsData = { commits: 0, repos: 0, stars: 0, followers: 0 };

const QUERY = `
  query ($username: String!) {
    user(login: $username) {
      followers { totalCount }
      repositories(
        first: 100
        privacy: PUBLIC
        ownerAffiliations: OWNER
        isFork: false
      ) {
        totalCount
        nodes { stargazerCount }
      }
      contributionsCollection {
        totalCommitContributions
      }
    }
  }
`;

type GraphQLResponse = {
  errors?: Array<{ message: string; type?: string }>;
  data?: {
    user?: {
      followers: { totalCount: number };
      repositories: {
        totalCount: number;
        nodes: { stargazerCount: number }[];
      };
      contributionsCollection: { totalCommitContributions: number };
    };
  };
};

export const getCachedGitHubStats = unstable_cache(
  async (username: string): Promise<GitHubStatsData> => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn(
        `[github:stats] Skipping fetch because GITHUB_TOKEN is not configured ${JSON.stringify({ username })}`,
      );
      return EMPTY;
    }

    const startedAt = Date.now();
    console.info(
      `[github:stats] Fetching GraphQL stats ${JSON.stringify({
        username,
        tokenConfigured: true,
      })}`,
    );

    let res: Response;
    try {
      res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: QUERY, variables: { username } }),
      });
    } catch (error) {
      console.error(
        `[github:stats] Network error; returning empty stats ${JSON.stringify({
          username,
          durationMs: Date.now() - startedAt,
          error: error instanceof Error ? { name: error.name, message: error.message } : error,
        })}`,
      );
      return EMPTY;
    }

    console.info(
      `[github:stats] Response received ${JSON.stringify({
        username,
        status: res.status,
        statusText: res.statusText,
        durationMs: Date.now() - startedAt,
        rateLimitRemaining: res.headers.get("x-ratelimit-remaining"),
        rateLimitReset: res.headers.get("x-ratelimit-reset"),
      })}`,
    );

    if (!res.ok) {
      const body = (await res.text()).slice(0, 500);
      console.error(
        `[github:stats] Request failed; returning empty stats ${JSON.stringify({
          username,
          status: res.status,
          body,
        })}`,
      );
      return EMPTY;
    }

    const json = (await res.json()) as GraphQLResponse;
    if (json.errors?.length) {
      console.error(
        `[github:stats] GraphQL returned errors; returning empty stats ${JSON.stringify({
          username,
          errors: json.errors,
        })}`,
      );
      return EMPTY;
    }

    const user = json.data?.user;
    if (!user) {
      console.error(
        `[github:stats] Response did not include the requested user ${JSON.stringify({ username })}`,
      );
      return EMPTY;
    }

    const stats = {
      commits: user.contributionsCollection.totalCommitContributions,
      repos: user.repositories.totalCount,
      stars: user.repositories.nodes.reduce((sum, r) => sum + r.stargazerCount, 0),
      followers: user.followers.totalCount,
    };

    console.info(`[github:stats] Data ready ${JSON.stringify({ username, ...stats })}`);
    return stats;
  },
  ["github-stats"],
  { revalidate: 86400 },
);
