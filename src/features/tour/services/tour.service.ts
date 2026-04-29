import { apiClient } from "@/lib/apiClient";
import ApiResponse, { PagingResponse } from "@/types/ApiResponse.type";
import { CreateTourData, UpdateTourData } from "../types/tourData.type";
import { Tour, TourDetail, TourFullInfo } from "../types/tour.type";
import { formatDate } from "@/lib/utils";
// import { TourGeneralInfo } from "../types/tourGeneralInfo.type";

interface GetToursProps {
  status?: "ACTIVE" | "INACTIVE" | "DRAFT";
  keyword?: string;
  deleted: boolean;
  page: number;
  size: number;
}

export async function getTours({
  status,
  deleted = false,
  page = 0,
  size = 5,
  keyword,
}: GetToursProps): Promise<ApiResponse<PagingResponse<Tour[]>>> {
  const isDeletedParam = `isDeleted=${deleted}`;
  const statusParam = status ? `status=${status}` : "";
  const pageParam = `page=${page}`;
  const sizeParam = `size=${size}`;
  const keywordParam = keyword ? `keyword=${keyword}` : "";
  const result = await apiClient<PagingResponse<Tour[]>>(
    `/tour?${isDeletedParam}&${statusParam}&${pageParam}&${sizeParam}&${keywordParam}`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function getTour(id: string): Promise<ApiResponse<TourFullInfo>> {
  const result = await apiClient<TourFullInfo>(`/tour/${id}`, {
    method: "GET",
  });
  return result;
}

export async function createTour(
  tourData: CreateTourData,
): Promise<ApiResponse<TourDetail>> {
  const data = new FormData();
  data.append("name", tourData.name);
  data.append("status", tourData.status);

  if (tourData.summary) {
    data.append("summary", tourData.summary);
  }
  if (tourData.description) {
    data.append("description", tourData.description);
  }
  if (tourData.categoryId) {
    data.append("categoryId", tourData.categoryId.toString());
  }

  if (tourData.pricing) {
    if (tourData.pricing.adultPrice) {
      data.append(
        "pricing.adultPrice.originalPrice",
        tourData.pricing.adultPrice.originalPrice.toString(),
      );
      if (tourData.pricing.adultPrice.discountPrice) {
        data.append(
          "pricing.adultPrice.discountPrice",
          tourData.pricing.adultPrice.discountPrice.toString(),
        );
      }
    }
    if (tourData.pricing.childPrice) {
      data.append(
        "pricing.childPrice.originalPrice",
        tourData.pricing.childPrice.originalPrice.toString(),
      );
      if (tourData.pricing.childPrice.discountPrice) {
        data.append(
          "pricing.childPrice.discountPrice",
          tourData.pricing.childPrice.discountPrice.toString(),
        );
      }
    }
    if (tourData.pricing.infantPrice) {
      data.append(
        "pricing.infantPrice.originalPrice",
        tourData.pricing.infantPrice.originalPrice.toString(),
      );
      if (tourData.pricing.infantPrice.discountPrice) {
        data.append(
          "pricing.infantPrice.discountPrice",
          tourData.pricing.infantPrice.discountPrice.toString(),
        );
      }
    }
    if (tourData.pricing.singleSupplement) {
      data.append(
        "pricing.singleSupplement",
        tourData.pricing.singleSupplement.toString(),
      );
    }
  }

  if (tourData.duration) {
    if (tourData.duration.days) {
      data.append("duration.days", tourData.duration.days.toString());
    }
    if (tourData.duration.nights) {
      data.append("duration.nights", tourData.duration.nights.toString());
    }
  }

  if (tourData.participantLimit) {
    if (tourData.participantLimit.minParticipants) {
      data.append(
        "participantLimit.minParticipants",
        tourData.participantLimit.minParticipants.toString(),
      );
    }
    if (tourData.participantLimit.maxParticipants) {
      data.append(
        "participantLimit.maxParticipants",
        tourData.participantLimit.maxParticipants.toString(),
      );
    }
  }

  if (tourData.services) {
    tourData.services.includes.forEach((service, index) => {
      data.append(`services.includes[${index}]`, service);
    });
    tourData.services.excludes.forEach((service, index) => {
      data.append(`services.excludes[${index}]`, service);
    });
  }
  if (tourData.departureLocationId) {
    data.append("departureLocationId", tourData.departureLocationId.toString());
  }

  if (tourData.destinationLocationId) {
    data.append(
      "destinationLocationId",
      tourData.destinationLocationId.toString(),
    );
  }

  tourData.itineraries.forEach((itinerary, index) => {
    data.append(
      `itineraries[${index}].dayNumber`,
      itinerary.dayNumber.toString(),
    );
    data.append(`itineraries[${index}].title`, itinerary.title);
    if (itinerary.description) {
      data.append(`itineraries[${index}].description`, itinerary.description);
    }
    itinerary.activities.forEach((activity, activityIndex) => {
      data.append(
        `itineraries[${index}].activities[${activityIndex}]`,
        activity,
      );
    });
  });

  tourData.schedules.forEach((schedule, index) => {
    if (schedule.departureDate) {
      data.append(
        `schedules[${index}].departureDate`,
        formatDate({
          dateString: schedule.departureDate.toISOString(),
          type: "datetime",
        }),
      );
    }
    if (schedule.totalSeats) {
      data.append(
        `schedules[${index}].totalSeats`,
        schedule.totalSeats.toString(),
      );
    }
    if (schedule.surcharge) {
      data.append(
        `schedules[${index}].surcharge`,
        schedule.surcharge.toString(),
      );
    }
    if (schedule.pricing) {
      if (schedule.pricing.adultPrice) {
        data.append(
          `schedules[${index}].pricing.adultPrice.originalPrice`,
          schedule.pricing.adultPrice.originalPrice.toString(),
        );
      }
      if (schedule.pricing.childPrice) {
        data.append(
          `schedules[${index}].pricing.childPrice.originalPrice`,
          schedule.pricing.childPrice.originalPrice.toString(),
        );
      }
      if (schedule.pricing.infantPrice) {
        data.append(
          `schedules[${index}].pricing.infantPrice.originalPrice`,
          schedule.pricing.infantPrice.originalPrice.toString(),
        );
      }
      if (schedule.pricing.singleSupplement) {
        data.append(
          `schedules[${index}].pricing.singleSupplement`,
          schedule.pricing.singleSupplement.toString(),
        );
      }
      if (schedule.pricing.currency) {
        data.append(
          `schedules[${index}].pricing.currency`,
          schedule.pricing.currency,
        );
      }
    }
    if (schedule.status) {
      data.append(`schedules[${index}].status`, schedule.status);
    }
  });
  tourData.tourImages.forEach((image, index) => {
    data.append(`tourImages[${index}].image`, image.image);
    data.append(
      `tourImages[${index}].isThumbnail`,
      image.isThumbnail.toString(),
    );
  });

  const result = await apiClient<TourDetail>(`/tour`, {
    method: "POST",
    body: data,
  });
  return result;
}

export async function updateTour(
  tourData: UpdateTourData,
): Promise<ApiResponse<TourDetail>> {
  const data = new FormData();
  data.append("name", tourData.name);
  data.append("status", tourData.status);

  if (tourData.summary) {
    data.append("summary", tourData.summary);
  }
  if (tourData.description) {
    data.append("description", tourData.description);
  }
  if (tourData.categoryId) {
    data.append("categoryId", tourData.categoryId.toString());
  }

  if (tourData.pricing) {
    if (tourData.pricing.adultPrice) {
      data.append(
        "pricing.adultPrice.originalPrice",
        tourData.pricing.adultPrice.originalPrice.toString(),
      );
      if (tourData.pricing.adultPrice.discountPrice) {
        data.append(
          "pricing.adultPrice.discountPrice",
          tourData.pricing.adultPrice.discountPrice.toString(),
        );
      }
    }
    if (tourData.pricing.childPrice) {
      data.append(
        "pricing.childPrice.originalPrice",
        tourData.pricing.childPrice.originalPrice.toString(),
      );
      if (tourData.pricing.childPrice.discountPrice) {
        data.append(
          "pricing.childPrice.discountPrice",
          tourData.pricing.childPrice.discountPrice.toString(),
        );
      }
    }
    if (tourData.pricing.infantPrice) {
      data.append(
        "pricing.infantPrice.originalPrice",
        tourData.pricing.infantPrice.originalPrice.toString(),
      );
      if (tourData.pricing.infantPrice.discountPrice) {
        data.append(
          "pricing.infantPrice.discountPrice",
          tourData.pricing.infantPrice.discountPrice.toString(),
        );
      }
    }
    if (tourData.pricing.singleSupplement) {
      data.append(
        "pricing.singleSupplement",
        tourData.pricing.singleSupplement.toString(),
      );
    }
    if (tourData.pricing.currency) {
      data.append("pricing.currency", tourData.pricing.currency);
    }
  }

  if (tourData.duration) {
    if (tourData.duration.days) {
      data.append("duration.days", tourData.duration.days.toString());
    }
    if (tourData.duration.nights) {
      data.append("duration.nights", tourData.duration.nights.toString());
    }
  }

  if (tourData.participantLimit) {
    if (tourData.participantLimit.minParticipants) {
      data.append(
        "participantLimit.minParticipants",
        tourData.participantLimit.minParticipants.toString(),
      );
    }
    if (tourData.participantLimit.maxParticipants) {
      data.append(
        "participantLimit.maxParticipants",
        tourData.participantLimit.maxParticipants.toString(),
      );
    }
  }

  if (tourData.services) {
    tourData.services.includes.forEach((service, index) => {
      data.append(`services.includes[${index}]`, service);
    });
    tourData.services.excludes.forEach((service, index) => {
      data.append(`services.excludes[${index}]`, service);
    });
  }
  if (tourData.departureLocationId) {
    data.append("departureLocationId", tourData.departureLocationId.toString());
  }

  if (tourData.destinationLocationId) {
    data.append(
      "destinationLocationId",
      tourData.destinationLocationId.toString(),
    );
  }

  tourData.itineraries.forEach((itinerary, index) => {
    data.append(
      `itineraries[${index}].dayNumber`,
      itinerary.dayNumber.toString(),
    );
    data.append(`itineraries[${index}].title`, itinerary.title);
    if (itinerary.description) {
      data.append(`itineraries[${index}].description`, itinerary.description);
    }
    itinerary.activities.forEach((activity, activityIndex) => {
      data.append(
        `itineraries[${index}].activities[${activityIndex}]`,
        activity,
      );
    });
  });

  tourData.schedules.forEach((schedule, index) => {
    if (schedule.departureDate) {
      data.append(
        `schedules[${index}].departureDate`,
        formatDate({
          dateString: schedule.departureDate.toISOString(),
          type: "datetime",
        }),
      );
    }
    if (schedule.totalSeats) {
      data.append(
        `schedules[${index}].totalSeats`,
        schedule.totalSeats.toString(),
      );
    }
    if (schedule.surcharge) {
      data.append(
        `schedules[${index}].surcharge`,
        schedule.surcharge.toString(),
      );
    }
    if (schedule.pricing) {
      if (schedule.pricing.adultPrice) {
        data.append(
          `schedules[${index}].pricing.adultPrice.originalPrice`,
          schedule.pricing.adultPrice.originalPrice.toString(),
        );
        if (schedule.pricing.adultPrice.discountPrice) {
          data.append(
            `schedules[${index}].pricing.adultPrice.discountPrice`,
            schedule.pricing.adultPrice.discountPrice.toString(),
          );
        }
      }
    }
    if (schedule.pricing.childPrice) {
      data.append(
        `schedules[${index}].pricing.childPrice.originalPrice`,
        schedule.pricing.childPrice.originalPrice.toString(),
      );
      if (schedule.pricing.childPrice.discountPrice) {
        data.append(
          `schedules[${index}].pricing.childPrice.discountPrice`,
          schedule.pricing.childPrice.discountPrice.toString(),
        );
      }
      if (schedule.pricing.currency) {
        data.append(
          `schedules[${index}].pricing.currency`,
          schedule.pricing.currency,
        );
      }
    }
    if (schedule.status) {
      data.append(`schedules[${index}].status`, schedule.status);
    }
  });

  tourData.tourImages.forEach((image, index) => {
    if (image.image) {
      data.append(`tourImages[${index}].image`, image.image);
      data.append(
        `tourImages[${index}].isThumbnail`,
        image.isThumbnail.toString(),
      );
    }
  });

  tourData.removedImageUrls.forEach((url, index) => {
    data.append(`removedImageUrls[${index}]`, url);
  });
  const result = await apiClient<TourDetail>(`/tour/${tourData.id}`, {
    method: "PUT",
    body: data,
  });
  return result;
}

export async function deleteTour(
  id: string,
  destroy?: boolean,
): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(
    `/tour/${id}${destroy ? "/destroy" : ""}`,
    {
      method: "DELETE",
    },
  );
  return result;
}

export async function restoreTour(id: string): Promise<ApiResponse<null>> {
  const result = await apiClient<null>(`/tour/${id}/restore`, {
    method: "PATCH",
  });
  return result;
}

// export async function getTourGeneralInfo(): Promise<
//   ApiResponse<TourGeneralInfo>
// > {
//   const result = await apiClient<TourGeneralInfo>(`/tour/general-info`, {
//     method: "GET",
//   });
//   return result;
// }
