import { apiClient } from "@/lib/apiClient";
import { Customer } from "../types/customer.type";
import ApiResponse, { PagingResponse } from "@/types/ApiResponse.type";
import {
  CreateCustomerData,
  UpdateCustomerData,
} from "../types/customerData.type";
import { object } from "zod";

interface GetCustomersProps {
  deleted: boolean;
  page: number;
  size: number;
  keyword?: string;
}

export async function getCustomers({
  deleted = false,
  page = 0,
  size = 5,
  keyword,
}: GetCustomersProps): Promise<ApiResponse<PagingResponse<Customer[]>>> {
  const result = await apiClient<PagingResponse<Customer[]>>(
    `/customer?isDeleted=${deleted}&page=${page}&size=${size}${keyword ? `&keyword=${keyword}` : ""}`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function getCustomer(id: string): Promise<ApiResponse<Customer>> {
  const result = await apiClient<Customer>(`/customer/${id}`, {
    method: "GET",
  });
  return result;
}

export async function createCustomer(
  customerData: CreateCustomerData,
): Promise<ApiResponse<Customer>> {
  const data = new FormData();
  data.append("fullName", customerData.fullName);
  data.append("email", customerData.email);
  data.append("password", customerData.password);
  if (customerData.dateOfBirth) {
    data.append("dateOfBirth", customerData.dateOfBirth);
  }
  if (customerData.gender) {
    data.append("gender", customerData.gender);
  }
  if (customerData.phoneNumber) {
    data.append("phoneNumber", customerData.phoneNumber);
  }

  if (customerData.avatar) {
    data.append("avatar", customerData.avatar);
  } else {
    data.append("avatar", new Blob(), "");
  }

  if (customerData.address) {
    if (customerData.address.provinceId) {
      data.append(
        "address.provinceId",
        customerData.address.provinceId.toString(),
      );
    }
    if (customerData.address.wardId) {
      data.append("address.wardId", customerData.address.wardId.toString());
    }
    if (customerData.address.detail) {
      data.append("address.detail", customerData.address.detail.toString());
    }
  }
  if (customerData.identityCard) {
    if (customerData.identityCard.documentNumber) {
      data.append(
        "identityCard.documentNumber",
        customerData.identityCard.documentNumber.toString(),
      );
    }
    if (customerData.identityCard.issueDate) {
      data.append(
        "identityCard.issueDate",
        customerData.identityCard.issueDate,
      );
    }
    if (customerData.identityCard.issuePlace) {
      data.append(
        "identityCard.issuePlace",
        customerData.identityCard.issuePlace.toString(),
      );
    }
  }

  if (customerData.passport) {
    if (customerData.passport.documentNumber) {
      data.append(
        "passport.documentNumber",
        customerData.passport.documentNumber.toString(),
      );
    }
    if (customerData.passport.issueDate) {
      data.append("passport.issueDate", customerData.passport.issueDate);
    }
    if (customerData.passport.expiryDate) {
      data.append("passport.expiryDate", customerData.passport.expiryDate);
    }
  }

  [...customerData.roleList].forEach((roleId) => {
    data.append("roleList", roleId);
  });
  const result = await apiClient<Customer>(`/customer`, {
    method: "POST",
    body: data,
  });
  return result;
}

export async function updateCustomer(
  customerData: UpdateCustomerData,
): Promise<ApiResponse<Customer>> {
  const data = new FormData();
  data.append("fullName", customerData.fullName);
  data.append("newPassword", customerData.newPassword || "");
  if (customerData.dateOfBirth) {
    data.append("dateOfBirth", customerData.dateOfBirth);
  }
  if (customerData.gender) {
    data.append("gender", customerData.gender);
  }
  if (customerData.phoneNumber) {
    data.append("phoneNumber", customerData.phoneNumber);
  }

  if (customerData.avatar) {
    data.append("avatar", customerData.avatar);
  } else {
    data.append("avatar", new Blob(), "");
  }

  if (customerData.address) {
    if (customerData.address.provinceId) {
      data.append(
        "address.provinceId",
        customerData.address.provinceId.toString(),
      );
    }
    if (customerData.address.wardId) {
      data.append("address.wardId", customerData.address.wardId.toString());
    }
  }
  if (customerData.identityCard) {
    if (customerData.identityCard.documentNumber) {
      data.append(
        "identityCard.documentNumber",
        customerData.identityCard.documentNumber.toString(),
      );
    }
    if (customerData.identityCard.issueDate) {
      data.append(
        "identityCard.issueDate",
        customerData.identityCard.issueDate,
      );
    }
    if (customerData.identityCard.issuePlace) {
      data.append(
        "identityCard.issuePlace",
        customerData.identityCard.issuePlace.toString(),
      );
    }
  }

  if (customerData.passport) {
    if (customerData.passport.documentNumber) {
      data.append(
        "passport.documentNumber",
        customerData.passport.documentNumber.toString(),
      );
    }
    if (customerData.passport.issueDate) {
      data.append("passport.issueDate", customerData.passport.issueDate);
    }
    if (customerData.passport.expiryDate) {
      data.append("passport.expiryDate", customerData.passport.expiryDate);
    }
  }

  [...customerData.roleList].forEach((roleId) => {
    data.append("roleList", roleId);
  });
  const result = await apiClient<Customer>(`/customer/${customerData.id}`, {
    method: "PUT",
    body: data,
  });

  return result;
}

export async function deleteCustomer(
  id: string,
  destroy?: boolean,
): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(
    `/customer/${id}${destroy ? "/destroy" : ""}`,
    {
      method: "DELETE",
    },
  );
  return result;
}

export async function restoreCustomer(id: string): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(`/customer/${id}/restore`, {
    method: "PATCH",
  });
  return result;
}
