"use client";

import { clickSoftSound } from "../lib/click-soft";
import { playSound } from "../lib/sound-engine";
import { tick001Sound } from "../lib/tick-001";
import { ScrollMinimap } from "./scroll-minimap";

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
  return (
    <ScrollMinimap
      items={items.map((item) => ({
        label: item.title,
        href: item.url as `#${string}`,
        depth: item.depth,
      }))}
      className={className}
      ariaLabel="On this page"
      onNavigate={() => {
        void playSound(clickSoftSound.dataUri, { volume: 0.5 }).catch(() => {});
      }}
      onItemEnter={() => {
        void playSound(tick001Sound.dataUri, { volume: 0.05 }).catch(() => {});
      }}
    />
  );
}
