"use client";

import { Role } from "../types/role.type";
import { PermissionGroup } from "@/app/[locale]/(admin)/admin/(main)/role/page";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  faBan,
  faFloppyDisk,
  faPenToSquare,
  faTrashCan,
  faUserTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { UpdateRoleData } from "../types/roleData.type";
import { updateRole } from "../services/role.service";
import { useLoadingStore } from "@/store/loading.store";
import { PermissionCard } from "./PermissionCard";

const RoleGroup = ({
  role,
  permissionGroup,
  handleDeleteRole,
  setListRole,
}: {
  role: Role;
  permissionGroup: PermissionGroup[];
  handleDeleteRole: (roleId: string) => void;
  setListRole: React.Dispatch<React.SetStateAction<Role[]>>;
}) => {
  const [permissionList, setPermissionList] = useState(role.permissionList);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(role.name);
  const [status, setStatus] = useState(role.status);
  const { setLoading } = useLoadingStore();

  async function handleSubmit() {
    if (!name || !status) {
      toast.error("Name and status are required");
      return;
    }

    const roleData: UpdateRoleData = {
      id: role.id,
      name: name,
      status: status,
      permissionCodeList: permissionList,
    };
    setLoading(true);
    const result = await updateRole([roleData]);
    if (result.success) {
      setListRole((prev) =>
        prev.map((r) =>
          r.id === role.id ? { ...r, name, status, permissionList } : r,
        ),
      );
      setEdit(false);
      toast.success(result.message || "Update role successfully!");
    } else {
      toast.error(result.message || "Failed to update role.");
    }
    setLoading(false);
  }

  return (
    <div className="w-full gap-2 rounded-md p-2 border-2 border-primary bg-accent">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center justify-between gap-2">
          {(role.name == "admin" || role.name == "customer" || !edit) && (
            <Fragment>
              <p className="text-xl text-foreground font-bold">
                {role.name}
                {role.name == "admin" ||
                  (role.name == "customer" && (
                    <span className="italic">(read-only)</span>
                  ))}
              </p>

              <Badge
                className={`${role.status === "ACTIVE" ? "bg-[var(--primary)] hover:bg-[var(--primary)]" : "bg-[var(--warning)] hover:bg-[var(--warning)]"} text-white`}
              >
                {role.status}
              </Badge>
            </Fragment>
          )}
          {role.name != "admin" && role.name != "customer" && edit && (
            <Fragment>
              <InputGroup>
                <InputGroupInput
                  id="name"
                  type="text"
                  placeholder="Enter Role Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <InputGroupAddon align="inline-start">
                  <FontAwesomeIcon
                    className={"text-primary"}
                    icon={faUserTag}
                  />
                </InputGroupAddon>
              </InputGroup>
              <Field className="gap-1 w-full">
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as "ACTIVE" | "INACTIVE")
                  }
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="select status" />
                  </SelectTrigger>

                  <SelectContent className="bg-background">
                    <SelectGroup>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </Fragment>
          )}
        </div>
        {role.name !== "admin" && role.name != "customer" && (
          <div>
            {edit ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleSubmit()}
                    variant="outline"
                    size="icon"
                    className={`cursor-pointer px-2
                    bg-[var(--success)] hover:bg-[var(--success)]
                    text-white hover:text-white hover:opacity-80`}
                  >
                    <FontAwesomeIcon icon={faFloppyDisk} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleDeleteRole(role.id)}
                    variant="destructive"
                    size="icon"
                    className="cursor-pointer bg-[var(--error)] hover:bg-[var(--error)] hover:opacity-80 text-white"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Destroy</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setEdit(!edit)}
                  variant="outline"
                  size="icon"
                  className={`cursor-pointer 
                    ml-2
                    ${edit ? "bg-[var(--primary)] hover:bg-[var(--primary)]" : "bg-[var(--warning)] hover:bg-[var(--warning)]"} 
                    text-white hover:text-white hover:opacity-80`}
                >
                  <FontAwesomeIcon icon={edit ? faBan : faPenToSquare} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{edit ? "Cancel" : "Edit"}</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 max-h-[30vh] overflow-y-auto">
        {permissionGroup.map((permission) => (
          <div
            className="col-span-3 md:col-span-1 border border-primary p-2 rounded-md bg-background"
            key={`${permission.group}-${role.name}`}
          >
            <PermissionCard
              setEdit={setEdit}
              edit={edit}
              permissionGroup={permission}
              role={role}
              permissionList={permissionList}
              setPermissionList={setPermissionList}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleGroup;
