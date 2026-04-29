import { apiClient } from "@/lib/apiClient";
import ApiResponse, { PagingResponse } from "@/types/ApiResponse.type";
import { Schedule } from "../types/tour.type";
import {
  CreateScheduleData,
  UpdateScheduleData,
} from "../types/scheduleData.type";
import dayjs from "dayjs";

interface GetSchedulesProps {
  tourId: string;
  page?: number;
  size?: number;
}

export async function getSchedules({
  tourId,
  page = 0,
  size = 5,
}: GetSchedulesProps): Promise<ApiResponse<PagingResponse<Schedule[]>>> {
  const pageParam = `page=${page}`;
  const sizeParam = `size=${size}`;
  const result = await apiClient<PagingResponse<Schedule[]>>(
    `/schedule/${tourId}?${pageParam}&${sizeParam}`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function createSchedule(
  scheduleData: CreateScheduleData,
): Promise<ApiResponse<Schedule>> {
  const result = await apiClient<Schedule>(`/schedule`, {
    method: "POST",
    body: JSON.stringify({
      ...scheduleData,
      departureDate: dayjs(scheduleData.departureDate).format(
        "YYYY-MM-DDTHH:mm:ss",
      ),
    }),
  });
  return result;
}

export async function updateSchedule(
  scheduleData: UpdateScheduleData,
): Promise<ApiResponse<Schedule>> {
  const result = await apiClient<Schedule>(`/schedule/${scheduleData.id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...scheduleData,
      departureDate: dayjs(scheduleData.departureDate).format(
        "YYYY-MM-DDTHH:mm:ss",
      ),
    }),
  });
  return result;
}

export async function deleteSchedule(id: number): Promise<ApiResponse<void>> {
  const result = await apiClient<void>(`/schedule/${id}/destroy`, {
    method: "DELETE",
  });
  return result;
}
