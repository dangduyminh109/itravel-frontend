import { Ward, Province } from "@/types/address";
import ApiResponse from "@/types/ApiResponse.type";

export async function fetchProvinces(): Promise<ApiResponse<Province[]>> {
  const response = await fetch("/api/address/provinces/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json() as Promise<ApiResponse<Province[]>>;
}

export async function fetchWards(code: number): Promise<ApiResponse<Ward[]>> {
  const response = await fetch(`/api/address/wards/${code}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json() as Promise<ApiResponse<Ward[]>>;
}

export async function getProvince(
  code: string,
): Promise<ApiResponse<Province>> {
  const response = await fetch(
    `http://localhost:3000/api/address/province/${code}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
  return response.json() as Promise<ApiResponse<Province>>;
}

export async function getWard(code: string): Promise<ApiResponse<Ward>> {
  const response = await fetch(
    `http://localhost:3000/api/address/ward/${code}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  return response.json() as Promise<ApiResponse<Ward>>;
}
