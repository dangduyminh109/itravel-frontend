import { apiClient } from "@/lib/apiClient";
import ApiResponse, { PagingResponse } from "@/types/ApiResponse.type";
import {
  CreateCategoryData,
  UpdateCategoryData,
} from "../types/categoryData.type";
import { Category } from "../types/category.type";
import { CategoryGeneralInfo } from "../types/categoryGeneralInfo.type";

interface GetCategoriesProps {
  status?: "ACTIVE" | "INACTIVE";
  keyword?: string;
  deleted?: boolean;
  page: number;
  size: number;
}

export async function getCategories({
  status,
  deleted = false,
  page = 0,
  size = 5,
  keyword,
}: GetCategoriesProps): Promise<ApiResponse<PagingResponse<Category[]>>> {
  const isDeletedParam = `isDeleted=${deleted}`;
  const statusParam = status ? `status=${status}` : "";
  const pageParam = `page=${page}`;
  const sizeParam = `size=${size}`;
  const keywordParam = keyword ? `keyword=${keyword}` : "";
  const result = await apiClient<PagingResponse<Category[]>>(
    `/category?${isDeletedParam}&${statusParam}&${pageParam}&${sizeParam}&${keywordParam}`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function getCategory(id: number): Promise<ApiResponse<Category>> {
  const result = await apiClient<Category>(`/category/${id}`, {
    method: "GET",
  });
  return result;
}

export async function createCategory(
  categoryData: CreateCategoryData,
): Promise<ApiResponse<Category>> {
  const result = await apiClient<Category>(`/category`, {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
  return result;
}

export async function updateCategory(
  categoryData: UpdateCategoryData,
): Promise<ApiResponse<Category>> {
  const result = await apiClient<Category>(`/category/${categoryData.id}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
  return result;
}

export async function deleteCategory(
  id: string,
  destroy?: boolean,
): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(
    `/category/${id}${destroy ? "/destroy" : ""}`,
    {
      method: "DELETE",
    },
  );
  return result;
}

export async function restoreCategory(id: string): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(`/category/${id}/restore`, {
    method: "PATCH",
  });
  return result;
}

export async function getCategoryGeneralInfo(): Promise<
  ApiResponse<CategoryGeneralInfo>
> {
  const result = await apiClient<CategoryGeneralInfo>(
    `/category/general-info`,
    {
      method: "GET",
    },
  );
  return result;
}
