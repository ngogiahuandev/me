import { NextResponse } from "next/server";
import { z } from "zod";

const usernameSchema = z
  .string()
  .min(1)
  .max(39)
  .regex(/^(?!-)(?!.*--)[a-z\d](?:[a-z\d-]*[a-z\d])?$/i);

const contributionSchema = z.object({
  date: z.iso.date(),
  count: z.number().int().nonnegative(),
  level: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

const responseSchema = z.object({
  contributions: z.array(contributionSchema),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username: rawUsername } = await params;
  const username = usernameSchema.safeParse(rawUsername);

  if (!username.success) {
    return NextResponse.json({ error: "Enter a valid GitHub username." }, { status: 400 });
  }

  const baseUrl =
    process.env.GITHUB_CONTRIBUTIONS_API_URL ?? "https://github-contributions-api.jogruber.de";

  try {
    const response = await fetch(`${baseUrl}/v4/${username.data}?y=last`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            response.status === 404
              ? "GitHub user not found."
              : "Contribution data is unavailable.",
        },
        { status: response.status === 404 ? 404 : 502 },
      );
    }

    const parsed = responseSchema.safeParse(await response.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Contribution data is unavailable." }, { status: 502 });
    }

    return NextResponse.json({ contributions: parsed.data.contributions });
  } catch {
    return NextResponse.json({ error: "Contribution data is unavailable." }, { status: 502 });
  }
}
