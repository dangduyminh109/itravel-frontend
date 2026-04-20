import { z } from "zod";

export const updateLocationSchema = z.object({
  name: z.string().min(1, { message: "Tên không được để trống" }),
  type: z.string().min(1, { message: "Loại địa điểm không được để trống" }),
  status: z.string().min(1, { message: "Trạng thái không được để trống" }),
  description: z.string().optional().or(z.literal("")),
  parentId: z.number().optional().nullable(),
});
