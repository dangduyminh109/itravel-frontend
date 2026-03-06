"use server";
import {
  clearAuthCookies,
  getAuthCookies,
  setAuthCookies,
} from "@/features/auth/services/token.service";
import ApiResponse from "@/types/ApiResponse.type";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

async function handleRedirect(isAdmin: boolean) {
  clearAuthCookies();
  const locale = await getLocale();
  if (isAdmin) redirect(`/${locale}/admin/auth`);
  else redirect(`/${locale}/auth`);
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
  isAdmin: boolean = true,
  isRetry = false,
): Promise<ApiResponse<T>> {
  const { requireAuth = true, ...fetchOptions } = options;

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (requireAuth) {
    const token = (await getAuthCookies()).accessToken;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      const refreshToken = (await getAuthCookies()).refreshToken;
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
        if (authResponse.ok) {
          const authData = await authResponse.json();
          console.log("Token refreshed successfully:", authData);
          await setAuthCookies(
            authData.accessToken,
            authData.refreshToken,
            authData.expiresAt,
          );
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${authData.accessToken}`,
          };
        } else {
          await handleRedirect(isAdmin);
        }
      } else {
        await handleRedirect(isAdmin);
      }
    }
  }
  const response = await fetch(`${BASE_API_URL}${endpoint}`, config);
  if (response.status === 204) {
    return {
      success: true,
      response: undefined as T,
      message: "No content",
      timestamp: new Date().toISOString(),
    };
  }

  const res: ApiResponse<T> = await response.json();
  console.log("API Response:", res);
  if (!response.ok && response.status === 401 && !isRetry) {
    const refreshToken = (await getAuthCookies()).refreshToken;
    console.log("Attempting token refresh with refresh token:", refreshToken);
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
      if (authResponse.ok) {
        const authData = await authResponse.json();

        await setAuthCookies(
          authData.response.accessToken,
          authData.response.refreshToken,
          authData.response.expiresAt,
        );

        return apiClient<T>(endpoint, options, true);
      } else {
        await handleRedirect(isAdmin);
      }
    } else {
      await handleRedirect(isAdmin);
    }
  }
  return res;
}
