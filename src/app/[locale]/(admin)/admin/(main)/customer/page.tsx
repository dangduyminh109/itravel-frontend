import CustomBreadcrumb from "@/components/shared/breadcrumb/CustomBreadcrumb";
import type { GeneralInfoType } from "@/components/shared/generaInfo/GeneralInfo";
import GeneralInfo from "@/components/shared/generaInfo/GeneralInfo";
import Table from "@/features/customer/components/table/Table";
import { getGeneralInfo } from "@/features/customer/services/customer.service";

const page = async () => {
  const breadcrumbData = {
    title: "Customer Management",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Customer", href: "/admin/customer" },
    ],
  };

  let listInfo: GeneralInfoType[] = [];
  const result = await getGeneralInfo();
  if (result.success) {
    let generalInfo: CustomerGeneralInfo = result.response;
    listInfo = [
      {
        title: "Total Customers",
        content: generalInfo.totalCustomers.toString(),
      },
      {
        title: "Active Customers",
        content: generalInfo.totalActiveCustomers.toString(),
      },
      {
        title: "Inactive Customers",
        content: generalInfo.totalInactiveCustomers.toString(),
      },
      {
        title: "New Customers",
        content: generalInfo.newCustomers.toString(),
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
