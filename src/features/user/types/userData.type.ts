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
  permissionOverrides?: PermissionOverride[];
  avatar?: File;
}
