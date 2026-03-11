import { z } from "zod";

export const createCustomerSchema = z.object({
  email: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .min(1, { message: "Email không được để trống" }),

  fullName: z.string().min(1, { message: "Họ tên không được để trống" }),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, { message: "Số điện thoại không hợp lệ" })
    .optional()
    .or(z.literal("")),

  gender: z
    .string()
    .regex(/^(MALE|FEMALE|OTHER)$/, {
      message: "Giới tính không hợp lệ",
    })
    .optional()
    .or(z.literal("")),

  dateOfBirth: z
    .string()
    .refine(
      (value) => {
        const dateValue = new Date(value);
        const now = new Date();
        return dateValue <= now;
      },
      { message: "Ngày sinh phải là ngày trong quá khứ hoặc ngày hiện tại" },
    )
    .optional(),

  identityCard: z
    .object({
      documentNumber: z.string().optional().or(z.literal("")),
      issueDate: z.string().optional().or(z.literal("")),
      issuePlace: z.string().optional().or(z.literal("")),
    })
    .optional(),

  passport: z
    .object({
      documentNumber: z.string().optional().or(z.literal("")),
      issueDate: z.string().optional().or(z.literal("")),
      expiryDate: z.string().optional().or(z.literal("")),
    })
    .optional(),

  address: z
    .object({
      detail: z.string().optional().or(z.literal("")),
      wardId: z.string().optional().or(z.literal("")),
      provinceId: z.string().optional().or(z.literal("")),
    })
    .optional(),

  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (@$!%*?&).",
      },
    ),
});
