import { CustomBreadcrumb } from "@/components/shared/breadcrumb/CustomBreadcrumb";
import GeneralInfo, {
  GeneralInfoType,
} from "@/components/shared/generaInfo/GeneralInfo";
import Table from "@/features/user/components/table/Table";
import { getGeneralInfo } from "@/features/user/services/user.service";

const page = async () => {
  const breadcrumbData = {
    title: "User Management",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "User", href: "/admin/user" },
    ],
  };
  let listInfo: GeneralInfoType[] = [];
  const result = await getGeneralInfo();
  if (result.success) {
    let generalInfo: UserGeneralInfo = result.response;
    listInfo = [
      {
        title: "Total Users",
        content: generalInfo.totalUsers.toString(),
      },
      {
        title: "Active Users",
        content: generalInfo.totalActiveUsers.toString(),
      },
      {
        title: "Inactive Users",
        content: generalInfo.totalInactiveUsers.toString(),
      },
      {
        title: "New Users",
        content: generalInfo.newUsers.toString(),
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
