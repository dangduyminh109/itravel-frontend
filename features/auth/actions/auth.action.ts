"use server";
import {
  forgotPassword,
  login,
  logout,
  register,
  sendOtp,
} from "../services/auth.service";
import { clearAuthCookies, setAuthCookies } from "../services/token.service";

import {
  ForgotPasswordData,
  LoginData,
  LogoutData,
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
    setAuthCookies(result.response.accessToken, result.response.refreshToken);
  }
  return result;
}

export async function ForgotPasswordAction(data: ForgotPasswordData) {
  const result = await forgotPassword(data);
  return result;
}

export async function LogoutAction(data: LogoutData) {
  const result = await logout(data);
  if (result.success) {
    clearAuthCookies();
  }
  return result;
}
