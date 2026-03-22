"use client";

import CustomBreadcrumb from "@/components/shared/breadcrumb/CustomBreadcrumb";
import {
  destroyRole,
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
import { useLoadingStore } from "@/store/loading.store";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const { setLoading } = useLoadingStore();
  const [listRole, setListRole] = useState<Role[]>([]);
  const [permissionGroup, setPermissionGroup] = useState<PermissionGroup[]>([]);
  const [fetchData, setFetchData] = useState(false);
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "ALL">("ALL");

  useEffect(() => {
    const fetchRoles = async () => {
      setFetchData(true);
      const [result, perResult] = await Promise.all([
        getRoles({}),
        getPermissions(),
      ]);
      if (result.success) setListRole(result.response);
      if (perResult.success) {
        setPermissionGroup(handlePermissionForGroup(perResult.response));
      }
      setFetchData(false);
    };
    fetchRoles();
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

  async function handleDeleteRole(roleId: string) {
    setLoading(true);
    setConfirmData({
      openPopup: false,
      title: null,
      description: null,
      handler: () => {},
    });
    const result = await destroyRole(roleId);
    if (result.success) {
      toast.success(result.message || "Destroyed successfully");
      const res = await getRoles({});
      if (res.success) {
        setListRole(res.response);
      }
    } else {
      toast.error(result.message || "An error occurred");
    }
    setLoading(false);
  }

  const onDelete = (roleId: string) => {
    setConfirmData({
      openPopup: true,
      confirmVariant: "destructive",
      title: <strong className="text-[var(--error)]">Delete Role</strong>,
      description: (
        <p>
          Are you sure you want to{" "}
          <strong className="text-[var(--error)]">Delete</strong> this Role?
        </p>
      ),
      handler: () => handleDeleteRole(roleId),
    });
  };

  const searchRef = useRef<HTMLInputElement>(null);
  async function handleSearch(e: any) {
    e.preventDefault();
    const keyword = searchRef.current?.value || "";
    const result = await getRoles({
      keyword,
      status: status === "ALL" ? undefined : status,
    });
    if (result.success) {
      setListRole(result.response);
    } else {
      toast.error(result.message || "An error occurred");
    }
  }

  function addNewRole(newRole: Role) {
    setListRole((prev) => [newRole, ...prev]);
  }

  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      <FromCreateRole
        permissionGroup={permissionGroup}
        addNewRole={addNewRole}
      />
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
            <Field className="gap-1 max-w-40">
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as "ACTIVE" | "INACTIVE" | "ALL")
                }
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="select status" />
                </SelectTrigger>

                <SelectContent className="bg-background">
                  <SelectGroup>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Button className="cursor-pointer" type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </Field>
        </form>

        {fetchData && (
          <div className="flex justify-center mt-4">
            <Spinner className="size-6" />
          </div>
        )}
        {listRole.length <= 0 && !fetchData && (
          <p className="text-center mt-4">No role found</p>
        )}

        {listRole.length > 0 &&
          listRole.map((role) => (
            <div key={role.id} className="mt-2">
              <RoleGroup
                role={role}
                permissionGroup={permissionGroup}
                handleDeleteRole={onDelete}
                setListRole={setListRole}
              />
            </div>
          ))}
      </div>
      <ConfirmPopup confimData={confirmData} setConfirmData={setConfirmData} />
    </div>
  );
};

export default page;
