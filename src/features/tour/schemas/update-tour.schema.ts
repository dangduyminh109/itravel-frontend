import { z } from "zod";
import { pricingSchema } from "./pricing.schema";
import { scheduleItemSchema } from "./schedule.schema";

export const updateTourSchema = z.object({
  name: z.string().min(1, { message: "Tên không được để trống" }),
  status: z.string().min(1, { message: "Trạng thái không được để trống" }),
  description: z.string().optional().or(z.literal("")),
  summary: z.string().optional().or(z.literal("")),
  pricing: pricingSchema,
  duration: z.object({
    days: z
      .number({ message: "Số ngày phải được cung cấp" })
      .min(1, { message: "Số ngày phải lớn hơn hoặc bằng 1" }),
    nights: z
      .number({ message: "Số đêm phải được cung cấp" })
      .min(0, { message: "Số đêm phải lớn hơn hoặc bằng 0" }),
  }),
  participantLimit: z
    .object({
      minParticipants: z
        .number({ message: "Số lượng khách tối thiểu phải được cung cấp" })
        .min(1, {
          message: "Số lượng khách tối thiểu phải lớn hơn hoặc bằng 1",
        }),
      maxParticipants: z
        .number({ message: "Số lượng khách tối đa phải được cung cấp" })
        .min(1, { message: "Số lượng khách tối đa phải lớn hơn hoặc bằng 1" }),
    })
    .refine(
      (participantLimit) =>
        participantLimit.maxParticipants >= participantLimit.minParticipants,
      {
        message:
          "Số lượng khách tối đa phải lớn hơn hoặc bằng số lượng khách tối thiểu",
      },
    ),
  services: z.object({
    includes: z
      .array(
        z.string().min(1, { message: "Dịch vụ bao gồm không được để trống" }),
      )
      .optional(),
    excludes: z
      .array(
        z
          .string()
          .min(1, { message: "Dịch vụ không bao gồm không được để trống" }),
      )
      .optional(),
  }),
  categoryId: z.number({ message: "Danh mục không được để trống" }),
  departureLocationId: z.number({
    message: "ID địa điểm khởi hành không được để trống",
  }),
  destinationLocationId: z.number({
    message: "ID địa điểm đến không được để trống",
  }),
  itineraries: z
    .array(
      z.object({
        dayNumber: z
          .number()
          .min(1, { message: "Ngày phải lớn hơn hoặc bằng 1" }),
        title: z.string().min(1, { message: "Tiêu đề không được để trống" }),
        description: z.string().optional().or(z.literal("")),
        activities: z
          .array(
            z
              .string()
              .min(1, { message: "Nội dung hoạt động không được để trống" }),
          )
          .min(1, { message: "Ít nhất phải có một hoạt động" }),
      }),
    )
    .min(1, { message: "Ít nhất phải có một lịch trình" }),
  schedules: z
    .array(scheduleItemSchema)
    .min(1, { message: "Ít nhất phải có một lịch khởi hành" }),
});
