import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
import { z } from "zod";

export const updateCustomerSchema = z.object({
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

  identityCard: z
    .object({
      documentNumber: z.string().optional(),
      issueDate: z.string().optional(),
      issuePlace: z.string().optional(),
    })
    .optional()
    .superRefine((data, ctx) => {
      if (!data) return;

      const { documentNumber, issueDate, issuePlace } = data;

      const values = [documentNumber, issueDate, issuePlace];
      const filled = values.filter((v) => v && v.trim() !== "");

      if (filled.length > 0 && filled.length < values.length) {
        if (!documentNumber || documentNumber.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["documentNumber"],
            message: "Vui lòng nhập số CMND/CCCD",
          });
        }

        if (!issueDate || issueDate.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["issueDate"],
            message: "Vui lòng nhập ngày cấp",
          });
        }

        if (!issuePlace || issuePlace.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["issuePlace"],
            message: "Vui lòng nhập nơi cấp",
          });
        }

        return;
      }

      if (filled.length === 3) {
        const issue = new Date(issueDate!);

        if (issue > new Date()) {
          ctx.addIssue({
            code: "custom",
            path: ["issueDate"],
            message: "Ngày cấp phải là ngày trong quá khứ hoặc hôm nay",
          });
        }
      }
    }),

  passport: z
    .object({
      documentNumber: z.string().optional(),
      issueDate: z.string().optional(),
      expiryDate: z.string().optional(),
    })
    .optional()
    .superRefine((data, ctx) => {
      if (!data) return;

      const { documentNumber, issueDate, expiryDate } = data;

      const values = [documentNumber, issueDate, expiryDate];
      const filled = values.filter((v) => v && v.trim() !== "");

      if (filled.length > 0 && filled.length < values.length) {
        if (!documentNumber || documentNumber.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["documentNumber"],
            message: "Vui lòng nhập số hộ chiếu",
          });
        }

        if (!issueDate || issueDate.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["issueDate"],
            message: "Vui lòng nhập ngày cấp",
          });
        }

        if (!expiryDate || expiryDate.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["expiryDate"],
            message: "Vui lòng nhập ngày hết hạn",
          });
        }
        return;
      }

      if (filled.length === 3) {
        const issue = new Date(issueDate!);
        const expiry = dayjs(expiryDate!, "DD/MM/YYYY", true);

        if (issue > new Date()) {
          ctx.addIssue({
            code: "custom",
            path: ["issueDate"],
            message: "Ngày cấp phải là ngày trong quá khứ hoặc hôm nay",
          });
        }

        if (!expiry.isValid() || !expiry.isAfter(dayjs(), "day")) {
          ctx.addIssue({
            code: "custom",
            path: ["expiryDate"],
            message: "Ngày hết hạn phải sau ngày hiện tại",
          });
        }
      }
    }),

  address: z
    .object({
      detail: z.string().optional(),
      wardId: z.string().optional(),
      provinceId: z.string().optional(),
    })
    .optional()
    .superRefine((data, ctx) => {
      if (!data) return;

      const { detail, wardId, provinceId } = data;

      const values = [detail, wardId, provinceId];
      const filled = values.filter((v) => v && v.trim() !== "");

      if (filled.length > 0 && filled.length < values.length) {
        if (!detail || detail.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: "Vui lòng nhập địa chỉ chi tiết",
            path: ["detail"],
          });
        }

        if (!wardId || wardId.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: "Vui lòng chọn phường/xã",
            path: ["wardId"],
          });
        }

        if (!provinceId || provinceId.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: "Vui lòng chọn tỉnh/thành",
            path: ["provinceId"],
          });
        }
      }
    }),

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
