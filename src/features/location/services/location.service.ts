import { apiClient } from "@/lib/apiClient";
import ApiResponse, { PagingResponse } from "@/types/ApiResponse.type";
import { Location } from "../types/location.type";
import {
  CreateLocationData,
  UpdateLocationData,
} from "../types/locationData.type";
import { LocationGeneralInfo } from "../types/locationGeneralInfo.type";

interface GetLocationsProps {
  status?: "ACTIVE" | "INACTIVE";
  keyword?: string;
  deleted: boolean;
  page: number;
  size: number;
}

export async function getLocations({
  status,
  deleted = false,
  page = 0,
  size = 5,
  keyword,
}: GetLocationsProps): Promise<ApiResponse<PagingResponse<Location[]>>> {
  const result = await apiClient<PagingResponse<Location[]>>(
    `/location?isDeleted=${deleted}&page=${page}&size=${size}${keyword ? `&keyword=${keyword}` : ""}${status ? `&status=${status}` : ""}`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function getLocation(id: number): Promise<ApiResponse<Location>> {
  const result = await apiClient<Location>(`/location/${id}`, {
    method: "GET",
  });
  return result;
}

export async function createLocation(
  locationData: CreateLocationData,
): Promise<ApiResponse<Location>> {
  const result = await apiClient<Location>(`/location`, {
    method: "POST",
    body: JSON.stringify(locationData),
  });
  return result;
}

export async function updateLocation(
  locationData: UpdateLocationData,
): Promise<ApiResponse<Location>> {
  const result = await apiClient<Location>(`/location/${locationData.id}`, {
    method: "PUT",
    body: JSON.stringify(locationData),
  });
  return result;
}

export async function deleteLocation(
  id: string,
  destroy?: boolean,
): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(
    `/location/${id}${destroy ? "/destroy" : ""}`,
    {
      method: "DELETE",
    },
  );
  return result;
}

export async function restoreLocation(id: string): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(`/location/${id}/restore`, {
    method: "PATCH",
  });
  return result;
}

export async function getLocationGeneralInfo(): Promise<
  ApiResponse<LocationGeneralInfo>
> {
  const result = await apiClient<LocationGeneralInfo>(
    `/location/general-info`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function getLocationTree(
  status?: string,
): Promise<ApiResponse<Location[]>> {
  const result = await apiClient<Location[]>(
    `/location/tree?${status ? `status=${status}` : ""}`,
    {
      method: "GET",
    },
  );
  return result;
}
