export interface User {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  email: string;
  dateOfBirth: string;
  roleList: number[];
  permissionOverrides: Set<PermissionOverride>;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface PermissionOverride {
  permission: string;
  permissionType: string;
}
