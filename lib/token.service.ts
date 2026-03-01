import { cookies } from "next/headers";

export async function getAuthCookies() {
  const cookieStore = await cookies();
  return {
    token: cookieStore.get("token")?.value || null,
    refreshToken: cookieStore.get("refreshToken")?.value || null,
  };
}

export async function setAuthCookies(token: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 180,
  });

  cookieStore.set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}
