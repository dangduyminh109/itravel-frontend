import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate({
  dateString,
  type,
}: {
  dateString: string;
  type: "date" | "datetime";
}) {
  if (type === "date") {
    return dayjs(dateString).format("DD/MM/YYYY");
  }
  return dayjs(dateString).format("HH:mm:ss DD/MM/YYYY");
}
