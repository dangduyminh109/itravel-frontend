import { z } from "zod";

const priceSchema = z
  .object({
    originalPrice: z
      .number({ message: "Giá gốc phải được cung cấp" })
      .min(0, { message: "Giá gốc phải lớn hơn hoặc bằng 0" }),
    discountPrice: z
      .number()
      .min(0, { message: "Giá giảm phải lớn hơn hoặc bằng 0" })
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.discountPrice === "" || data.discountPrice === undefined) {
        return true;
      }
      return data.discountPrice < data.originalPrice;
    },
    {
      message: "Giá giảm phải nhỏ hơn giá gốc",
    },
  );

const pricingSchema = z.object({
  adultPrice: priceSchema,
  childPrice: priceSchema,
  infantPrice: priceSchema,
  singleSupplement: z
    .number({ message: "Giá phụ thu phòng đơn phải được cung cấp" })
    .min(0, { message: "Giá phụ thu phòng đơn phải lớn hơn hoặc bằng 0" }),
  currency: z.enum(["VND", "USD"], {
    message: "Đơn vị tiền tệ phải là VND hoặc USD",
  }),
});

export const scheduleItemSchema = z.object({
  departureDate: z
    .string({
      message: "Ngày khởi hành phải được cung cấp",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Ngày khởi hành không hợp lệ",
    })
    .refine((date) => new Date(date) >= new Date(), {
      message: "Ngày khởi hành phải ở hiện tại hoặc tương lai",
    }),
  totalSeats: z
    .number({ message: "Tổng số chỗ phải được cung cấp" })
    .min(1, { message: "Tổng số chỗ phải lớn hơn hoặc bằng 1" }),
  surcharge: z
    .number()
    .min(0, { message: "Phụ phí phải lớn hơn hoặc bằng 0" })
    .optional()
    .or(z.literal("")),
  pricing: pricingSchema,
  status: z.string().regex(/^(UPCOMING|OPEN|FULL|CANCELLED|COMPLETED)$/, {
    message: "Trạng thái không hợp lệ",
  }),
});

export const createTourSchema = z.object({
  name: z.string().min(1, { message: "Tên không được để trống" }),
  status: z.string().regex(/^(ACTIVE|INACTIVE|DRAFT)$/, {
    message: "Trạng thái không hợp lệ",
  }),
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
    includedServices: z
      .array(
        z.string().min(1, { message: "Dịch vụ bao gồm không được để trống" }),
      )
      .optional(),
    excludedServices: z
      .array(
        z
          .string()
          .min(1, { message: "Dịch vụ không bao gồm không được để trống" }),
      )
      .optional(),
  }),
  categoryId: z.number({ message: "Danh mục không được để trống" }),
  departureLocationId: z.number({
    message: "Địa điểm khởi hành không được để trống",
  }),
  destinationLocationId: z.number({
    message: "Địa điểm đến không được để trống",
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
