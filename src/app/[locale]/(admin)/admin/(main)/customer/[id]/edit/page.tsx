"use client";
import { CustomBreadcrumb } from "@/components/shared/breadcrumb/CustomBreadcrumb";
import {
  getCustomer,
  updateCustomer,
} from "@/features/customer/services/customer.service";
import {
  faAddressCard,
  faIdCard,
  faLocationDot,
  faPassport,
  faPhone,
  faUpload,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  fetchProvinces,
  fetchWards,
} from "@/features/auth/services/address.service";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useLoadingStore } from "@/store/loading.store";
import PasswordInput from "@/features/auth/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/utils";
import { useParams, useRouter } from "next/dist/client/components/navigation";
import { Customer } from "@/features/customer/types/customer.type";
import { Role } from "@/types/role";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UpdateCustomerData } from "@/features/customer/types/customerData.type";
import { updateCustomerSchema } from "@/features/customer/schemas/update-customer.schema";
import { Textarea } from "@/components/ui/textarea";
import { Province, Ward } from "@/types/address";
import ApiResponse from "@/types/ApiResponse.type";
import { Spinner } from "@/components/ui/spinner";
type updateCustomerSchema = z.infer<typeof updateCustomerSchema>;

const page = () => {
  const { id } = useParams<{ id: string }>();
  const breadcrumbData = {
    title: "Edit Customer",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Customer", href: "/admin/customer" },
      { name: "Edit Customer", href: `/admin/customer/${id}/edit` },
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
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [selectedRole, setSelectedRole] = useState<Set<Role>>(new Set());
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avartarUrl, setAvatarUrl] = useState<string | null>(null);
  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [wardList, setWardList] = useState<Ward[]>([]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<updateCustomerSchema>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      gender: "MALE",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      const result = await getCustomer(id);
      if (result.success) {
        const customerData = result.response;

        setCustomer(customerData);
        setValue("fullName", customerData.fullName);
        setValue("phoneNumber", customerData.phoneNumber || "");
        setValue("gender", customerData.gender || "");
        setValue("status", customerData.status || "");
        setSelectedRole(
          customerData.roleList ? new Set(customerData.roleList) : new Set(),
        );
        setValue(
          "dateOfBirth",
          customerData.dateOfBirth ? customerData.dateOfBirth : undefined,
        );
        if (customerData.address) {
          if (customerData.address.detail) {
            setValue("address.detail", customerData.address.detail);
          }
          if (customerData.address.provinceId) {
            setValue(
              "address.provinceId",
              String(customerData.address.provinceId),
            );
          }
          if (customerData.address.wardId) {
            setValue("address.wardId", String(customerData.address.wardId));
          }
        }
        if (customerData.passport) {
          if (customerData.passport.documentNumber) {
            setValue(
              "passport.documentNumber",
              customerData.passport.documentNumber,
            );
          }
          if (customerData.passport.issueDate) {
            setValue("passport.issueDate", customerData.passport.issueDate);
          }
          if (customerData.passport.expiryDate) {
            setValue("passport.expiryDate", customerData.passport.expiryDate);
          }
        }
        if (customerData.identityCard) {
          if (customerData.identityCard.documentNumber) {
            setValue(
              "identityCard.documentNumber",
              customerData.identityCard.documentNumber,
            );
          }
          if (customerData.identityCard.issueDate) {
            setValue(
              "identityCard.issueDate",
              customerData.identityCard.issueDate,
            );
          }
          if (customerData.identityCard.issuePlace) {
            setValue(
              "identityCard.issuePlace",
              customerData.identityCard.issuePlace,
            );
          }
        }
        if (customerData.avatar) {
          setAvatarUrl(customerData.avatar);
        }
      }
    };
    fetchCustomer();
  }, [id]);

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
      setIsLoadingAddress(true);
      if (watchProvinceId && Number(watchProvinceId)) {
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

  const onSubmit = async (data: updateCustomerSchema) => {
    const customerData: UpdateCustomerData = {
      id: id,
      fullName: data.fullName,
      newPassword: data.newPassword,
      dateOfBirth: data.dateOfBirth,
      status: data.status,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      address: data.address,
      identityCard: data.identityCard,
      passport: data.passport,
      roleList: new Set([...selectedRole].map((role) => role.id)),
      avatar: avatarRef.current?.files?.[0] || undefined,
    };
    setLoading(true);
    const result = await updateCustomer(customerData);
    if (result.success) {
      toast.success(result.message || "Update customer successfully!");
    } else {
      toast.error(result.message || "Failed to update customer.");
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
              <div className="grid gap-2 grid-cols-3">
                <div className="col-span-3 md:col-span-2">
                  <p>
                    Email{" "}
                    <span className="italic text-[var(--info)]">
                      (read-only)
                    </span>
                  </p>
                  <div className="shadow px-3 py-1 border rounded-md">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-2 text-primary"
                    />
                    {customer?.email}
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
                                field.onChange(
                                  formatDate({
                                    dateString: date.toDateString(),
                                    type: "date",
                                  }),
                                );
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
                                    field.onChange(
                                      formatDate({
                                        dateString: date.toDateString(),
                                        type: "date",
                                      }),
                                    );
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
                                    field.onChange(
                                      formatDate({
                                        dateString: date.toDateString(),
                                        type: "date",
                                      }),
                                    );
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
                                    field.onChange(
                                      formatDate({
                                        dateString: date.toDateString(),
                                        type: "date",
                                      }),
                                    );
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
                      render={({ field }) => {
                        return (
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
                        );
                      }}
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
            Update Customer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
