import {
  getAuthCookies,
  setAuthCookies,
} from "@/features/auth/services/token.service";
import ApiResponse from "@/types/ApiResponse.type";
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
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
      return {
        success: false,
        message: "Unauthorized",
        response: undefined as T,
        timestamp: new Date().toISOString(),
      };
    }
  }

  try {
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
    if (!response.ok && response.status === 401 && !isRetry) {
      const refreshToken = (await getAuthCookies()).refreshToken;
      if (refreshToken) {
        const authResponse = await fetch(`${BASE_API_URL}/refresh`, {
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
          setAuthCookies(authData.accessToken, authData.refreshToken);
          return apiClient<T>(endpoint, options, true);
        } else {
          return res;
        }
      } else {
        return res;
      }
    }
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
      response: undefined as T,
      timestamp: new Date().toISOString(),
    };
  }
}
