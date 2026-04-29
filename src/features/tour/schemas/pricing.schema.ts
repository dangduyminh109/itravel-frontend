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
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.discountPrice === undefined || data.discountPrice === null) {
        return true;
      }
      return data.discountPrice < data.originalPrice;
    },
    {
      message: "Giá giảm phải nhỏ hơn giá gốc",
    },
  );

export const pricingSchema = z.object({
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
