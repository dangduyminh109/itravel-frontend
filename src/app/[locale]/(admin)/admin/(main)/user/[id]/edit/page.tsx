"use client";
import CustomBreadcrumb from "@/components/shared/breadcrumb/CustomBreadcrumb";
import { updateUserSchema } from "@/features/user/schemas/update-user.schema";
import { getUser, updateUser } from "@/features/user/services/user.service";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useLoadingStore } from "@/store/loading.store";
import PasswordInput from "@/features/auth/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@/components/ui/input";
import {
  faAddressCard,
  faEnvelope,
  faPhone,
  faUpload,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/dist/client/components/navigation";
import { PermissionOverride, User } from "@/features/user/types/user.type";
import { Role } from "@/features/role/types/role.type";
import RolePopup from "@/features/user/components/RolePopup";
import { Badge } from "@/components/ui/badge";
import PermissionPopup from "@/features/user/components/PermissionPopup";
import { toast } from "sonner";
import { UpdateUserData } from "@/features/user/types/userData.type";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
type updateUserSchema = z.infer<typeof updateUserSchema>;

const page = () => {
  const { id } = useParams<{ id: string }>();

  const breadcrumbData = {
    title: "Edit User",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "User", href: "/admin/user" },
      { name: "Edit User", href: `/admin/user/${id}/edit` },
    ],
  };
  const [open, setOpen] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avartarUrl, setAvatarUrl] = useState<string | null>(null);
  const { isLoading, setLoading } = useLoadingStore();
  const [user, setUser] = useState<User | null>(null);
  const [permissionOverrides, setPermissionOverrides] = useState<
    Set<PermissionOverride>
  >(new Set());

  const [selectedRole, setSelectedRole] = useState<Set<Role>>(new Set());

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<updateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      gender: "MALE",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUser(id);
      if (result.success) {
        const userData = result.response;
        setValue("fullName", userData.fullName);
        setValue("email", userData.email || "");
        setValue("phoneNumber", userData.phoneNumber || "");
        setValue("gender", userData.gender || "");
        setValue("status", userData.status || "");
        setPermissionOverrides(new Set(userData.permissionOverrides || []));
        setSelectedRole(
          userData.roleList ? new Set(userData.roleList) : new Set(),
        );
        setValue(
          "dateOfBirth",
          userData.dateOfBirth ? userData.dateOfBirth : undefined,
        );
        setUser(userData);
        if (userData.avatar) {
          setAvatarUrl(userData.avatar);
        }
      }
    };
    fetchUser();
  }, [id]);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  function handleRemoveAvatar() {
    setAvatarUrl(null);
    if (avatarRef.current) {
      avatarRef.current.value = "";
    }
  }

  function defaultPermission() {
    return [...selectedRole].flatMap((role) => {
      return role.permissionList.map((permission) => permission);
    });
  }

  const onSubmit = async (data: updateUserSchema) => {
    if (selectedRole.size === 0) {
      toast.error("Please select at least one role for the user.");
      return;
    }
    const userData: UpdateUserData = {
      id: id,
      removeAvatar: !avartarUrl,
      fullName: data.fullName,
      email: data.email,
      status: data.status,
      newPassword: data.newPassword,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      roleList: new Set([...selectedRole].map((role) => role.id)),
      permissionOverrides: permissionOverrides,
      avatar: avatarRef.current?.files?.[0] || undefined,
    };
    setLoading(true);
    const result = await updateUser(userData);
    if (result.success) {
      toast.success(result.message || "Update user successfully!");
    } else {
      toast.error(result.message || "Failed to update user.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-5 w-full gap-2 rounded-md p-2">
          <div className="col-span-5 md:col-span-3">
            <h3 className="font-bold">Account Information</h3>
            <div className="flex flex-col gap-3 p-2 rounded-md border-2 border-primary">
              <div className="grid gap-2 grid-cols-3">
                <div className="col-span-3 md:col-span-2">
                  <p>
                    Username{" "}
                    <span className="italic text-[var(--info)]">
                      (read-only)
                    </span>
                  </p>
                  <div className="shadow px-3 py-1 border rounded-md">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-2 text-primary"
                    />
                    {user?.username}
                  </div>
                </div>
                <div className="col-span-3 md:col-span-1">
                  <div>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Field className="gap-1 w-full">
                          <FieldLabel htmlFor="status">Status</FieldLabel>

                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger id="status" className="w-full">
                              <SelectValue placeholder="select status" />
                            </SelectTrigger>

                            <SelectContent className="bg-background">
                              <SelectGroup>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">
                                  Inactive
                                </SelectItem>
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
                  </div>
                </div>
              </div>
              <div className="grid gap-1">
                <PasswordInput
                  id="newPassword"
                  title="New Password"
                  {...register("newPassword")}
                  error={errors.newPassword?.message}
                  useFormError={false}
                />
                {errors.newPassword?.message && (
                  <p className="mt-1 text-red-500 text-xs ml-1">
                    {errors.newPassword?.message}
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
                    {[...selectedRole].map((role) => (
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
                  <Field>
                    <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="fullName"
                        type="text"
                        placeholder="Full Name"
                        {...register("fullName")}
                      />
                      <InputGroupAddon align="inline-start">
                        <FontAwesomeIcon
                          className={"text-primary"}
                          icon={faAddressCard}
                        />
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.fullName?.message && (
                      <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                        {errors.fullName.message}
                      </FieldDescription>
                    )}
                  </Field>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <Field className="gap-1">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="email"
                      type="text"
                      placeholder="Email"
                      {...register("email")}
                    />
                    <InputGroupAddon align="inline-start">
                      <FontAwesomeIcon
                        className={"text-primary"}
                        icon={faEnvelope}
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.email?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.email.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field className="gap-1">
                  <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="phoneNumber"
                      type="phoneNumber"
                      placeholder="Enter phone number"
                      {...register("phoneNumber")}
                    />
                    <InputGroupAddon align="inline-start">
                      <FontAwesomeIcon
                        className={"text-primary"}
                        icon={faPhone}
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.phoneNumber?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.phoneNumber.message}
                    </FieldDescription>
                  )}
                </Field>
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
                                if (date) {
                                  field.onChange(
                                    date.toISOString().slice(0, 10),
                                  );
                                }
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
          <Button type="submit" className="cursor-pointer" disabled={isLoading}>
            Update User
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
