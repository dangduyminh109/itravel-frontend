import { apiClient } from "@/lib/apiClient";
import { User } from "../types/user.type";
import ApiResponse, { PagingResponse } from "@/types/ApiResponse.type";
import { CreateUserData } from "../types/userData.type";

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

export async function createUsers(
  userData: CreateUserData,
): Promise<ApiResponse<User>> {
  const data = new FormData();
  data.append("username", userData.username);
  data.append("fullName", userData.fullName);
  if (userData.email) {
    data.append("email", userData.email);
  }
  if (userData.password) {
    data.append("password", userData.password);
  }
  if (userData.dateOfBirth) {
    data.append("dateOfBirth", userData.dateOfBirth);
  }
  if (userData.gender) {
    data.append("gender", userData.gender);
  }
  if (userData.phoneNumber) {
    data.append("phoneNumber", userData.phoneNumber);
  }

  if (userData.avatar) {
    data.append("avatar", userData.avatar);
  } else {
    data.append("avatar", new Blob(), "");
  }

  userData.roleList.forEach((roleId) => {
    data.append("roleList", roleId);
  });
  if (userData.permissionOverrides) {
    userData.permissionOverrides.forEach((override, index) => {
      data.append(
        `permissionOverrides[${index}].permission`,
        override.permission,
      );
      data.append(
        `permissionOverrides[${index}].permissionType`,
        override.permissionType,
      );
    });
  }
  const result = await apiClient<User>(`/user`, {
    method: "POST",
    body: data,
  });
  return result;
}

export async function deleteUsers(id: string): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(`/user/${id}`, {
    method: "DELETE",
  });
  return result;
}
