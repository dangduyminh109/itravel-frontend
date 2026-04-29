import { z } from "zod";
import { pricingSchema } from "./pricing.schema";
import dayjs from "dayjs";

export const scheduleItemSchema = z.object({
  id: z.number().optional(),
  departureDate: z
    .string()
    .refine((val) => dayjs(val).isValid(), {
      message: "Ngày khởi hành không hợp lệ",
    })
    .refine((val) => dayjs(val).isAfter(dayjs().subtract(1, "minute")), {
      message: "Ngày khởi hành phải ở hiện tại hoặc tương lai",
    }),
  totalSeats: z
    .number({ message: "Tổng số chỗ phải được cung cấp" })
    .min(1, { message: "Tổng số chỗ phải lớn hơn hoặc bằng 1" }),
  surcharge: z
    .number()
    .min(0, { message: "Phụ phí phải lớn hơn hoặc bằng 0" })
    .optional(),
  pricing: pricingSchema,
  status: z.string().regex(/^(UPCOMING|OPEN|FULL|CANCELLED|COMPLETED)$/, {
    message: "Trạng thái không hợp lệ",
  }),
});
