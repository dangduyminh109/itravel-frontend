"use client";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 p-3 rounded-full bg-primary text-primary-foreground shadow-lg border border-border hover:opacity-90 transition-all active:scale-95"
    >
      {theme === "light" ? (
        <span className="flex items-center gap-2">🌙 Chế độ tối</span>
      ) : (
        <span className="flex items-center gap-2">☀️ Chế độ sáng</span>
      )}
    </button>
  );
}