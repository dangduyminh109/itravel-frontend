import { PermissionOverride } from "@/features/user/types/user.type";

export interface CreateUserData {
  username: string;
  fullName: string;
  email?: string;
  password: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  roleList: string[];
  permissionOverrides?: Set<PermissionOverride>;
  avatar?: File;
}

export interface UpdateUserData {
  id: string;
  fullName: string;
  status: string;
  email?: string;
  newPassword?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  roleList: Set<string>;
  permissionOverrides?: Set<PermissionOverride>;
  avatar?: File;
}
