import CustomBreadcrumb from "@/components/shared/breadcrumb/CustomBreadcrumb";
import type { GeneralInfoType } from "@/components/shared/generaInfo/GeneralInfo";
import GeneralInfo from "@/components/shared/generaInfo/GeneralInfo";
import Table from "@/features/tour/components/table/Table";
import { getCategoryGeneralInfo } from "@/features/tour/services/category.service";

const page = async () => {
  const breadcrumbData = {
    title: "Category Management",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Tour", href: "/admin/tour" },
      { name: "Category", href: "/admin/tour/category" },
    ],
  };

  let listInfo: GeneralInfoType[] = [];
  const result = await getCategoryGeneralInfo();
  if (result.success) {
    const generalInfo = result.response;
    listInfo = [
      {
        title: "Total Categories",
        content: generalInfo.totalCategories.toString(),
      },
      {
        title: "Active Categories",
        content: generalInfo.totalActiveCategories.toString(),
      },
      {
        title: "Inactive Categories",
        content: generalInfo.totalInactiveCategories.toString(),
      },
      {
        title: "New Categories",
        content: generalInfo.newCategories.toString(),
      },
    ];
  }

  return (
    <div className="h-full w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      {result.success && <GeneralInfo data={listInfo} />}
      <Table />
    </div>
  );
};

export default page;
