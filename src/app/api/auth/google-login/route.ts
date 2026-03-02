import { NextResponse } from "next/server";
import ApiResponse from "@/types/ApiResponse.type";
import { setAuthCookies } from "@/features/auth/services/token.service";
import { apiClient } from "@/lib/apiClient";
import { GoogleLoginResponse } from "@/features/auth/types/googleLogin.response";
import { LoginResponse } from "@/features/auth/types/auth.type";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Missing idToken",
        response: null,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 401 });
    }

    const res = await apiClient<LoginResponse>("auth/firebase-login", {
      method: "POST",
      requireAuth: false,
      body: JSON.stringify({ idToken }),
    });

    if (!res?.success) {
      const response: ApiResponse<null> = {
        success: false,
        errors: res?.errors || [],
        message: "Login failed",
        response: null,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 200 });
    }

    const { accessToken, refreshToken } = await res.response;

    await setAuthCookies(accessToken, refreshToken);

    const successResponse: ApiResponse<GoogleLoginResponse> = {
      success: true,
      message: "Login successful",
      response: {
        username: res.response.username,
        email: res.response.email,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Login failed",
      response: null,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 401 });
  }
}
