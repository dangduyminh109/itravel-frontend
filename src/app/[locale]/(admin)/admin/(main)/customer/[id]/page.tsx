import { CustomBreadcrumb } from "@/components/shared/breadcrumb/CustomBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { getCustomer } from "@/features/customer/services/customer.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/i18n/navigation";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faCalendarDays,
  faCheck,
  faEnvelope,
  faPassport,
  faPhone,
  faUser,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/lib/utils";
import { getPermissions } from "@/features/user/services/permission.service";
import { getProvince, getWard } from "@/features/auth/services/address.service";
import { Province, Ward } from "@/types/address";

const page = async ({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) => {
  const { id } = await params;
  const breadcrumbData = {
    title: "Customer detail",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Customer", href: "/admin/customer" },
      { name: "Customer detail", href: `/admin/customer/${id}` },
    ],
  };
  let customer = null;
  let permissionList: string[] = [];
  let permissionResult = null;
  let province: Province | null = null;
  let ward: Ward | null = null;

  const result = await getCustomer(id);
  if (result.success) {
    customer = result.response;
    permissionList = [...customer.roleList].flatMap(
      (role) => role.permissionList,
    );
    permissionResult = await getPermissions();
    if (customer.address?.provinceId) {
      const r = await getProvince(String(customer.address?.provinceId));
      if (r.success) {
        province = r.response;
      }
    }
    if (customer.address?.wardId) {
      const r = await getWard(String(customer.address?.wardId));
      if (r.success) {
        ward = r.response;
      }
    }
  }

  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      {!result.success ? (
        <div>{result.message || "Customer not found"}</div>
      ) : (
        <div className="mt-2">
          <div className="grid grid-cols-5 w-full gap-2 rounded-md p-2">
            <div className="col-span-5 md:col-span-3 flex flex-col ">
              <h3 className="font-bold">Account Information</h3>
              <div className="flex-1 flex flex-col gap-3 p-2 rounded-md border-2 border-primary">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <p>Full name</p>
                    <div className="shadow p-2 border rounded-md">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="px-1 mr-1 text-primary"
                      />
                      {customer?.fullName}
                    </div>
                  </div>
                  <div>
                    <p>Status</p>
                    <div className="shadow p-2 border rounded-md">
                      <Badge
                        className={
                          customer?.status === "ACTIVE"
                            ? "bg-[var(--success)] hover:bg-[var(--success)]"
                            : "bg-[var(--error)] hover:bg-[var(--error)]"
                        }
                      >
                        {customer?.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <p>Role</p>
                    <div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="cursor-pointer">
                            Permission List
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                          <DialogHeader>
                            <DialogTitle>Permission List</DialogTitle>
                          </DialogHeader>
                          <div>
                            {permissionResult?.success &&
                              permissionResult.response.map((permission) => {
                                return (
                                  <p>
                                    {permission.description}
                                    {/* kiểm tra per có trong role */}
                                    {permissionList.some(
                                      (p) => p === permission.code,
                                    ) && (
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        className="ml-2 text-[var(--success)]"
                                      />
                                    )}
                                  </p>
                                );
                              })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className="shadow p-2 border rounded-md flex gap-2">
                    {customer &&
                      [...customer.roleList].map((role) => {
                        return <Badge key={role.name}>{role.name}</Badge>;
                      })}
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
                <Avatar className="h-40 w-40">
                  <AvatarImage
                    src={customer?.avatar}
                    alt="avatar"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {customer?.fullName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="col-span-5">
              <h3 className="font-bold">Account Detail</h3>
              <div className="flex flex-col gap-3 p-2 rounded-md border-2 border-primary">
                <div className="grid gap-2">
                  <div className="flex flex-col">
                    <p>Full Name</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      <FontAwesomeIcon
                        className="px-1 mr-1 text-primary"
                        icon={faAddressCard}
                      />
                      {customer?.fullName}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <p>Email</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="px-1 mr-1 text-primary"
                      />
                      {customer?.email || "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p>Phone Number</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="px-1 mr-1 text-primary"
                      />
                      {customer?.phoneNumber || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <p>Date of Birth</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        className="px-1 mr-1 text-primary"
                      />
                      {customer?.dateOfBirth || "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p>Gender</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      <FontAwesomeIcon
                        icon={faVenusMars}
                        className="px-1 mr-1 text-primary"
                      />
                      {customer?.gender || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-2">
                  <div className="flex flex-col">
                    <p>Created At</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      {(customer &&
                        customer.createdAt &&
                        formatDate({
                          dateString: customer.createdAt,
                          type: "datetime",
                        })) ||
                        "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p>Updated At</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      {(customer?.updatedAt &&
                        formatDate({
                          dateString: customer?.updatedAt,
                          type: "datetime",
                        })) ||
                        "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p>Deleted At</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      {(customer?.deletedAt &&
                        formatDate({
                          dateString: customer?.deletedAt,
                          type: "datetime",
                        })) ||
                        "N/A"}
                    </div>
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
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <p>Number</p>
                        <div className="shadow p-2 border rounded-md flex-1">
                          <FontAwesomeIcon
                            className="px-1 mr-1 text-primary"
                            icon={faPassport}
                          />
                          {customer?.passport?.documentNumber || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <p>Issue Date</p>
                        <div className="shadow p-2 border rounded-md flex-1">
                          {customer?.passport?.issueDate || "N/A"}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p>Expiry Date</p>
                        <div className="shadow p-2 border rounded-md flex-1">
                          {customer?.passport?.expiryDate || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1 col-span-2">
                  <p>CMND/CCCD</p>
                  <div className="flex flex-col gap-3 p-2 rounded-md border-2 border-primary">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <p>Number</p>
                        <div className="shadow p-2 border rounded-md flex-1">
                          <FontAwesomeIcon
                            className="px-1 mr-1 text-primary"
                            icon={faPassport}
                          />
                          {customer?.identityCard?.documentNumber || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <p>Issue Date</p>
                        <div className="shadow p-2 border rounded-md flex-1">
                          {customer?.identityCard?.issueDate || "N/A"}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p>Issued Place</p>
                        <div className="shadow p-2 border rounded-md flex-1">
                          {customer?.identityCard?.issuePlace || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <p>Address</p>
                  <div className="flex flex-col gap-3 p-2 rounded-md border-2 border-primary">
                    <div className="grid md:grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <p>Province</p>
                        <div className="shadow p-2 border rounded-md flex-1">
                          {province?.name || "N/A"}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p>Ward</p>
                        <div className="shadow p-2 border rounded-md flex-1">
                          {ward?.name || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <p>Detail</p>
                        <div className="shadow p-2 h-24 border rounded-md overflow-auto">
                          {customer?.address?.detail || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 px-2">
            <Link
              className="cursor-pointer bg-background border text-sm
              rounded-md px-3 py-1 hover:bg-accent"
              href="/admin/customer"
            >
              Back
            </Link>
            <Link
              className="cursor-pointer bg-primary text-background rounded-md px-3 py-1"
              href="/admin/customer/create"
            >
              Create Customer
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
