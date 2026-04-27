export interface CreateTourData {
  name: string;
  summary?: string;
  description?: string;
  status: string;
  pricing: PricingData;
  duration: DurationData;
  participantLimit: ParticipantLimitData;
  services: ServicesData;
  categoryId: number;
  departureLocationId: number;
  destinationLocationId: number;
  itineraries: ItineraryData[];
  schedules: ScheduleData[];
  tourImages: TourImageData[];
}

export interface UpdateTourData {
  id: number;
  name: string;
  summary?: string;
  description?: string;
  status: string;
  pricing: PricingData;
  duration: DurationData;
  participantLimit: ParticipantLimitData;
  services: ServicesData;
  categoryId: number;
  departureLocationId: number;
  destinationLocationId: number;
  itineraries: ItineraryData[];
  schedules: ScheduleData[];
  tourImages: TourImageData[];
  removedImageUrls: string[];
}

export interface TicketPriceData {
  originalPrice: number;
  discountPrice: number;
}

export interface PricingData {
  adultPrice: TicketPriceData;
  childPrice: TicketPriceData;
  infantPrice: TicketPriceData;
  singleSupplement: number;
  currency: "VND" | "USD";
}

export interface DurationData {
  days: number;
  nights: number;
}

export interface ParticipantLimitData {
  minParticipants: number;
  maxParticipants: number;
}

export interface ServicesData {
  includedServices: string[];
  excludedServices: string[];
}
export interface ItineraryData {
  dayNumber: number;
  title: string;
  description?: string;
  activities: string[];
}

export interface TourImageData {
  image: File;
  isThumbnail: boolean;
}

export interface ScheduleData {
  id?: number;
  departureDate: Date;
  totalSeats: number;
  surcharge: number;
  pricing: PricingData;
  status: "OPEN" | "FULL" | "CANCELLED" | "COMPLETED";
}
