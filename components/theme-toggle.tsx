"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

/** Light/dark toggle. Persists choice; syncs the `.dark` class on <html>.
 *  Initial state is read from the DOM (set pre-paint by ThemeScript), so no
 *  effect/setState-in-effect is needed. */
export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark"),
  );

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      suppressHydrationWarning
      className="grid size-9 place-items-center rounded-[7px] border border-border bg-surface text-text-secondary transition-colors hover:border-primary/25 hover:bg-surface-2 hover:text-foreground"
    >
      <Sun className="hidden size-[17px] dark:block" />
      <Moon className="size-[17px] dark:hidden" />
    </button>
  );
}
