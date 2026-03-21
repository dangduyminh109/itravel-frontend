import { Role } from "@/features/role/types/role.type";

export interface Customer {
  id: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  gender: string;
  dateOfBirth: string;
  address: Address;
  identityCard: IdentityCard;
  passport: Passport;
  email: string;
  roleList: Role[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Address {
  detail: string;
  wardId: number;
  provinceId: number;
}

export interface IdentityCard {
  documentNumber: string;
  issueDate: string;
  issuePlace: string;
}

export interface Passport {
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
}
