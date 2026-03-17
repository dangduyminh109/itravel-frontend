"use server";
import { cookies } from "next/headers";

export async function getAuthCookies() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get("accessToken")?.value || null,
    refreshToken: cookieStore.get("refreshToken")?.value || null,
  };
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "accessToken",
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: parseInt(process.env.NEXT_PUBLIC_ACCESS_TOKEN_DURATION || "900"),
  });

  cookieStore.set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: parseInt(process.env.NEXT_PUBLIC_REFRESHABLE_DURATION || "604800"),
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

export async function getAdminAuthCookies() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get("adminAccessToken")?.value || null,
    refreshToken: cookieStore.get("adminRefreshToken")?.value || null,
  };
}

export async function setAdminAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "adminAccessToken",
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: parseInt(process.env.NEXT_PUBLIC_ACCESS_TOKEN_DURATION || "900"),
  });

  cookieStore.set({
    name: "adminRefreshToken",
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: parseInt(process.env.NEXT_PUBLIC_REFRESHABLE_DURATION || "604800"),
  });
}

export async function clearAdminAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("adminAccessToken");
  cookieStore.delete("adminRefreshToken");
}
