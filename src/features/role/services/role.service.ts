import { apiClient } from "@/lib/apiClient";
import ApiResponse from "@/types/ApiResponse.type";
import { Role } from "@/features/role/types/role.type";
import { CreateRoleData } from "../types/roleData.type";
import { Permission } from "../types/permission";

export async function getPermissions(): Promise<ApiResponse<Permission[]>> {
  const result = await apiClient<Permission[]>(`/permission`, {
    method: "GET",
  });
  return result;
}

export async function getRoles(
  status?: "ACTIVE" | "INACTIVE",
): Promise<ApiResponse<Role[]>> {
  const result = await apiClient<Role[]>(
    `/role?${status != null ? `status=${status}` : ""}`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function createRole(
  roleData: CreateRoleData,
): Promise<ApiResponse<Role>> {
  console.log("roleData", roleData);
  const result = await apiClient<Role>(`/role`, {
    method: "POST",
    body: JSON.stringify(roleData),
  });
  return result;
}
