import CustomBreadcrumb from "@/components/shared/breadcrumb/CustomBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { getCategory } from "@/features/tour/services/category.service";
import { Link } from "@/i18n/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faQuoteLeft, faTag } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/lib/utils";

const page = async ({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) => {
  const { id } = await params;
  const breadcrumbData = {
    title: "Category detail",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Tour", href: "/admin/tour" },
      { name: "Category", href: "/admin/tour/category" },
      { name: "Category detail", href: `/admin/tour/category/${id}` },
    ],
  };

  const result = await getCategory(Number(id));
  const category = result.success ? result.response : null;

  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      {!result.success ? (
        <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20">
          {result.message || "Category not found"}
        </div>
      ) : (
        <div className="mt-2">
          <div className="grid grid-cols-5 w-full gap-2 rounded-md p-2">
            <div className="col-span-5 lg:col-span-5 flex flex-col">
              <h3 className="font-bold">General Information</h3>
              <div className="flex-1 flex flex-col gap-3 p-4 rounded-md border-2 border-primary bg-background">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Category Name
                    </p>
                    <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                      <FontAwesomeIcon icon={faTag} className="text-primary" />
                      {category?.name}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <div className="shadow-sm p-2 border rounded-md mt-1">
                      <Badge
                        className={
                          category?.status === "ACTIVE"
                            ? "bg-[var(--success)] hover:bg-[var(--success)]"
                            : "bg-[var(--error)] hover:bg-[var(--error)]"
                        }
                      >
                        {category?.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Slug
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2 overflow-hidden">
                    <FontAwesomeIcon icon={faLink} className="text-primary" />
                    {category?.slug}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Description
                  </p>
                  <div className="shadow-sm p-3 border rounded-md mt-1 min-h-[120px] whitespace-pre-wrap text-sm relative">
                    <FontAwesomeIcon
                      icon={faQuoteLeft}
                      className="absolute top-2 right-2 text-primary/10 text-2xl"
                    />
                    {category?.description || "No description provided."}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-2">
                  <div className="flex flex-col">
                    <p>Created At</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      {(category &&
                        category.createdAt &&
                        formatDate({
                          dateString: category.createdAt,
                          type: "datetime",
                        })) ||
                        "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p>Updated At</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      {(category?.updatedAt &&
                        formatDate({
                          dateString: category?.updatedAt,
                          type: "datetime",
                        })) ||
                        "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p>Deleted At</p>
                    <div className="shadow p-2 border rounded-md flex-1">
                      {(category?.deletedAt &&
                        formatDate({
                          dateString: category?.deletedAt,
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
              href="/admin/tour/category"
            >
              Back
            </Link>
            <Link
              className="cursor-pointer bg-primary text-background rounded-md px-3 py-1"
              href={`/admin/tour/category/${id}/edit`}
            >
              Update Category
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
