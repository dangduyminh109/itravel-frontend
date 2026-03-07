import { apiClient } from "@/lib/apiClient";
import ApiResponse from "@/types/ApiResponse.type";
import { Permission } from "@/types/permission";

export async function getPermissions(): Promise<ApiResponse<Permission[]>> {
  const result = await apiClient<Permission[]>(`/permission`, {
    method: "GET",
  });
  return result;
}
