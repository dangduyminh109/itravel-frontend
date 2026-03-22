export interface CreateRoleData {
  name: string;
  status: string;
  permissionCodeList: string[];
}

export interface UpdateRoleData {
  id: string;
  name: string;
  status: string;
  permissionCodeList: string[];
}
