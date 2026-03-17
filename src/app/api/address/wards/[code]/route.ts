import { Ward } from "@/types/address";
import ApiResponse from "@/types/ApiResponse.type";
import { NextResponse } from "next/server";
const BASE_API_URL = process.env.NEXT_PUBLIC_ADDRESS_API_URL || "";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;
    const result = await fetch(
      `${BASE_API_URL}/w?province=${code}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (result.status === 200) {
      const response: ApiResponse<Ward[]> = {
        success: true,
        message: "fetch wards successfully",
        response: await result.json(),
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 200 });
    } else {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to fetch wards",
        response: null,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Failed to fetch wards",
      response: null,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 400 });
  }
}
