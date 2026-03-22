import { apiClient } from "@/lib/apiClient";
import ApiResponse from "@/types/ApiResponse.type";
import { Role } from "@/features/role/types/role.type";
import { CreateRoleData, UpdateRoleData } from "../types/roleData.type";
import { Permission } from "../types/permission";

export async function getPermissions(): Promise<ApiResponse<Permission[]>> {
  const result = await apiClient<Permission[]>(`/permission`, {
    method: "GET",
  });
  return result;
}

interface GetRolesParams {
  status?: "ACTIVE" | "INACTIVE";
  keyword?: string;
}

export async function getRoles({
  status,
  keyword,
}: GetRolesParams): Promise<ApiResponse<Role[]>> {
  const result = await apiClient<Role[]>(
    `/role?${status != null ? `status=${status}` : ""}${keyword ? `&keyword=${keyword}` : ""}`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function createRole(
  roleData: CreateRoleData,
): Promise<ApiResponse<Role>> {
  const result = await apiClient<Role>(`/role`, {
    method: "POST",
    body: JSON.stringify(roleData),
  });
  return result;
}

export async function updateRole(
  roleData: UpdateRoleData[],
): Promise<ApiResponse<Role>> {
  const result = await apiClient<Role>(`/role/permissions`, {
    method: "PUT",
    body: JSON.stringify(roleData),
  });
  return result;
}

export async function destroyRole(id: string): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(`/role/${id}/destroy`, {
    method: "DELETE",
  });
  return result;
}
