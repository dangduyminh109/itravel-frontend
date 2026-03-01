import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email không được để trống" })
    .email({ message: "Email không hợp lệ" }),

 newPassword: z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt.",
    }
  ),
  
 confirmPassword: z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt.",
    }
  ),

  code: z
  .string()
  .regex(/^\d{6}$/, {
    message: "Mã xác nhận phải gồm đúng 6 chữ số.",
  })

});