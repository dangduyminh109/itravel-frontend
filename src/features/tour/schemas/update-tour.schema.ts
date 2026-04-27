import { z } from "zod";

export const updateTourSchema = z.object({
  name: z.string().min(1, { message: "Tên không được để trống" }),
  status: z.string().min(1, { message: "Trạng thái không được để trống" }),
  description: z.string().optional().or(z.literal("")),
  summary: z.string().optional().or(z.literal("")),
  pricing: z.object({
    adultPrice: z.object({
      originalPrice: z
        .number()
        .min(0, { message: "Giá gốc phải lớn hơn hoặc bằng 0" }),
      discountPrice: z
        .number()
        .min(0, { message: "Giá giảm phải lớn hơn hoặc bằng 0" }),
    }),
    childPrice: z.object({
      originalPrice: z
        .number()
        .min(0, { message: "Giá gốc phải lớn hơn hoặc bằng 0" }),
      discountPrice: z
        .number()
        .min(0, { message: "Giá giảm phải lớn hơn hoặc bằng 0" }),
    }),
    infantPrice: z.object({
      originalPrice: z
        .number()
        .min(0, { message: "Giá gốc phải lớn hơn hoặc bằng 0" }),
      discountPrice: z
        .number()
        .min(0, { message: "Giá giảm phải lớn hơn hoặc bằng 0" }),
    }),
    singleSupplement: z.object({
      originalPrice: z
        .number()
        .min(0, { message: "Giá gốc phải lớn hơn hoặc bằng 0" }),
      discountPrice: z
        .number()
        .min(0, { message: "Giá giảm phải lớn hơn hoặc bằng 0" }),
    }),
    currency: z.enum(["VND", "USD"], {
      message: "Đơn vị tiền tệ phải là VND hoặc USD",
    }),
  }),
  duration: z.object({
    days: z.number().min(1, { message: "Số ngày phải lớn hơn hoặc bằng 1" }),
    nights: z.number().min(0, { message: "Số đêm phải lớn hơn hoặc bằng 0" }),
  }),
  participantLimit: z.object({
    minParticipants: z
      .number()
      .min(1, { message: "Số lượng khách tối thiểu phải lớn hơn hoặc bằng 1" }),
    maxParticipants: z
      .number()
      .min(1, { message: "Số lượng khách tối đa phải lớn hơn hoặc bằng 1" }),
  }),
  services: z.object({
    includedServices: z.array(z.string()).optional(),
    excludedServices: z.array(z.string()).optional(),
  }),
  categoryId: z.number({ message: "ID danh mục phải là một số" }),
  departureLocationId: z.number({
    message: "ID địa điểm khởi hành phải là một số",
  }),
  destinationLocationId: z.number({
    message: "ID địa điểm đến phải là một số",
  }),
  itineraries: z
    .array(
      z.object({
        dayNumber: z
          .number()
          .min(1, { message: "Số ngày phải lớn hơn hoặc bằng 1" }),
        title: z.string().min(1, { message: "Tiêu đề không được để trống" }),
        description: z.string().optional().or(z.literal("")),
      }),
    )
    .optional(),
  schedules: z
    .array(
      z.object({
        departureDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
          message: "Ngày khởi hành không hợp lệ",
        }),
        totalSeats: z
          .number()
          .min(1, { message: "Tổng số chỗ phải lớn hơn hoặc bằng 1" }),
        surcharge: z
          .number()
          .min(0, { message: "Phụ phí phải lớn hơn hoặc bằng 0" }),
        pricing: z.object({
          originalPrice: z
            .number()
            .min(0, { message: "Giá gốc phải lớn hơn hoặc bằng 0" }),
          discountPrice: z
            .number()
            .min(0, { message: "Giá giảm phải lớn hơn hoặc bằng 0" }),
          currency: z.enum(["VND", "USD"], {
            message: "Đơn vị tiền tệ phải là VND hoặc USD",
          }),
        }),
      }),
    )
    .optional(),
  removedImageUrls: z.array(z.string()).optional(),
});
