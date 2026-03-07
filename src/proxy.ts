import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("accessToken")?.value;

  const locale = pathname.split("/")[1] || "en";
  const pathWithoutLocale = pathname.replace(`/${locale}`, "");

  const publicRoutes = ["/admin/auth"];

  const isPublicRoute = publicRoutes.some((route) =>
    pathWithoutLocale.startsWith(route),
  );

  const isAdminRoute = pathWithoutLocale.startsWith("/admin");

  if (isAdminRoute && !isPublicRoute && !token) {
    const loginUrl = new URL(`/${locale}/admin/auth`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
