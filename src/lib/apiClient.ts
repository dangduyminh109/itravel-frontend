import {
  getAdminAuthCookies,
  getAuthCookies,
} from "@/features/auth/services/token.service";
import ApiResponse from "@/types/ApiResponse.type";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

async function handleRedirect(isAdmin: boolean) {
  const locale = await getLocale();
  if (isAdmin) redirect(`/${locale}/admin/auth`);
  else redirect(`/${locale}/auth`);
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
  isAdmin: boolean = true,
): Promise<ApiResponse<T>> {
  const { requireAuth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {};
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const config: RequestInit = {
    headers: {
      ...headers,
    },
    ...fetchOptions,
  };
  let accessToken = null;
  let refreshToken = null;

  if (isAdmin) {
    const token = await getAdminAuthCookies();
    accessToken = token.accessToken;
    refreshToken = token.refreshToken;
  } else {
    const token = await getAuthCookies();
    accessToken = token.accessToken;
    refreshToken = token.refreshToken;
  }

  if (requireAuth && accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  } else if (requireAuth && !accessToken) {
    await handleRedirect(isAdmin);
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

  if (!response.ok && response.status === 401 && requireAuth) {
    await handleRedirect(isAdmin);
  }
  return res;
}
