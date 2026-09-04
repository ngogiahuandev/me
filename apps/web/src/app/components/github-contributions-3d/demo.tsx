"use client";

import { useState } from "react";
import { z } from "zod";

import {
  GitHubContributions3D,
  type ContributionDay,
  type ContributionVariant,
} from "@repo/core/components/github-contributions-3d";
import { Button } from "@repo/core/components/button";
import { Input } from "@repo/core/components/input";
import { Label } from "@repo/core/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/core/components/select";
import { Spinner } from "@repo/core/components/spinner";

const contributionSchema = z.object({
  date: z.iso.date(),
  count: z.number().int().nonnegative(),
  level: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

const responseSchema = z.object({ contributions: z.array(contributionSchema) });
const errorSchema = z.object({ error: z.string() });

export function GitHubContributions3DDemo({ initialData }: { initialData: ContributionDay[] }) {
  const [username, setUsername] = useState("shadcn");
  const [displayName, setDisplayName] = useState("shadcn");
  const [data, setData] = useState<ContributionDay[]>(initialData);
  const [variant, setVariant] = useState<ContributionVariant>("green");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadContributions = async (requestedUsername: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/github-contributions/${encodeURIComponent(requestedUsername)}`,
      );
      const json: unknown = await response.json();

      if (!response.ok) {
        const parsedError = errorSchema.safeParse(json);
        throw new Error(
          parsedError.success ? parsedError.data.error : "Unable to load contributions.",
        );
      }

      const parsed = responseSchema.safeParse(json);
      if (!parsed.success) throw new Error("The contribution response was invalid.");
      setData(parsed.data.contributions);
      setDisplayName(requestedUsername);
    } catch (requestError) {
      setData([]);
      setError(
        requestError instanceof Error ? requestError.message : "Unable to load contributions.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedUsername = username.trim();
    if (!normalizedUsername) {
      setError("Enter a GitHub username.");
      return;
    }
    void loadContributions(normalizedUsername);
  };

  return (
    <div className="w-full space-y-4">
      <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
        <div className="min-w-0 flex-1 space-y-2">
          <Label htmlFor="github-username">GitHub username</Label>
          <Input
            id="github-username"
            autoComplete="off"
            maxLength={39}
            onChange={(event) => setUsername(event.target.value)}
            value={username}
          />
        </div>
        <Button className="h-11 sm:h-8" disabled={loading} type="submit">
          {loading && <Spinner />}
          Load
        </Button>
      </form>

      <div className="space-y-2">
        <Label htmlFor="contribution-variant">Theme</Label>
        <Select value={variant} onValueChange={(value: ContributionVariant) => setVariant(value)}>
          <SelectTrigger className="h-11 min-w-40 sm:h-8" id="contribution-variant">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="green">Green</SelectItem>
            <SelectItem value="season">Season</SelectItem>
            <SelectItem value="night-view">Night View</SelectItem>
            <SelectItem value="night-green">Night Green</SelectItem>
            <SelectItem value="night-rainbow">Night Rainbow</SelectItem>
            <SelectItem value="gitblock">GitBlock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div
          className="bg-muted flex min-h-80 items-center justify-center rounded-lg border p-6"
          role="alert"
        >
          <p className="text-muted-foreground text-center text-sm">{error}</p>
        </div>
      ) : loading ? (
        <div className="bg-muted flex min-h-80 items-center justify-center rounded-lg border">
          <Spinner className="size-5" />
          <span className="sr-only">Loading contributions</span>
        </div>
      ) : (
        <GitHubContributions3D data={data} name={displayName} variant={variant} />
      )}
    </div>
  );
}
