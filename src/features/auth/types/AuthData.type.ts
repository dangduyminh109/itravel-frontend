export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  otp: string;
}

export interface LoginData {
  identifier: string;
  password: string;
  isAdmin?: boolean;
}

export interface ForgotPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LogoutData {
  refreshToken: string;
}
