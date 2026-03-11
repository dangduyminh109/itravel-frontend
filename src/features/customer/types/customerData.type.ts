import { PermissionOverride } from "@/features/user/types/user.type";
import { Address, IdentityCard, Passport } from "./customer.type";

export interface CreateCustomerData {
  fullName: string;
  phoneNumber: string;
  avatar: string;
  gender: string;
  dateOfBirth: string;
  address: Address;
  identityCard: IdentityCard;
  passport: Passport;
  email: string;
  roleList: number[];
}

export interface UpdateCustomerData {
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
