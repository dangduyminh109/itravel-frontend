import { createNavigation } from "next-intl/navigation";

export const { Link, redirect, useRouter, usePathname } = createNavigation({
  locales: ["vi", "en"],
  defaultLocale: "vi",
});
