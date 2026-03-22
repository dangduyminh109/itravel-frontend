"use client";

import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { createRoleSchema } from "../../schemas/create-role.schema";
import { CreateRoleData } from "../../types/roleData.type";
import { useLoadingStore } from "@/store/loading.store";
import { toast } from "sonner";
import { createRole } from "../../services/role.service";
import { PermissionGroup } from "@/app/[locale]/(admin)/admin/(main)/role/page";
import { Role } from "../../types/role.type";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { PermissionCard } from "../PermissionCard";
type createRoleSchema = z.infer<typeof createRoleSchema>;

const FromCreateRole = ({
  permissionGroup,
  addNewRole,
}: {
  permissionGroup: PermissionGroup[];
  addNewRole: (newRole: Role) => void;
}) => {
  const { isLoading, setLoading } = useLoadingStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<createRoleSchema>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      status: "ACTIVE",
    },
  });

  const onSubmit = async (data: createRoleSchema) => {
    const roleData: CreateRoleData = {
      name: data.name,
      status: data.status,
      permissionCodeList: permissionList,
    };
    setLoading(true);
    const result = await createRole(roleData);
    if (result.success) {
      toast.success(result.message || "Create role successfully!");
      addNewRole(result.response);
    } else {
      toast.error(result.message || "Failed to create role.");
    }
    setLoading(false);
  };
  const [permissionList, setPermissionList] = useState<string[]>([]);

  return (
    <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-6 gap-2 p-2 rounded-md border-2 border-primary items-stretch">
        <div className="col-span-6 mt-2 flex items-center gap-2 justify-between">
          <h3 className="font-bold text-xl">New Role</h3>
          <Button
            type="submit"
            disabled={isLoading}
            className="col-span-1 cursor-pointer h-full d-block"
          >
            Create
          </Button>
        </div>
        <Separator className="col-span-6" />
        <Field className="gap-1 col-span-6 md:col-span-4">
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="name"
              type="text"
              placeholder="Enter Role Name"
              {...register("name")}
            />
            <InputGroupAddon align="inline-start">
              <FontAwesomeIcon className={"text-primary"} icon={faUserTag} />
            </InputGroupAddon>
          </InputGroup>
          {errors.name?.message && (
            <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
              {errors.name.message}
            </FieldDescription>
          )}
        </Field>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Field className="gap-1 w-full col-span-6 md:col-span-2">
              <FieldLabel htmlFor="status">Status</FieldLabel>

              <Select onValueChange={field.onChange} value={field.value}>
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
              {errors.status?.message && (
                <p className="mt-1 text-red-500 text-xs ml-1">
                  {errors.status?.message}
                </p>
              )}
            </Field>
          )}
        />
        <div className="col-span-6 max-h-[30vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            {permissionGroup.map((permission) => (
              <div
                className="col-span-3 md:col-span-1 border border-primary p-2 rounded-md bg-background"
                key={`${permission.group}-create`}
              >
                <PermissionCard
                  setEdit={() => {}}
                  edit={true}
                  permissionGroup={permission}
                  role={null}
                  permissionList={permissionList}
                  setPermissionList={setPermissionList}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default FromCreateRole;
