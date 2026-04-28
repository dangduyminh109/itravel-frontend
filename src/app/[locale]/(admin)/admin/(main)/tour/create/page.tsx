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
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import {
  CreateTourData,
  ScheduleData,
  scheduleStatus,
  TourImageData,
} from "@/features/tour/types/tourData.type";
import { createTour } from "@/features/tour/services/tour.service";
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
  const [tabError, setTabError] = useState({
    tourDesc: false,
    detail: false,
    itinerary: false,
    schedule: false,
    image: false,
  });
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
        adultPrice: {
          originalPrice: undefined,
          discountPrice: undefined,
        },
        childPrice: {
          originalPrice: undefined,
          discountPrice: undefined,
        },
        infantPrice: {
          originalPrice: undefined,
          discountPrice: undefined,
        },
        singleSupplement: 0,
        currency: "VND",
      },
      participantLimit: {
        minParticipants: undefined,
        maxParticipants: undefined,
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
          activities: [""],
        },
      ],
      services: {
        includedServices: [],
        excludedServices: [],
      },
      schedules: [],
    },
  });
  const duration = watch("duration") || { days: 1, nights: 1 };
  const itinerary = watch("itineraries") || [];
  const [tab, setTab] = useState("tourDesc");
  const [tourImage, setTourImage] = useState<{
    thumbnailImage: File | null;
    imageList: File[];
  }>({
    thumbnailImage: null,
    imageList: [],
  });
  const [isLoading, setLoading] = useState(false);

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

  const onSubmit = async (data: createTourSchema) => {
    const tourImages: TourImageData[] = tourImage.imageList.map(
      (file: File) => ({
        image: file,
        isThumbnail: false,
      }),
    );
    if (tourImage.thumbnailImage) {
      tourImages.push({
        image: tourImage.thumbnailImage,
        isThumbnail: true,
      });
    }
    const schedules: ScheduleData[] = data.schedules.map((schedule) => ({
      departureDate: new Date(schedule.departureDate),
      totalSeats: schedule.totalSeats,
      surcharge: schedule.surcharge || 0,
      status: (schedule.status as scheduleStatus) || "OPEN",
      pricing: {
        adultPrice: {
          originalPrice: schedule.pricing.adultPrice.originalPrice,
          discountPrice: schedule.pricing.adultPrice.discountPrice || null,
        },
        childPrice: {
          originalPrice: schedule.pricing.childPrice.originalPrice,
          discountPrice: schedule.pricing.childPrice.discountPrice || null,
        },
        infantPrice: {
          originalPrice: schedule.pricing.infantPrice.originalPrice,
          discountPrice: schedule.pricing.infantPrice.discountPrice || null,
        },
        singleSupplement: schedule.pricing.singleSupplement || 0,
        currency: schedule.pricing.currency || "VND",
      },
    }));

    const tourData: CreateTourData = {
      name: data.name,
      summary: data.summary,
      description: data.description,
      status: data.status,
      pricing: {
        adultPrice: {
          originalPrice: data.pricing.adultPrice.originalPrice,
          discountPrice: data.pricing.adultPrice.discountPrice || null,
        },
        childPrice: {
          originalPrice: data.pricing.childPrice.originalPrice,
          discountPrice: data.pricing.childPrice.discountPrice || null,
        },
        infantPrice: {
          originalPrice: data.pricing.infantPrice.originalPrice,
          discountPrice: data.pricing.infantPrice.discountPrice || null,
        },
        singleSupplement: data.pricing.singleSupplement || 0,
        currency: data.pricing.currency || "VND",
      },
      duration: data.duration,
      participantLimit: data.participantLimit,
      services: {
        includedServices: data.services.includedServices || [],
        excludedServices: data.services.excludedServices || [],
      },
      categoryId: data.categoryId,
      departureLocationId: data.departureLocationId,
      destinationLocationId: data.destinationLocationId,
      itineraries: data.itineraries,
      schedules: schedules,
      tourImages: tourImages,
    };
    setLoading(true);
    const result = await createTour(tourData);
    if (result.success) {
      toast.success(result.message || "Tour created successfully!");
    } else {
      toast.error(result.message || "Failed to create tour.");
    }
    setLoading(false);
  };

  const onError = async (error: any) => {
    const errorList = {
      tourDesc: false,
      detail: false,
      itinerary: false,
      schedule: false,
      image: false,
    };
    if (error.schedules) {
      errorList.schedule = true;
    }
    if (error.itineraries) {
      errorList.itinerary = true;
    }
    if (error.name || error.status) {
      errorList.tourDesc = true;
    }
    if (
      error.categoryId ||
      error.departureLocationId ||
      error.destinationLocationId ||
      error.pricing ||
      error.participantLimit
    ) {
      errorList.detail = true;
    }
    setTabError({ ...errorList });
  };
  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      <form className="mt-2" onSubmit={handleSubmit(onSubmit, onError)}>
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
              className="mx-2 relative cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faMap} />
              Tour Description
              {tabError.tourDesc && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="detail"
              className="mx-2 relative cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faCircleInfo} />
              Detail
              {tabError.detail && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="itinerary"
              className="mx-2 relative cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faRoute} />
              Itinerary
              {tabError.itinerary && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="mx-2 relative cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faCalendarDays} />
              Schedule
              {tabError.schedule && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className="mx-2 relative cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faImages} />
              Image
              {tabError.image && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </TabsTrigger>
          </TabsList>
          {tab === "tourDesc" && (
            <TourDescTab
              register={register}
              control={control}
              errors={errors}
            />
          )}
          {tab === "detail" && !isLoadingLocation && (
            <TourDetailTab
              register={register}
              control={control}
              errors={errors}
              getValues={getValues}
              setValue={setValue}
              categories={categories}
              flatLocations={flatLocations}
            />
          )}
          {tab === "itinerary" && (
            <TourItineraryTab
              register={register}
              control={control}
              errors={errors}
              getValues={getValues}
              duration={duration}
              setValue={setValue}
              itinerary={itinerary}
            />
          )}
          {tab === "schedule" && (
            <TourScheduleTab
              setValue={setValue}
              getValues={getValues}
              errors={errors}
            />
          )}

          {tab === "image" && (
            <TourImageTab
              isLoading={isLoading}
              tourImage={tourImage}
              setTourImage={setTourImage}
            />
          )}
        </Tabs>
      </form>
    </div>
  );
};

export default page;
