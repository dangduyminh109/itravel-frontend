"use client";
import * as React from "react";
import { CustomBreadcrumb } from "@/components/shared/breadcrumb/CustomBreadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserSchema } from "@/features/user/schemas/create-user.schema";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "@/lib/utils";
import PasswordInput from "@/features/auth/components/PasswordInput";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useRef, useState } from "react";
import RolePopup from "@/features/user/components/RolePopup";
import { Badge } from "@/components/ui/badge";
import { faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PermissionPopup from "@/features/user/components/PermissionPopup";
import { Role } from "@/types/role";
import { PermissionOverride } from "@/features/user/types/user.type";
import { createUsers } from "@/features/user/services/user.service";
import { CreateUserData } from "@/features/user/types/userData.type";
import { useLoadingStore } from "@/store/loading.store";
type CreateUserSchema = z.infer<typeof createUserSchema>;

const page = () => {
  const breadcrumbData = {
    title: "Create User",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "User", href: "/admin/user" },
      { name: "Create User", href: "/admin/user/create" },
    ],
  };
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      gender: "MALE",
    },
  });
  const router = useRouter();
  const { setLoading } = useLoadingStore();
  const onSubmit = async (data: CreateUserSchema) => {
    if (selectedRole.length === 0) {
      toast.error("Please select at least one role for the user.");
      return;
    }
    const userData: CreateUserData = {
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      roleList: selectedRole.map((role) => role.id),
      permissionOverrides: permissionOverrides,
      avatar: avatarRef.current?.files?.[0] || undefined,
    };
    setLoading(true);
    const result = await createUsers(userData);
    if (result.success) {
      toast.success(result.message || "Create user successfully!");
    } else {
      toast.error(result.message || "Failed to create user.");
    }
    setLoading(false);
  };
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avartarUrl, setAvatarUrl] = useState<string | null>(null);
  const [permissionOverrides, setPermissionOverrides] = useState<
    PermissionOverride[]
  >([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  function defaultPermission() {
    return selectedRole.flatMap((role) => {
      return role.permissionList.map((permission) => permission);
    });
  }

  useEffect(() => {
    setPermissionOverrides([]);
  }, [selectedRole]);

  function handleRemoveAvatar() {
    setAvatarUrl(null);
    if (avatarRef.current) {
      avatarRef.current.value = "";
    }
  }

  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      <form
        className="mt-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-5 w-full gap-2 rounded-md p-2">
          <div className="col-span-5 md:col-span-3">
            <h3 className="font-bold">Account Information</h3>
            <div className="flex flex-col gap-3 p-2 rounded-md border-2 border-primary">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  {...register("username")}
                />
                {errors.username?.message && (
                  <p className="mt-1 text-red-500 text-xs ml-1">
                    {errors.username?.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                </div>
                <PasswordInput
                  id="password"
                  {...register("password")}
                  error={errors.password?.message}
                  useFormError={false}
                />
                {errors.password?.message && (
                  <p className="mt-1 text-red-500 text-xs ml-1">
                    {errors.password?.message}
                  </p>
                )}
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <h3>Role</h3>
                  <PermissionPopup
                    defaultSelectedPermissions={defaultPermission()}
                    permissionOverrides={permissionOverrides}
                    setPermissionOverrides={setPermissionOverrides}
                  />
                </div>
                <div className="w-full flex flex-wrap items-stretch border rounded-md">
                  <RolePopup
                    setSelectedRole={setSelectedRole}
                    selectedRole={selectedRole}
                  />
                  <div className="flex-1 p-2 flex flex-wrap gap-1">
                    {selectedRole.map((role) => (
                      <Badge key={role.id}>{role.name}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-5 md:col-span-2 flex flex-col">
            <h3 className="font-bold">Avatar</h3>
            <div
              className="flex-1 p-2 rounded-md border-2 relative
              border-primary overflow-hidden flex items-center justify-center"
            >
              <Button
                className="absolute top-2 right-2 w-8 h-8 rounded-full
                cursor-pointer flex items-center justify-center"
                type="button"
                variant={"destructive"}
                onClick={() => handleRemoveAvatar()}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                ref={avatarRef}
              ></Input>
              <label
                htmlFor="avatar"
                className="h-40 cursor-pointer flex items-center
                justify-center border-2 aspect-square
                 border-dashed rounded-full text-center overflow-hidden"
              >
                {avartarUrl ? (
                  <img
                    src={avartarUrl}
                    alt="avatar"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUpload} className="text-5xl" />
                )}
              </label>
            </div>
          </div>
          <div className="col-span-5">
            <h3 className="font-bold">Account Detail</h3>
            <div className="flex flex-col gap-3 p-2 rounded-md border-2 border-primary">
              <div className="grid gap-2">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter fullName"
                    {...register("fullName")}
                  />
                  {errors.fullName?.message && (
                    <p className="mt-1 text-red-500 text-xs ml-1">
                      {errors.fullName?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                  />
                  {errors.email?.message && (
                    <p className="mt-1 text-red-500 text-xs ml-1">
                      {errors.email?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="phoneNumber"
                    placeholder="Enter phone number"
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber?.message && (
                    <p className="mt-1 text-red-500 text-xs ml-1">
                      {errors.phoneNumber?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel htmlFor="date">Date of birth</FieldLabel>

                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="date"
                            className="justify-start font-normal"
                          >
                            {field.value ? field.value : "Select date"}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent
                          className="overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            className="w-auto"
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(
                                  formatDate({
                                    dateString: date.toDateString(),
                                    type: "date",
                                  }),
                                );
                              }
                              setOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>

                      {errors.dateOfBirth?.message && (
                        <p className="mt-1 text-red-500 text-xs ml-1">
                          {errors.dateOfBirth.message}
                        </p>
                      )}
                    </Field>
                  )}
                />
                <div>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Field className="gap-1 w-full">
                        <FieldLabel htmlFor="gender">Gender</FieldLabel>

                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger id="gender" className="w-full">
                            <SelectValue placeholder="select gender" />
                          </SelectTrigger>

                          <SelectContent className="bg-background">
                            <SelectGroup>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {errors.gender?.message && (
                          <p className="mt-1 text-red-500 text-xs ml-1">
                            {errors.gender?.message}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button type="submit" className="cursor-pointer">
            Create User
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
