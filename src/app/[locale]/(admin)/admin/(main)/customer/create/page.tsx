"use client";
import * as React from "react";
import { CustomBreadcrumb } from "@/components/shared/breadcrumb/CustomBreadcrumb";
import { Input } from "@/components/ui/input";
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
import {
  faAddressCard,
  faEnvelope,
  faIdCard,
  faLocationDot,
  faPassport,
  faPhone,
  faUpload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  fetchProvinces,
  fetchWards,
} from "@/features/auth/services/address.service";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "@/lib/utils";
import PasswordInput from "@/features/auth/components/PasswordInput";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Role } from "@/features/role/types/role.type";
import { useLoadingStore } from "@/store/loading.store";
import { FieldDescription } from "@/components/ui/field";
import { createCustomerSchema } from "@/features/customer/schemas/create-customer.schema";
import { Textarea } from "@/components/ui/textarea";
import { Province, Ward } from "@/types/address";
import ApiResponse from "@/types/ApiResponse.type";
import { Spinner } from "@/components/ui/spinner";
import { CreateCustomerData } from "@/features/customer/types/customerData.type";
import { createCustomer } from "@/features/customer/services/customer.service";
type createCustomerSchema = z.infer<typeof createCustomerSchema>;

const page = () => {
  const breadcrumbData = {
    title: "Create Customer",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Customer", href: "/admin/customer" },
      { name: "Create Customer", href: "/admin/customer/create" },
    ],
  };
  const router = useRouter();
  const { isLoading, setLoading } = useLoadingStore();
  const [open, setOpen] = useState({
    dateOfBirth: false,
    passportIssueDate: false,
    passportExpiryDate: false,
    identityCardIssueDate: false,
  });
  const [selectedRole] = useState<Set<Role>>(new Set());
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avartarUrl, setAvatarUrl] = useState<string | null>(null);
  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [wardList, setWardList] = useState<Ward[]>([]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<createCustomerSchema>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      gender: "MALE",
    },
  });
  const watchProvinceId = watch("address.provinceId");

  useEffect(() => {
    async function getProvinces() {
      setIsLoadingAddress(true);
      try {
        const result: ApiResponse<Province[]> = await fetchProvinces();
        if (result.success) {
          setProvinceList(result.response || []);
        } else {
          toast.error(
            "Failed to fetch provinces! Please reload the page and try again.",
          );
        }
      } catch (e) {
        toast.error(
          "Failed to fetch provinces! Please reload the page and try again.",
        );
      } finally {
        setIsLoadingAddress(false);
      }
    }
    getProvinces();
  }, []);

  useEffect(() => {
    async function loadWard() {
        const provinceId = Number(watchProvinceId);
        if (!provinceId) return;
      if (provinceId) {
        setIsLoadingAddress(true);
        try {
          const result: ApiResponse<Ward[]> = await fetchWards(
            Number(watchProvinceId),
          );

          if (result.success) {
            setWardList(result.response || []);
          } else {
            toast.error(
              "Failed to fetch wards! Please reload the page and try again.",
            );
          }
        } catch (e) {
          toast.error(
            "Failed to fetch wards! Please reload the page and try again.",
          );
        } finally {
          setIsLoadingAddress(false);
        }
      }
    }

    loadWard();
  }, [watchProvinceId]);

  const onSubmit = async (data: createCustomerSchema) => {
    const customerData: CreateCustomerData = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      address: data.address,
      identityCard: data.identityCard,
      passport: data.passport,
      roleList: new Set([...selectedRole].map((role) => role.id)),
      avatar: avatarRef.current?.files?.[0] || undefined,
    };
    setLoading(true);
    const result = await createCustomer(customerData);
    if (result.success) {
      toast.success(result.message || "Create customer successfully!");
    } else {
      toast.error(result.message || "Failed to create customer.");
    }
    setLoading(false);
  };

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
  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-5 w-full gap-2 rounded-md p-2">
          <div className="col-span-5 md:col-span-3">
            <h3 className="font-bold">Account Information</h3>
            <div className="flex flex-col gap-3 p-2 rounded-md border-2 border-primary">
              <Field className="gap-1">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="email"
                    type="text"
                    placeholder="Enter email"
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
              <div className="grid gap-1">
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
                </div>
                <div className="w-full flex flex-wrap items-stretch border rounded-md">
                  <div className="flex-1 p-2 flex flex-wrap gap-1">
                    <Badge>customer</Badge>
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
              <div className="grid md:grid-cols-2 gap-2">
                <Field className="gap-1">
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

                      <Popover
                        open={open.dateOfBirth}
                        onOpenChange={() =>
                          setOpen({ ...open, dateOfBirth: !open.dateOfBirth })
                        }
                      >
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
                              setOpen({ ...open, dateOfBirth: false });
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
          <div className="col-span-5">
            <h3 className="font-bold">Customer Information</h3>
            <div className="grid grid-cols-2  gap-3 p-2 rounded-md border-2 border-primary">
              <div className="md:col-span-1 col-span-2">
                <p>Passport</p>
                <div className="flex flex-col gap-3 p-2 rounded-md border-2 border-primary">
                  <Field className="gap-1">
                    <FieldLabel htmlFor="passport.documentNumber">
                      Number
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="passport.documentNumber"
                        type="text"
                        placeholder="Enter document number"
                        {...register("passport.documentNumber")}
                      />
                      <InputGroupAddon align="inline-start">
                        <FontAwesomeIcon
                          className={"text-primary"}
                          icon={faPassport}
                        />
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.passport?.documentNumber?.message && (
                      <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                        {errors.passport.documentNumber.message}
                      </FieldDescription>
                    )}
                  </Field>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Controller
                      name="passport.issueDate"
                      control={control}
                      render={({ field }) => (
                        <Field className="gap-1">
                          <FieldLabel htmlFor="passport-issue-date">
                            Issue Date
                          </FieldLabel>

                          <Popover
                            open={open.passportIssueDate}
                            onOpenChange={(isOpen) =>
                              setOpen({ ...open, passportIssueDate: isOpen })
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="passport-issue-date"
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
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
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
                                  setOpen({
                                    ...open,
                                    passportIssueDate: false,
                                  });
                                }}
                              />
                            </PopoverContent>
                          </Popover>

                          {errors.passport?.issueDate?.message && (
                            <p className="mt-1 text-red-500 text-xs ml-1">
                              {errors.passport.issueDate.message}
                            </p>
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="passport.expiryDate"
                      control={control}
                      render={({ field }) => (
                        <Field className="gap-1">
                          <FieldLabel htmlFor="passport-expiry-date">
                            Expiry Date
                          </FieldLabel>

                          <Popover
                            open={open.passportExpiryDate}
                            onOpenChange={(isOpen) =>
                              setOpen({ ...open, passportExpiryDate: isOpen })
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="passport-expiry-date"
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
                                endMonth={
                                  new Date(new Date().getFullYear() + 100, 11)
                                }
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
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
                                  setOpen({
                                    ...open,
                                    passportExpiryDate: false,
                                  });
                                }}
                              />
                            </PopoverContent>
                          </Popover>

                          {errors.passport?.expiryDate?.message && (
                            <p className="mt-1 text-red-500 text-xs ml-1">
                              {errors.passport.expiryDate.message}
                            </p>
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-1 col-span-2">
                <p>CMND/CCCD</p>
                <div className="flex flex-col gap-3 p-2 rounded-md border-2 border-primary">
                  <Field className="gap-1">
                    <FieldLabel htmlFor="identityCard.documentNumber">
                      Number
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="identityCard.documentNumber"
                        type="text"
                        placeholder="Enter document number"
                        {...register("identityCard.documentNumber")}
                      />
                      <InputGroupAddon align="inline-start">
                        <FontAwesomeIcon
                          className={"text-primary"}
                          icon={faIdCard}
                        />
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.identityCard?.documentNumber?.message && (
                      <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                        {errors.identityCard.documentNumber.message}
                      </FieldDescription>
                    )}
                  </Field>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Controller
                      name="identityCard.issueDate"
                      control={control}
                      render={({ field }) => (
                        <Field className="gap-1">
                          <FieldLabel htmlFor="identity-card-issue-date">
                            Issue Date
                          </FieldLabel>

                          <Popover
                            open={open.identityCardIssueDate}
                            onOpenChange={(isOpen) =>
                              setOpen({
                                ...open,
                                identityCardIssueDate: isOpen,
                              })
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="identity-card-issue-date"
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
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
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
                                  setOpen({
                                    ...open,
                                    identityCardIssueDate: false,
                                  });
                                }}
                              />
                            </PopoverContent>
                          </Popover>

                          {errors.identityCard?.issueDate?.message && (
                            <p className="mt-1 text-red-500 text-xs ml-1">
                              {errors.identityCard.issueDate.message}
                            </p>
                          )}
                        </Field>
                      )}
                    />
                    <Field className="gap-1">
                      <FieldLabel htmlFor="identityCard.issuePlace">
                        Issue Place
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="identityCard.issuePlace"
                          type="text"
                          placeholder="Enter issuePlace"
                          {...register("identityCard.issuePlace")}
                        />
                        <InputGroupAddon align="inline-start">
                          <FontAwesomeIcon
                            className={"text-primary"}
                            icon={faLocationDot}
                          />
                        </InputGroupAddon>
                      </InputGroup>
                      {errors.identityCard?.issuePlace?.message && (
                        <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                          {errors.identityCard.issuePlace.message}
                        </FieldDescription>
                      )}
                    </Field>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <p>Address</p>
                <div className="flex flex-col gap-3 p-2 rounded-md border-2 border-primary">
                  <div className="grid gap-2 md:grid-cols-2">
                    <Controller
                      name="address.provinceId"
                      control={control}
                      render={({ field }) => (
                        <Field className="gap-1 w-full">
                          <FieldLabel htmlFor="address.provinceId">
                            Province
                          </FieldLabel>

                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              id="address.provinceId"
                              className="w-full"
                            >
                              <SelectValue placeholder="select provinceId" />
                            </SelectTrigger>

                            <SelectContent className="bg-background">
                              <SelectGroup>
                                {provinceList.map((province) => (
                                  <SelectItem
                                    key={province.code}
                                    value={String(province.code)}
                                  >
                                    {province.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {errors.address?.provinceId?.message && (
                            <p className="mt-1 text-red-500 text-xs ml-1">
                              {errors.address.provinceId?.message}
                            </p>
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="address.wardId"
                      control={control}
                      render={({ field }) => (
                        <Field className="gap-1 w-full">
                          <FieldLabel htmlFor="wardId">
                            {isLoadingAddress && <Spinner />}
                            Ward
                          </FieldLabel>

                          <Select
                            onValueChange={field.onChange}
                            disabled={!watchProvinceId || isLoadingAddress}
                            value={field.value}
                          >
                            <SelectTrigger id="wardId" className="w-full">
                              <SelectValue placeholder="select ward" />
                            </SelectTrigger>

                            <SelectContent className="bg-background">
                              <SelectGroup>
                                {wardList &&
                                  wardList.map((ward) => (
                                    <SelectItem
                                      key={ward.code}
                                      value={String(ward.code)}
                                    >
                                      {ward.name}
                                    </SelectItem>
                                  ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {errors.address?.wardId?.message && (
                            <p className="mt-1 text-red-500 text-xs ml-1">
                              {errors.address.wardId?.message}
                            </p>
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <Field className="gap-1">
                    <FieldLabel htmlFor="address.detail">
                      Address Detail
                    </FieldLabel>
                    <Textarea
                      id="address.detail"
                      {...register("address.detail")}
                      placeholder="Enter address detail"
                    />
                    {errors.address?.detail?.message && (
                      <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                        {errors.address.detail.message}
                      </FieldDescription>
                    )}
                  </Field>
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
            Create Customer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
