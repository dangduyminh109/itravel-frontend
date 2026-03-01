import { NextResponse } from "next/server";

export async function POST(request: Request) {
 try {
     const formData = await request.formData();
     const token = formData.get("accessToken") as string;
     console.log("Token nhận được:", token);
     const retoken = formData.get("refreshToken") as string;
     console.log("Refresh token nhận được:", retoken);
     
    if (!token) {
      return NextResponse.redirect(new URL("/vi/login?error=missing_token", request.url), 302);
    }
 } catch (error) {
    console.error("Lỗi callback:", error);
    return NextResponse.redirect(new URL("/vi/login?error=server_error", request.url), 302);
 }
}