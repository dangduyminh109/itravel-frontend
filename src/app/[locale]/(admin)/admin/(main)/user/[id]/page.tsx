import CustomBreadcrumb from "@/components/shared/breadcrumb/CustomBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/features/user/services/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/i18n/navigation";
import { getPermissions } from "@/features/role/services/role.service";
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
  faPhone,
  faUser,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/lib/utils";

const page = async ({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) => {
  const { id } = await params;
  const breadcrumbData = {
    title: "User detail",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "User", href: "/admin/user" },
      { name: "User detail", href: `/admin/user/${id}` },
    ],
  };

  let user = null;
  let permissionList: string[] = [];
  let permissionResult = null;

  const result = await getUser(id);
  if (result.success) {
    user = result.response;
    permissionList = [...user.roleList].flatMap((role) => role.permissionList);
    permissionResult = await getPermissions();
  }

  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      {!result.success ? (
        <div>{result.message || "User not found"}</div>
      ) : (
        <div className="mt-2">
          <div className="grid grid-cols-5 w-full gap-2 rounded-md p-2">
            <div className="col-span-5 md:col-span-3 flex flex-col ">
              <h3 className="font-bold">Account Information</h3>
              <div className="flex-1 flex flex-col gap-3 p-2 rounded-md border-2 border-primary">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <p>Username</p>
                    <div className="shadow p-2 border rounded-md">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="px-1 mr-1 text-primary"
                      />
                      {user?.username}
                    </div>
                  </div>
                  <div>
                    <p>Status</p>
                    <div className="shadow p-2 border rounded-md">
                      <Badge
                        className={
                          user?.status === "ACTIVE"
                            ? "bg-[var(--success)] hover:bg-[var(--success)]"
                            : "bg-[var(--error)] hover:bg-[var(--error)]"
                        }
                      >
                        {user?.status}
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
                            {permissionResult &&
                              user &&
                              permissionResult.success &&
                              permissionResult.response.map((permission) => {
                                return (
                                  <p>
                                    {permission.description}
                                    {/* kiểm tra per có trong role */}
                                    {(permissionList.some(
                                      (p) => p === permission.code,
                                    ) ||
                                      [...user.permissionOverrides].some(
                                        (o) => {
                                          {
                                            /* kiểm tra per không có trong role nhưng extended */
                                          }
                                          return (
                                            o.permission === permission.code &&
                                            o.permissionType === "GRANT"
                                          );
                                        },
                                      )) &&
                                      ![...user.permissionOverrides].some(
                                        (o) => {
                                          {
                                            /* kiểm tra per có trong role nhưng bị deny */
                                          }
                                          return (
                                            o.permission === permission.code &&
                                            o.permissionType === "DENY"
                                          );
                                        },
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
                    {user &&
                      [...user?.roleList].map((role) => {
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
                    src={user?.avatar}
                    alt="avatar"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {user?.username.slice(0, 2).toUpperCase()}
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
                      {user?.fullName}
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
                      {user?.email || "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p>Phone Number</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="px-1 mr-1 text-primary"
                      />
                      {user?.phoneNumber || "N/A"}
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
                      {user?.dateOfBirth || "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p>Gender</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      <FontAwesomeIcon
                        icon={faVenusMars}
                        className="px-1 mr-1 text-primary"
                      />
                      {user?.gender || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-2">
                  <div className="flex flex-col">
                    <p>Created At</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      {(user &&
                        formatDate({
                          dateString: user?.createdAt,
                          type: "datetime",
                        })) ||
                        "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p>Updated At</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      {(user?.updatedAt &&
                        formatDate({
                          dateString: user?.updatedAt,
                          type: "datetime",
                        })) ||
                        "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p>Deleted At</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      {(user?.deletedAt &&
                        formatDate({
                          dateString: user?.deletedAt,
                          type: "datetime",
                        })) ||
                        "N/A"}
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
              href="/admin/user"
            >
              Back
            </Link>
            <Link
              className="cursor-pointer bg-primary text-background rounded-md px-3 py-1"
              href="/admin/user/create"
            >
              Create User
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
