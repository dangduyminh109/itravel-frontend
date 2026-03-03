import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(1, { message: "Tên đăng nhập không được để trống" }),

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
