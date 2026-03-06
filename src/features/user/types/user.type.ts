export interface User {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: String;
  roleList: number[];
  permissionOverrides: Set<PermissionOverride>;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  createdAt: String;
  updatedAt: String;
  deletedAt: String;
}

export interface PermissionOverride {
  permission: string;
  permissionType: string;
}
