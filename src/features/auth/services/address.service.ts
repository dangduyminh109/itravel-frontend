import { Ward, Province } from "@/types/address";
import ApiResponse from "@/types/ApiResponse.type";

export async function fetchProvinces(): Promise<ApiResponse<Province[]>> {
  const response = await fetch("/api/address/province/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json() as Promise<ApiResponse<Province[]>>;
}

export async function fetchWards(code: number): Promise<ApiResponse<Ward[]>> {
  const response = await fetch(`/api/address/ward/${code}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json() as Promise<ApiResponse<Ward[]>>;
}
