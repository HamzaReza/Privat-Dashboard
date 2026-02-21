"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { RiSunLine, RiMoonLine } from "react-icons/ri";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--icon)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors duration-200 cursor-pointer"
    >
      {theme === "light" ? (
        <RiMoonLine size={17} />
      ) : (
        <RiSunLine size={17} />
      )}
    </button>
  );
}
