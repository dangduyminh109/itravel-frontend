import CustomBreadcrumb from "@/components/shared/breadcrumb/CustomBreadcrumb";
import {
  faCalendarDays,
  faCircleInfo,
  faImages,
  faMap,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import { ScheduleData } from "@/features/tour/types/tourData.type";
import { getTourDetail } from "@/features/tour/services/tour.service";
import { useParams } from "next/dist/client/components/navigation";
import { getSchedules } from "@/features/tour/services/schedule.service";
import { useLoadingStore } from "@/store/loading.store";
import { TourDetail } from "@/features/tour/types/tour.type";
import TourDescViewTab from "@/features/tour/components/tour/tab/TourDescViewTab";
import TourDetailViewTab from "@/features/tour/components/tour/tab/TourDetailViewTab";
import TourItineraryViewTab from "@/features/tour/components/tour/tab/TourItineraryViewTab";
import TourImageViewTab from "@/features/tour/components/tour/tab/TourImageViewTab";

const page = async ({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) => {
  const { id } = await params;
  const breadcrumbData = {
    title: "Tour detail",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Tour", href: "/admin/tour" },
      { name: "Tour detail", href: `/admin/tour/${id}` },
    ],
  };

  let tourData: TourDetail | undefined = undefined;
  let scheduleData: ScheduleData[] = [];

  async function fetchData() {
    try {
      const [tour, schedules] = await Promise.all([
        getTourDetail(id),
        getSchedules({ tourId: id }),
      ]);
      if (tour.success) {
        tourData = tour.response;
      } else {
        toast.error(
          "Failed to fetch tour! Please reload the page and try again.",
        );
      }
      if (schedules.success) {
        scheduleData = schedules.response.data || [];
      } else {
        toast.error(
          "Failed to fetch schedules! Please reload the page and try again.",
        );
      }
    } catch (e) {
      toast.error(
        "Failed to fetch location or categories! Please reload the page and try again.",
      );
    }
  }
  await fetchData();

  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      <Tabs defaultValue="tourDesc" className="w-full mt-2">
        <TabsList
          defaultValue="tourDesc"
          className="bg-primary flex justify-center gap-2 px-1 py-2 rounded-lg overflow-hidden text-white"
        >
          <div className="bg-secondary rounded-md p-1">
            <TabsTrigger
              value="tourDesc"
              className="mx-2 relative cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faMap} />
              Tour Description
            </TabsTrigger>
            <TabsTrigger
              value="detail"
              className="mx-2 relative cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faCircleInfo} />
              Detail
            </TabsTrigger>
            <TabsTrigger
              value="itinerary"
              className="mx-2 relative cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faRoute} />
              Itinerary
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="mx-2 relative cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faCalendarDays} />
              Schedule
            </TabsTrigger>

            <TabsTrigger
              value="image"
              className="mx-2 relative cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faImages} />
              Image
            </TabsTrigger>
          </div>
        </TabsList>
        <div className="mt-2">
          <TourDescViewTab tour={tourData} />
        </div>
        <div className="mt-2">
          <TourDetailViewTab tour={tourData} />
        </div>
        <div className="mt-2">
          <TourItineraryViewTab tour={tourData} />
        </div>
        <div className="mt-2">
          <TourImageViewTab tour={tourData} />
        </div>
      </Tabs>
    </div>
  );
};

export default page;
