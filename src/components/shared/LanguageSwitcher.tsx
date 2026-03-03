"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLang = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => switchLang("vi")}>VI</Button>
      <Button onClick={() => switchLang("en")}>EN</Button>
    </div>
  );
}
