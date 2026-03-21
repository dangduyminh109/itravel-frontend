import { Role } from "@/features/role/types/role.type";

export interface User {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  email: string;
  dateOfBirth: string;
  roleList: Set<Role>;
  permissionOverrides: Set<PermissionOverride>;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface PermissionOverride {
  permission: string;
  permissionType: string;
}
