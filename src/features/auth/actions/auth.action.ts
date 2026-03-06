"use server";
import { redirect } from "next/navigation";
import {
  forgotPassword,
  login,
  logout,
  register,
  sendOtp,
} from "../services/auth.service";
import {
  clearAuthCookies,
  getAuthCookies,
  setAuthCookies,
} from "../services/token.service";

import {
  ForgotPasswordData,
  LoginData,
  RegisterData,
} from "../types/AuthData.type";

export async function sendOtpAction(email: string) {
  const result = await sendOtp(email);
  return result;
}

export async function registerAction(data: RegisterData) {
  const result = await register(data);
  return result;
}

export async function LoginAction(data: LoginData) {
  const result = await login(data);
  if (result.success) {
    setAuthCookies(
      result.response.accessToken,
      result.response.refreshToken,
      result.response.expiresAt,
    );
  }
  const cookies = await getAuthCookies();

  return result;
}

export async function ForgotPasswordAction(data: ForgotPasswordData) {
  const result = await forgotPassword(data);
  return result;
}

export async function AdminLogoutAction(locale: string) {
  const { refreshToken } = await getAuthCookies();
  if (refreshToken) {
    await logout({ refreshToken });
  }
  clearAuthCookies();

  redirect(`/${locale}/admin/auth`);
}
