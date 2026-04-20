import CustomBreadcrumb from "@/components/shared/breadcrumb/CustomBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { getLocation } from "@/features/location/services/location.service";
import { Link } from "@/i18n/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faQuoteLeft, faTag, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/lib/utils";

const Page = async ({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) => {
  const { id } = await params;
  const breadcrumbData = {
    title: "Location detail",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Location", href: "/admin/location" },
      { name: "Location detail", href: `/admin/location/${id}` },
    ],
  };

  const result = await getLocation(Number(id));
  const location = result.success ? result.response : null;

  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      {!result.success ? (
        <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20">
          {result.message || "Location not found"}
        </div>
      ) : (
        <div className="mt-2">
          <div className="grid grid-cols-5 w-full gap-2 rounded-md p-2">
            <div className="col-span-5 lg:col-span-5 flex flex-col">
              <h3 className="font-bold">General Information</h3>
              <div className="flex-1 flex flex-col gap-3 p-4 rounded-md border-2 border-primary bg-background">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Location Name
                    </p>
                    <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                      <FontAwesomeIcon icon={faTag} className="text-primary" />
                      {location?.name}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <div className="shadow-sm p-2 border rounded-md mt-1">
                      <Badge
                        className={
                          location?.status === "ACTIVE"
                            ? "bg-[var(--success)] hover:bg-[var(--success)]"
                            : "bg-[var(--error)] hover:bg-[var(--error)]"
                        }
                      >
                        {location?.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Location Type
                    </p>
                    <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2 overflow-hidden">
                      <FontAwesomeIcon icon={faLayerGroup} className="text-primary" />
                      {location?.type}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Slug
                    </p>
                    <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2 overflow-hidden">
                      <FontAwesomeIcon icon={faLink} className="text-primary" />
                      {location?.slug}
                    </div>
                  </div>
                </div>

                {location?.parent && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Parent Location
                    </p>
                    <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2 overflow-hidden bg-accent/10">
                      <FontAwesomeIcon icon={faTag} className="text-primary/60" />
                      {location.parent.name} ({location.parent.type})
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Description
                  </p>
                  <div className="shadow-sm p-3 border rounded-md mt-1 min-h-[120px] whitespace-pre-wrap text-sm relative">
                    <FontAwesomeIcon
                      icon={faQuoteLeft}
                      className="absolute top-2 right-2 text-primary/10 text-2xl"
                    />
                    {location?.description || "No description provided."}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-2">
                  <div className="flex flex-col">
                    <p className="text-xs text-muted-foreground">Created At</p>
                    <div className="shadow p-2 border rounded-md flex-1 text-sm text-balance overflow-hidden">
                      {(location &&
                        location.createdAt &&
                        formatDate({
                          dateString: location.createdAt,
                          type: "datetime",
                        })) ||
                        "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-muted-foreground">Updated At</p>
                    <div className="shadow p-2 border rounded-md flex-1 text-sm text-balance overflow-hidden">
                      {(location?.updatedAt &&
                        formatDate({
                          dateString: location?.updatedAt,
                          type: "datetime",
                        })) ||
                        "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-muted-foreground">Deleted At</p>
                    <div className="shadow p-2 border rounded-md flex-1 text-sm text-balance overflow-hidden">
                      {(location?.deletedAt &&
                        formatDate({
                          dateString: location?.deletedAt,
                          type: "datetime",
                        })) ||
                        "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 flex justify-between mt-4 px-2">
            <Link
              className="cursor-pointer bg-background border text-sm
                rounded-md px-3 py-1 hover:bg-accent"
              href="/admin/location"
            >
              Back
            </Link>
            <Link
              className="cursor-pointer bg-primary text-background rounded-md px-3 py-1"
              href={`/admin/location/${id}/edit`}
            >
              Update Location
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
