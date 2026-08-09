"use client";

import { useEffect, useMemo, useState } from "react";

import { clickSoftSound } from "../lib/click-soft";
import { cn } from "../lib/utils";
import { playSound } from "../lib/sound-engine";
import { tick001Sound } from "../lib/tick-001";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

export type TOCItemType = {
  title: React.ReactNode;
  url: string;
  depth: number;
};

export type TOCMinimapProps = {
  /** @fumadocsHref #tocitemtype */
  items: TOCItemType[];
  className?: string;
};

export function TOCMinimap({ items, className }: TOCMinimapProps) {
  const itemIds = useMemo(() => items.map((item) => item.url.replace("#", "")), [items]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeHeading = useActiveHeading(itemIds);

  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="On this page" className={cn("w-12", className)}>
      <ul
        className="flex max-h-[50dvh] cursor-pointer flex-col items-stretch gap-0 py-3"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {items.map((item, index) => (
          <li key={item.url} className="flex w-full items-center">
            <HoverCard open={hoveredIndex === index}>
              <HoverCardTrigger asChild>
                <a
                  href={item.url}
                  aria-label={
                    typeof item.title === "string" ? `Go to ${item.title}` : "Go to section"
                  }
                  aria-current={item.url === `#${activeHeading}` ? "location" : undefined}
                  data-active={item.url === `#${activeHeading}`}
                  className={cn(
                    "group focus-visible:ring-ring/50 flex w-12 cursor-pointer items-center rounded-sm bg-transparent py-1 focus-visible:ring-2 focus-visible:outline-none",
                    item.depth === 3 && "ml-2",
                    item.depth >= 4 && "ml-4",
                  )}
                  onClick={handleItemClick}
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    void playSound(tick001Sound.dataUri, { volume: 0.05 }).catch(() => {});
                  }}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                >
                  <span
                    className={cn(
                      "bg-muted-foreground/35 block h-0.5 origin-left rounded-full",
                      "transition-[width,background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      "group-hover:bg-primary group-focus-visible:bg-primary group-hover:scale-y-150 group-focus-visible:scale-y-150",
                      "group-data-[active=true]:bg-primary motion-reduce:transition-none",
                      getProximityWidth(index, hoveredIndex),
                    )}
                  />
                </a>
              </HoverCardTrigger>
              <HoverCardContent
                side="right"
                align="center"
                sideOffset={14}
                className="w-auto max-w-64 gap-1 px-3 py-2 duration-200"
              >
                <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                <p className="text-muted-foreground text-xs">Jump to this section</p>
              </HoverCardContent>
            </HoverCard>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function getProximityWidth(index: number, hoveredIndex: number | null) {
  if (hoveredIndex === null) return "w-3";

  const distance = Math.abs(index - hoveredIndex);
  if (distance === 0) return "w-10";
  if (distance === 1) return "w-8";
  if (distance === 2) return "w-6";
  if (distance === 3) return "w-5";
  if (distance === 4) return "w-4";
  return "w-3";
}

export function useActiveHeading(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = itemIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (!headings.length) return;

    let frame: number | null = null;

    const updateActiveHeading = () => {
      const marker = window.innerHeight * 0.3;
      let currentId = headings[0]?.id ?? null;

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > marker) break;
        currentId = heading.id;
      }

      const atPageEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atPageEnd) currentId = headings.at(-1)?.id ?? currentId;

      setActiveId((previousId) => (previousId === currentId ? previousId : currentId));
    };

    const scheduleUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        updateActiveHeading();
      });
    };

    updateActiveHeading();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [itemIds]);

  return activeId;
}

function handleItemClick(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  void playSound(clickSoftSound.dataUri, { volume: 0.5 }).catch(() => {});
  const url = e.currentTarget.getAttribute("href") ?? "";
  scrollToHeading(url);
}

function scrollToHeading(url: string) {
  history.pushState(null, "", url);
  document.getElementById(url.replace("#", ""))?.scrollIntoView({
    behavior: "smooth",
  });
}
