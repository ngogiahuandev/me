"use client";

import { useRef } from "react";

import { ScrollMinimap, type ScrollMinimapItem } from "@repo/core/components/scroll-minimap";

const MESSAGES = [
  {
    id: "minimap-message-1",
    role: "You",
    text: "Can you help me plan a small product launch?",
  },
  {
    id: "minimap-message-2",
    role: "Assistant",
    text: "Start with the audience, the promise, and one measurable launch goal.",
  },
  {
    id: "minimap-message-3",
    role: "You",
    text: "The audience is independent developers building their first paid tool.",
  },
  {
    id: "minimap-message-4",
    role: "Assistant",
    text: "Then lead with the outcome: ship a focused launch without a large following.",
  },
  {
    id: "minimap-message-5",
    role: "You",
    text: "Turn that into a three-day checklist.",
  },
  {
    id: "minimap-message-6",
    role: "Assistant",
    text: "Day one: sharpen positioning. Day two: prepare proof. Day three: publish and reply.",
  },
] as const;

const ITEMS: ScrollMinimapItem[] = MESSAGES.map((message) => ({
  label: message.text,
  href: `#${message.id}`,
  description: message.role,
}));

export function ConversationMinimapDemo() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-background grid h-80 grid-cols-[minmax(0,1fr)_3rem] overflow-hidden rounded-lg border">
      <div ref={scrollContainerRef} className="overflow-y-auto px-4 py-6 sm:px-6">
        <div className="space-y-8">
          {MESSAGES.map((message) => (
            <article key={message.id} id={message.id} className="scroll-mt-6 space-y-2">
              <p className="text-muted-foreground font-mono text-[11px] tracking-wide uppercase">
                {message.role}
              </p>
              <p className="text-sm leading-6">{message.text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center border-l">
        <ScrollMinimap
          items={ITEMS}
          direction="right"
          scrollContainerRef={scrollContainerRef}
          ariaLabel="Conversation messages"
        />
      </div>
    </div>
  );
}
