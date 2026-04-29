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
import { getLocationTree } from "@/features/location/services/location.service";
import { Location } from "@/features/location/types/location.type";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import { getCategories } from "@/features/tour/services/category.service";
import { Category } from "@/features/tour/types/category.type";
import TourDescTab from "@/features/tour/components/tour/tab/TourDescTab";
import TourDetailTab from "@/features/tour/components/tour/tab/TourDetailTab";
import TourItineraryTab from "@/features/tour/components/tour/tab/TourItineraryTab";
import TourImageTab from "@/features/tour/components/tour/tab/TourImageTab";
import {
  UpdateTourData,
  ScheduleData,
  TourImageData,
  ScheduleStatus,
} from "@/features/tour/types/tourData.type";
import { getTour, updateTour } from "@/features/tour/services/tour.service";
import { useParams } from "next/dist/client/components/navigation";
import { updateTourSchema } from "@/features/tour/schemas/update-tour.schema";
import { getSchedules } from "@/features/tour/services/schedule.service";
import TourScheduleUpdateTab from "@/features/tour/components/tour/tab/TourScheduleUpdateTab";
import { useLoadingStore } from "@/store/loading.store";
type updateTourSchema = z.infer<typeof updateTourSchema>;

const page = () => {
  const { id } = useParams<{ id: string }>();
  const breadcrumbData = {
    title: "Edit Tour",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Tour", href: "/admin/tour" },
      { name: "Edit Tour", href: `/admin/tour/${id}/edit` },
    ],
  };

  const [flatLocations, setFlatLocations] = useState<
    { id: number; name: string; type: string; depth: number }[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tabError, setTabError] = useState({
    tourDesc: false,
    detail: false,
    itinerary: false,
    schedule: false,
    image: false,
  });
  const { isLoading, setLoading } = useLoadingStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<updateTourSchema>({
    resolver: zodResolver(updateTourSchema),
    defaultValues: {
      status: "ACTIVE",
      pricing: {
        adultPrice: {
          originalPrice: undefined,
          discountPrice: null,
        },
        childPrice: {
          originalPrice: undefined,
          discountPrice: null,
        },
        infantPrice: {
          originalPrice: undefined,
          discountPrice: null,
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
        includes: [],
        excludes: [],
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
  const [tourImageUrl, setTourImageUrl] = useState<{
    thumbnailImage: string | null;
    imageList: string[];
  }>({
    thumbnailImage: null,
    imageList: [],
  });

  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [locationTree, categories, tour, schedules] = await Promise.all([
          getLocationTree("ACTIVE"),
          getCategories({
            status: "ACTIVE",
            deleted: false,
            page: 0,
            size: 100,
          }),
          getTour(id),
          getSchedules({ tourId: id }),
        ]);
        if (tour.success) {
          const tourData = tour.response;
          setValue("name", tourData.name);
          setValue("summary", tourData.summary);
          setValue("description", tourData.description);
          setValue("status", tourData.status);
          setValue("pricing", {
            adultPrice: {
              originalPrice: tourData.pricing.adultPrice.originalPrice,
              discountPrice: tourData.pricing.adultPrice.discountPrice || null,
            },
            childPrice: {
              originalPrice: tourData.pricing.childPrice.originalPrice,
              discountPrice: tourData.pricing.childPrice.discountPrice || null,
            },
            infantPrice: {
              originalPrice: tourData.pricing.infantPrice.originalPrice,
              discountPrice: tourData.pricing.infantPrice.discountPrice || null,
            },
            singleSupplement: tourData.pricing.singleSupplement,
            currency: (tourData.pricing.currency as "VND" | "USD") || "VND",
          });
          setValue("duration", tourData.duration);
          setValue("participantLimit", tourData.participantLimit);
          setValue("services", tourData.services);
          setValue("categoryId", tourData.categoryId);
          setValue("departureLocationId", tourData.departureLocationId);
          setValue("destinationLocationId", tourData.destinationLocationId);
          setValue("itineraries", tourData.itineraries);
          setTourImageUrl({
            thumbnailImage:
              tourData.tourImages.find((img) => img.isThumbnail)?.imageUrl ||
              tourData.tourImages[0]?.imageUrl ||
              null,
            imageList: tourData.tourImages
              .filter((img) => !img.isThumbnail)
              .map((img) => img.imageUrl),
          });
        } else {
          toast.error(
            "Failed to fetch tour! Please reload the page and try again.",
          );
        }

        if (schedules.success) {
          const scheduleData = schedules.response.data || [];
          setValue("schedules", [
            ...scheduleData.map((schedule) => ({
              id: schedule.id,
              departureDate: new Date(schedule.departureDate)
                .toISOString()
                .split("T")[0],
              totalSeats: schedule.totalSeats,
              surcharge: schedule.surcharge,
              status: schedule.status as string,
              pricing: {
                adultPrice: {
                  originalPrice: schedule.pricing.adultPrice.originalPrice,
                  discountPrice:
                    schedule.pricing.adultPrice.discountPrice || null,
                },
                childPrice: {
                  originalPrice: schedule.pricing.childPrice.originalPrice,
                  discountPrice:
                    schedule.pricing.childPrice.discountPrice || null,
                },
                infantPrice: {
                  originalPrice: schedule.pricing.infantPrice.originalPrice,
                  discountPrice:
                    schedule.pricing.infantPrice.discountPrice || null,
                },
                singleSupplement: schedule.pricing.singleSupplement || 0,
                currency: (schedule.pricing.currency as "VND" | "USD") || "VND",
              },
            })),
          ]);
        } else {
          toast.error(
            "Failed to fetch schedules! Please reload the page and try again.",
          );
        }

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
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const onSubmit = async (data: updateTourSchema) => {
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
      id: schedule.id ? schedule.id : undefined,
      departureDate: new Date(schedule.departureDate),
      totalSeats: schedule.totalSeats,
      surcharge: schedule.surcharge || 0,
      status: (schedule.status as ScheduleStatus) || "OPEN",
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

    const tourData: UpdateTourData = {
      id: id,
      name: data.name,
      summary: data.summary,
      description: data.description,
      status: data.status,
      removedImageUrls: removedImageUrls || [],
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
        includes: data.services.includes || [],
        excludes: data.services.excludes || [],
      },
      categoryId: data.categoryId,
      departureLocationId: data.departureLocationId,
      destinationLocationId: data.destinationLocationId,
      itineraries: data.itineraries,
      schedules: schedules,
      tourImages: tourImages,
    };
    setLoading(true);
    const result = await updateTour(tourData);
    if (result.success) {
      toast.success(result.message || "Tour updated successfully!");
    } else {
      toast.error(result.message || "Failed to update tour.");
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
      <Tabs
        value={tab}
        onValueChange={setTab}
        defaultValue="tourDesc"
        className="w-full mt-2"
      >
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
              value="image"
              className="mx-2 relative cursor-pointer data-[state=active]:bg-white data-[state=active]:text-primary hover:bg-white hover:text-primary"
            >
              <FontAwesomeIcon className="mr-1" icon={faImages} />
              Image
              {tabError.image && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </TabsTrigger>
          </div>
          <div className="bg-secondary rounded-md p-1">
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
          </div>
        </TabsList>
        <form className="mt-2" onSubmit={handleSubmit(onSubmit, onError)}>
          {tab === "tourDesc" && (
            <TourDescTab
              register={register}
              control={control}
              errors={errors}
            />
          )}
          {tab === "detail" && !isLoading && (
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

          {tab === "image" && (
            <TourImageTab
              isLoading={isLoading}
              isUpdate={{
                tourImageUrl,
                setTourImageUrl,
                setRemovedImageUrls,
              }}
              tourImage={tourImage}
              setTourImage={setTourImage}
            />
          )}
        </form>
        {tab === "schedule" && (
          <TourScheduleUpdateTab
            getValues={getValues}
            errors={errors}
            tourId={id}
          />
        )}
      </Tabs>
    </div>
  );
};

export default page;
