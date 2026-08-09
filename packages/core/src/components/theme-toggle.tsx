"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { AnimatedThemeToggler } from "./animated-theme-toggler";
import { buttonVariants } from "./button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mount gate prevents SSR/CSR aria-label mismatch with next-themes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <AnimatedThemeToggler
      theme={mounted && isDark ? "dark" : "light"}
      onThemeChange={setTheme}
      duration={650}
      variant="circle"
      aria-label={
        mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"
      }
      className={buttonVariants({ variant: "outline", size: "icon" })}
    />
  );
}
