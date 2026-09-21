"use client";

import { useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!isClient) {
    return (
      <div className="h-8 w-8 rounded-full border border-line" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Ganti ke Mode Terang (Siang)" : "Ganti ke Mode Bioskop (Malam)"}
      title={isDark ? "Mode Terang (Siang)" : "Mode Bioskop (Malam)"}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-ink transition-all hover:border-[#1D99DE] hover:text-[#1D99DE] focus:outline-none"
    >
      {isDark ? (
        /* Sun icon for switching to light mode */
        <svg
          className="h-4 w-4 transition-transform duration-300 hover:rotate-45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        /* Moon icon for switching to dark cinema mode */
        <svg
          className="h-4 w-4 transition-transform duration-300 hover:-rotate-12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
