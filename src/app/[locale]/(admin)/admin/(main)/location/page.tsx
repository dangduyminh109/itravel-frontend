import CustomBreadcrumb from "@/components/shared/breadcrumb/CustomBreadcrumb";
import type { GeneralInfoType } from "@/components/shared/generaInfo/GeneralInfo";
import GeneralInfo from "@/components/shared/generaInfo/GeneralInfo";
import LocationTable from "@/features/location/components/table/LocationTable";
import { getLocationGeneralInfo } from "@/features/location/services/location.service";

const page = async () => {
  const breadcrumbData = {
    title: "Location Management",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Location", href: "/admin/location" },
    ],
  };

  let listInfo: GeneralInfoType[] = [];
  const result = await getLocationGeneralInfo();
  if (result.success) {
    const generalInfo = result.response;
    listInfo = [
      {
        title: "Total Locations",
        content: generalInfo.totalLocations.toString(),
      },
      {
        title: "Active Locations",
        content: generalInfo.totalActiveLocations.toString(),
      },
      {
        title: "Inactive Locations",
        content: generalInfo.totalInactiveLocations.toString(),
      },
      {
        title: "New Locations",
        content: generalInfo.newLocations.toString(),
      },
    ];
  }

  return (
    <div className="h-full w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      {result.success && <GeneralInfo data={listInfo} />}
      <LocationTable />
    </div>
  );
};

export default page;
