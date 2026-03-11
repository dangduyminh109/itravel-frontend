import { apiClient } from "@/lib/apiClient";
import {
  ForgotPasswordData,
  LoginData,
  LogoutData,
  RegisterData,
} from "../types/AuthData.type";
import { Customer } from "@/features/customer/types/customer.type";
import { LoginResponse } from "../types/auth.type";

export async function googleLogin(idToken: string) {
  const response = await fetch("/api/auth/google-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: idToken }),
  });
  return response.json();
}

export async function sendOtp(email: string) {
  const response = await apiClient<null>("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
    requireAuth: false,
  });

  return response;
}

export async function register(data: RegisterData) {
  const response = await apiClient<Customer>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    requireAuth: false,
  });

  return response;
}

export async function login(data: LoginData) {
  const response = await apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    requireAuth: false,
  });

  return response;
}

export async function forgotPassword(data: ForgotPasswordData) {
  const response = await apiClient<string>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
    requireAuth: false,
  });

  return response;
}

export async function logout(data: LogoutData) {
  const response = await apiClient<string>("/auth/logout", {
    method: "POST",
    body: JSON.stringify(data),
    requireAuth: false,
  });

  return response;
}
