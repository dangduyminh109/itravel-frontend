"use client";
import { useTheme } from "@/hooks/useTheme";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Select
      value={theme}
      onValueChange={(value: any) => toggleTheme(value as "light" | "dark")}
    >
      <SelectTrigger className="w-full max-w-48  bg-background">
        <SelectValue placeholder="Select the theme" />
      </SelectTrigger>
      <SelectContent className="w-full max-w-48 bg-background">
        <SelectGroup>
          <SelectLabel>Themes</SelectLabel>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
