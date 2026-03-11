import { apiClient } from "@/lib/apiClient";
import { Customer } from "../types/customer.type";
import ApiResponse, { PagingResponse } from "@/types/ApiResponse.type";

interface GetCustomersProps {
  deleted: boolean;
  page: number;
  size: number;
  keyword?: string;
}

export async function getCustomers({
  deleted = false,
  page = 0,
  size = 5,
  keyword,
}: GetCustomersProps): Promise<ApiResponse<PagingResponse<Customer[]>>> {
  const result = await apiClient<PagingResponse<Customer[]>>(
    `/customer?isDeleted=${deleted}&page=${page}&size=${size}${keyword ? `&keyword=${keyword}` : ""}`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function getCustomer(id: string): Promise<ApiResponse<Customer>> {
  const result = await apiClient<Customer>(`/customer/${id}`, {
    method: "GET",
  });
  console.log(result);
  return result;
}
export async function deleteCustomer(
  id: string,
  destroy?: boolean,
): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(
    `/customer/${id}${destroy ? "/destroy" : ""}`,
    {
      method: "DELETE",
    },
  );
  return result;
}

export async function restoreCustomer(id: string): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(`/customer/${id}/restore`, {
    method: "PATCH",
  });
  return result;
}
