import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/apiClient";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password } = body;

    const res = await apiClient("/auth/forgot-password", {
        method: "POST",
        requireAuth: false,
      body: JSON.stringify({ email, password }),
    });
}