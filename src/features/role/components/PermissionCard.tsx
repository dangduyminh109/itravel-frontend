"use client";

import { Role } from "../types/role.type";
import { PermissionGroup } from "@/app/[locale]/(admin)/admin/(main)/role/page";
import { FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const PermissionCard = ({
  permissionGroup,
  role,
  permissionList,
  setPermissionList,
  edit,
  setEdit,
}: {
  edit: boolean;
  permissionGroup: PermissionGroup;
  role: Role | null;
  permissionList: string[];
  setPermissionList: React.Dispatch<React.SetStateAction<string[]>>;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <p>{permissionGroup.group}</p>
        {edit && (
          <div className="flex gap-2 items-center ">
            <FieldLabel
              htmlFor={`group-${permissionGroup.group}-${role?.id}`}
              className="block cursor-pointer"
            >
              Select All
            </FieldLabel>
            <Checkbox
              className="cursor-pointer"
              id={`group-${permissionGroup.group}-${role?.id}`}
              checked={permissionGroup.permission.every((p) =>
                permissionList.some((c) => c === p.code),
              )}
              onCheckedChange={(checked) => {
                if (!edit) {
                  setEdit(true);
                }
                if (role?.name === "admin" || role?.name === "customer") {
                  toast.error("You cannot change permission for admin or customer role");
                  return;
                }
                setPermissionList(
                  checked ? permissionGroup.permission.map((p) => p.code) : [],
                );
              }}
            />
          </div>
        )}
      </div>
      <Separator />
      <div>
        {permissionGroup.permission.map((permission) => {
          return (
            <div
              className="flex gap-2 items-center p-2"
              key={`${permission.group}-${role?.id}-${permission.code}`}
            >
              <Checkbox
                className="cursor-pointer"
                id={`group-${permissionGroup.group}-${role?.id}-${permission.code}`}
                checked={permissionList.some((p) => p === permission.code)}
                onCheckedChange={(checked) => {
                  if (!edit) {
                    setEdit(true);
                  }
                  if (role?.name === "admin" || role?.name === "customer") {
                    toast.error("You cannot change permission for admin or customer role");
                    return;
                  }

                  setPermissionList((prev) => {
                    if (!checked) {
                      return prev.filter((p) => p != permission.code);
                    } else {
                      return [...prev, permission.code];
                    }
                  });
                }}
              />
              <FieldLabel
                htmlFor={`group-${permissionGroup.group}-${role?.id}-${permission.code}`}
                className="block cursor-pointer"
              >
                {permission.description}
              </FieldLabel>
            </div>
          );
        })}
      </div>
    </div>
  );
};
