"use client";

import { CustomBreadcrumb } from "@/components/shared/breadcrumb/CustomBreadcrumb";
import {
  getPermissions,
  getRoles,
} from "@/features/role/services/role.service";
import { Role } from "@/features/role/types/role.type";
import { useEffect, useRef, useState } from "react";
import FromCreateRole from "@/features/role/components/form/FromCreateRole";
import RoleGroup from "@/features/role/components/RoleGroup";
import { Permission } from "@/features/role/types/permission";
import ConfirmPopup, {
  ConfirmData,
} from "@/components/shared/popup/ConfirmPopup";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export interface PermissionGroup {
  group: string;
  permission: Permission[];
}

const page = () => {
  const breadcrumbData = {
    title: "Role - Permission",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Role - Permission", href: "/admin/role" },
    ],
  };
  const [confirmData, setConfirmData] = useState<ConfirmData>({
    openPopup: false,
    title: null,
    description: null,
    handler: () => {},
  });

  const [listRole, setListRole] = useState<Role[]>([]);
  const [permissionGroup, setPermissionGroup] = useState<PermissionGroup[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const result = await getRoles();
      if (result.success) {
        setListRole(result.response);
      }
    };
    fetchRoles();

    const fetchPermissions = async () => {
      const result = await getPermissions();
      if (result.success) {
        setPermissionGroup(handlePermissionForGroup(result.response));
      }
    };
    fetchPermissions();
  }, []);

  function handlePermissionForGroup(permissionGroup: Permission[]) {
    const setGroup: string[] = [];
    permissionGroup.forEach((p) => {
      if (setGroup.includes(p.group)) return;
      setGroup.push(p.group);
    });

    const groupPermission = setGroup.map((group) => {
      return {
        group,
        permission: permissionGroup.filter((p) => p.group === group),
      };
    });
    return groupPermission;
  }

  function handleDeleteRole(roleId: number) {
    setConfirmData({
      openPopup: true,
      confirmVariant: "destructive",
      title: <strong className="text-primary">Delete Role</strong>,
      description: (
        <p>
          Are you sure you want to{" "}
          <strong className="text-primary">Delete</strong> this Role?
        </p>
      ),
      handler: () => {},
    });
  }
  function handleSearch(e: any) {
    e.preventDefault();
    const keyword = searchRef.current?.value || "";
    setSearchKeyword(keyword);
  }
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      <FromCreateRole />
      <div className="p-2 border-2 border-primary border-dashed mt-4 rounded-md">
        <h3 className="font-bold mt-2 text-center text-xl">List Role</h3>
        <form onSubmit={handleSearch} className="w-full mt-2">
          <Field orientation="horizontal">
            <Input
              type="search"
              placeholder="Enter role name..."
              ref={searchRef}
              className="w-full"
            />
            <Button className="cursor-pointer" type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </Field>
        </form>
        {listRole.length > 0 &&
          listRole.map((role) => (
            <div key={role.id} className="mt-2">
              <RoleGroup
                role={role}
                permissionGroup={permissionGroup}
                handleDeleteRole={handleDeleteRole}
              />
            </div>
          ))}
      </div>
      <ConfirmPopup confimData={confirmData} setConfirmData={setConfirmData} />
    </div>
  );
};

export default page;
