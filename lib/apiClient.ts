import ApiResponse from "@/types/ApiResponse.type";
import { redirect } from "next/navigation";
import { getAuthCookies, setAuthCookies } from "./token.service";
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T> | null> {
  const { requireAuth = true, ...fetchOptions } = options;

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (requireAuth) {
    const token = (await getAuthCookies()).token;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      redirect("/login");
    }
  }

  try {
    const response = await fetch(`${BASE_API_URL}${endpoint}`, config);
    if (response.status === 204) {
      return null;
    }

    const res: ApiResponse<T> = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
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
            setAuthCookies(authData.token, authData.refreshToken);
            return apiClient<T>(endpoint, options);
          }
        }
        redirect("/login");
      } else if (response.status === 403) {
        throw new Error(res.message || "Không có quyền truy cập!");
      }
      throw new Error(res.message || "Có lỗi xảy ra từ máy chủ");
    }

    return res;
  } catch (error: any) {
    if (error.name === "TypeError") {
      throw new Error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    }
    throw error;
  }
}
