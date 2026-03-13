export interface CreateCustomerData {
  email: string;
  fullName: string;
  password: string;
  phoneNumber?: string;
  avatar?: File;
  gender?: string;
  dateOfBirth?: string;
  address?: Address;
  identityCard?: IdentityCard;
  passport?: Passport;
  roleList: Set<string>;
}

export interface UpdateCustomerData {
  id: string;
  fullName: string;
  status: string;
  email?: string;
  avatar?: File;
  newPassword?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: Address;
  identityCard?: IdentityCard;
  passport?: Passport;
  roleList: Set<string>;
  removeAvatar?: boolean;
}

interface Address {
  detail?: string;
  wardId?: string;
  provinceId?: string;
}

interface IdentityCard {
  documentNumber?: string;
  issueDate?: string;
  issuePlace?: string;
}

interface Passport {
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
}
