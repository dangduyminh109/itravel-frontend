import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, { message: "Tên không được để trống" }),
  status: z.string().min(1, { message: "Trạng thái không được để trống" }),
});
