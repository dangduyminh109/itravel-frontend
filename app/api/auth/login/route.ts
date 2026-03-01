import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/apiClient";
import { LoginResponse } from "@/features/auth/types/auth.type";
import { setAuthCookies } from "@/lib/token.service";
import ApiResponse from "@/types/ApiResponse.type";
import { toast } from "sonner"

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;
  try {
    const res = await apiClient<LoginResponse>("auth/login", {
      method: "POST",
      requireAuth: false,
      body: JSON.stringify({ identifier: email, password }),
    });

    console.log("Login API response:", res);

    if (res && res.success) {
      const { token, refreshToken } = res.response;
      await setAuthCookies(token, refreshToken);
      const response: ApiResponse<null> = {
        success: true,
        message: res.message,
        response: null,
        requestId: res.requestId,
        errors: null,
        timestamp: res.timestamp,
      };

      return NextResponse.json(response);
    } else {
      const response: ApiResponse<null> = {
        success: false,
        message: "Login failed",
        response: null,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 401 });
    }
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Login failed",
      response: null,
      timestamp: new Date().toISOString(),
    };
    console.error("Resonpses error:", response);
    console.error("Login error:", error);
    return NextResponse.json(response, { status: 401 });
  }
}
