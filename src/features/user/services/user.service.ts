import { apiClient } from "@/lib/apiClient";
import { User } from "../types/user.type";
import ApiResponse, { PagingResponse } from "@/types/ApiResponse.type";

interface GetUsersProps {
  deleted: boolean;
  page: number;
  size: number;
  keyword?: string;
}

export async function getUsers({
  deleted = false,
  page = 0,
  size = 5,
  keyword,
}: GetUsersProps): Promise<ApiResponse<PagingResponse<User[]>>> {
  const result = await apiClient<PagingResponse<User[]>>(
    `/user?deleted=${deleted}&page=${page}&size=${size}${keyword ? `&keyword=${keyword}` : ""}`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function deleteUsers(id: string): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(`/user/${id}`, {
    method: "DELETE",
  });
  return result;
}
