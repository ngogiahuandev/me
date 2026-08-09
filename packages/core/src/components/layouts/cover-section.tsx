"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { GREETING_PERIODS } from "../../constants";
import { TypingAnimation } from "../typing-animation";

export function CoverSection() {
  const reduceMotion = useReducedMotion();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    const period = GREETING_PERIODS.find(
      ({ startHour, endHour }) => hour >= startHour && hour < endHour,
    );
    if (!period) return;

    const message = period.messages[Math.floor(Math.random() * period.messages.length)];
    // The visitor's local hour only exists after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(message ?? period.messages[0]);
  }, []);

  return (
    <section className="border-b">
      <div className="mx-auto w-full max-w-4xl border-x px-4 py-10 sm:px-6 sm:py-8 lg:px-8">
        {greeting && (
          <div
            className="text-foreground text-xl leading-none sm:text-3xl"
            style={{ fontFamily: "var(--font-handwriting), cursive" }}
            aria-label={greeting}
          >
            {reduceMotion ? (
              greeting
            ) : (
              <TypingAnimation
                words={[greeting]}
                startOnView={false}
                showCursor={false}
                typeSpeed={38}
                className="leading-none tracking-normal"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
