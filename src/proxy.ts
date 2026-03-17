import { NextRequest, NextResponse } from "next/server";
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function handleRefresh(
  req: NextRequest,
  isAdminRoute: boolean,
  isPublicRoute: boolean,
  locale: string,
): Promise<NextResponse | null> {
  let token = null;
  if (isAdminRoute) {
    token = req.cookies.get("adminAccessToken")?.value;
  } else {
    token = req.cookies.get("accessToken")?.value;
  }

  if (!token && isAdminRoute && !isPublicRoute) {
    let refreshToken = null;
    if (isAdminRoute) {
      refreshToken = req.cookies.get("adminRefreshToken")?.value;
    } else {
      refreshToken = req.cookies.get("refreshToken")?.value;
    }

    if (refreshToken) {
      const authResponse = await fetch(`${BASE_API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });
      const result = await authResponse.json();
      if (result.success) {
        const { accessToken, refreshToken } = result.response;
        const res = NextResponse.next();
        if (isAdminRoute) {
          res.cookies.set({
            name: "adminAccessToken",
            value: accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: parseInt(
              process.env.NEXT_PUBLIC_ACCESS_TOKEN_DURATION || "900",
            ),
          });

          res.cookies.set({
            name: "adminRefreshToken",
            value: refreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: parseInt(
              process.env.NEXT_PUBLIC_REFRESHABLE_DURATION || "604800",
            ),
          });
        } else {
          res.cookies.set({
            name: "accessToken",
            value: accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: parseInt(
              process.env.NEXT_PUBLIC_ACCESS_TOKEN_DURATION || "900",
            ),
          });

          res.cookies.set({
            name: "refreshToken",
            value: refreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: parseInt(
              process.env.NEXT_PUBLIC_REFRESHABLE_DURATION || "604800",
            ),
          });
        }
        return res;
      } else {
        const loginUrl = new URL(`/${locale}/admin/auth`, req.url);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      const loginUrl = new URL(`/${locale}/admin/auth`, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return null;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const locale = pathname.split("/")[1] || "en";
  const pathWithoutLocale = pathname.replace(`/${locale}`, "");

  const publicRoutes = ["/admin/auth"];

  const isPublicRoute = publicRoutes.some((route) =>
    pathWithoutLocale.startsWith(route),
  );

  const isAdminRoute = pathWithoutLocale.startsWith("/admin");

  const refreshResponse = await handleRefresh(
    req,
    isAdminRoute,
    isPublicRoute,
    locale,
  );
  if (refreshResponse) {
    return refreshResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
