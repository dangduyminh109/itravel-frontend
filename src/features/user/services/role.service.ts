import { apiClient } from "@/lib/apiClient";
import ApiResponse from "@/types/ApiResponse.type";
import { Role } from "@/types/role";

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
