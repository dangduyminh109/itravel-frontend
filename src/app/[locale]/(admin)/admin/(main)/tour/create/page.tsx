"use client";
import CustomBreadcrumb from "@/components/shared/breadcrumb/CustomBreadcrumb";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  faCalendarDays,
  faCircleInfo,
  faImages,
  faMap,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLoadingStore } from "@/store/loading.store";
import { createTourSchema } from "@/features/tour/schemas/create-tour.schema";
import { getLocationTree } from "@/features/location/services/location.service";
import { Location } from "@/features/location/types/location.type";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import { getCategories } from "@/features/tour/services/category.service";
import { Category } from "@/features/tour/types/category.type";
import TourDescTab from "@/features/tour/components/tour/tab/TourDescTab";
import TourDetailTab from "@/features/tour/components/tour/tab/TourDetailTab";
import TourItineraryTab from "@/features/tour/components/tour/tab/TourItineraryTab";
import TourScheduleTab from "@/features/tour/components/tour/tab/TourScheduleTab";
import TourImageTab from "@/features/tour/components/tour/tab/TourImageTab";
type createTourSchema = z.infer<typeof createTourSchema>;

const page = () => {
  const breadcrumbData = {
    title: "Create Tour",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Tour", href: "/admin/tour" },
      { name: "Create Tour", href: "/admin/tour/create" },
    ],
  };
  const [flatLocations, setFlatLocations] = useState<
    { id: number; name: string; type: string; depth: number }[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<createTourSchema>({
    resolver: zodResolver(createTourSchema),
    defaultValues: {
      status: "ACTIVE",
      pricing: {
        currency: "VND",
      },
      duration: {
        days: 1,
        nights: 1,
      },
      itineraries: [
        {
          dayNumber: 1,
          title: "",
          description: "",
        },
      ],
    },
  });
  const duration = watch("duration") || { days: 1, nights: 1 };
  const itinerary = watch("itineraries") || [];
  const [tab, setTab] = useState("tourDesc");

  useEffect(() => {
    async function fetchData() {
      setIsLoadingLocation(true);
      try {
        const [locationTree, categories] = await Promise.all([
          getLocationTree("ACTIVE"),
          getCategories({
            status: "ACTIVE",
            deleted: false,
            page: 0,
            size: 100,
          }),
        ]);
        if (locationTree.success) {
          const flattened: {
            id: number;
            name: string;
            type: string;
            depth: number;
          }[] = [];
          const flatten = (nodes: Location[], depth = 0) => {
            nodes.forEach((node) => {
              flattened.push({
                id: node.id,
                name: node.name,
                type: node.type,
                depth,
              });
              if (node.children && node.children.length > 0) {
                flatten(node.children, depth + 1);
              }
            });
          };
          flatten(locationTree.response);
          setFlatLocations(flattened);
        } else {
          toast.error(
            "Failed to fetch location! Please reload the page and try again.",
          );
        }
        if (categories.success) {
          setCategories(categories.response.data || []);
        } else {
          toast.error(
            "Failed to fetch categories! Please reload the page and try again.",
          );
        }
      } catch (e) {
        toast.error(
          "Failed to fetch location or categories! Please reload the page and try again.",
        );
      } finally {
        setIsLoadingLocation(false);
      }
    }
    fetchData();
  }, []);

  const onSubmit = async () => {};

  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
        <Tabs
          value={tab}
          onValueChange={setTab}
          defaultValue="tourDesc"
          className="w-full mt-2"
        >
          <TabsList
            defaultValue="tourDesc"
            className="bg-primary px-1 py-2 rounded-lg overflow-hidden text-center text-white"
          >
            <TabsTrigger
              value="tourDesc"
              className="mx-2 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faMap} />
              Tour Description
            </TabsTrigger>
            <TabsTrigger
              value="detail"
              className="mx-2 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faCircleInfo} />
              Detail
            </TabsTrigger>
            <TabsTrigger
              value="itinerary"
              className="mx-2 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faRoute} />
              Itinerary
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="mx-2 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faCalendarDays} />
              Schedule
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className="mx-2 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faImages} />
              Image
            </TabsTrigger>
          </TabsList>
          {tab === "tourDesc" && (
            <TourDescTab
              register={register}
              control={control}
              errors={errors}
            />
          )}
          {tab === "detail" && (
            <TourDetailTab
              register={register}
              control={control}
              errors={errors}
              categories={categories}
              flatLocations={flatLocations}
            />
          )}
          {tab === "itinerary" && (
            <TourItineraryTab
              register={register}
              control={control}
              errors={errors}
              duration={duration}
              setValue={setValue}
              itinerary={itinerary}
            />
          )}
          {tab === "schedule" && (
            <TourScheduleTab setValue={setValue} getValues={getValues} />
          )}

          {tab === "image" && <TourImageTab isLoading={isLoadingLocation} />}
        </Tabs>
      </form>
    </div>
  );
};

export default page;
