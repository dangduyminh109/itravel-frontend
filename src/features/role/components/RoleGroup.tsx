"use client";

import { Role } from "../types/role.type";
import { PermissionGroup } from "@/app/[locale]/(admin)/admin/(main)/role/page";
import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";

const PermissionCard = ({
  permissionGroup,
  role,
}: {
  permissionGroup: PermissionGroup;
  role: Role;
}) => {
  const [checked, setChecked] = useState(role.permissionList);
  return (
    <div>
      <div className="flex justify-between items-center">
        <p>{permissionGroup.group}</p>
        <div className="flex gap-2 items-center ">
          <FieldLabel
            htmlFor={`group-${permissionGroup.group}-${role.id}`}
            className="block cursor-pointer"
          >
            Select All
          </FieldLabel>
          <Checkbox
            className="cursor-pointer"
            id={`group-${permissionGroup.group}-${role.id}`}
            checked={permissionGroup.permission.every((p) =>
              checked.some((c) => c === p.code),
            )}
            onCheckedChange={(checked) => {
              if (role.name === "admin") {
                toast.error("You cannot change permission for admin role");
                return;
              }
              setChecked(
                checked ? permissionGroup.permission.map((p) => p.code) : [],
              );
            }}
          />
        </div>
      </div>
      <Separator />
      <div>
        {permissionGroup.permission.map((permission) => {
          return (
            <div
              className="flex gap-2 items-center p-2"
              key={`${permission.group}-${role.id}-${permission.code}`}
            >
              <Checkbox
                className="cursor-pointer"
                id={`group-${permissionGroup.group}-${role.id}-${permission.code}`}
                checked={checked.some((p) => p === permission.code)}
                onCheckedChange={(checked) => {
                  if (role.name === "admin") {
                    toast.error("You cannot change permission for admin role");
                    return;
                  }

                  setChecked((prev) => {
                    if (!checked) {
                      return prev.filter((p) => p != permission.code);
                    } else {
                      return [...prev, permission.code];
                    }
                  });
                }}
              />
              <FieldLabel
                htmlFor={`group-${permissionGroup.group}-${role.id}-${permission.code}`}
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

const RoleGroup = ({
  role,
  permissionGroup,
  handleDeleteRole,
}: {
  role: Role;
  permissionGroup: PermissionGroup[];
  handleDeleteRole: (roleId: number) => void;
}) => {
  return (
    <div className="w-full gap-2 rounded-md p-2 border-2 border-primary bg-accent">
      <div className="flex items-center justify-between px-2">
        <p className="text-xl text-foreground font-bold">
          {role.name}
          {role.name == "admin" && <span className="italic">(read-only)</span>}
        </p>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handleDeleteRole(Number(role.id))}
                variant="destructive"
                size="icon"
                className="cursor-pointer bg-[var(--error)] hover:bg-[var(--error)] hover:opacity-80 text-white"
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Destroy</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="ml-2 cursor-pointer bg-[var(--warning)] hover:bg-[var(--warning)] hover:opacity-80 !text-white"
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        {permissionGroup.map((permission) => (
          <div
            className="col-span-3 md:col-span-1 border border-primary p-2 rounded-md bg-background"
            key={`${permission.group}-${role.name}`}
          >
            <PermissionCard permissionGroup={permission} role={role} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleGroup;
