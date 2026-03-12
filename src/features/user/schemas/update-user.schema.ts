import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
import { z } from "zod";

export const updateUserSchema = z.object({
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

  status: z.string().regex(/^(ACTIVE|INACTIVE)$/, {
    message: "Trạng thái không hợp lệ",
  }),

  dateOfBirth: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => {
        if (!value) return true;

        const dateValue = dayjs(value, "DD/MM/YYYY", true);

        return dateValue.isValid() && !dateValue.isAfter(dayjs(), "day");
      },
      {
        message: "Ngày sinh phải là ngày trong quá khứ hoặc ngày hiện tại",
      },
    ),

  email: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .optional()
    .or(z.literal("")),

  newPassword: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (@$!%*?&).",
      },
    )
    .optional()
    .or(z.literal("")),
});
