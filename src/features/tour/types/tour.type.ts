import { ScheduleStatus } from "./tourData.type";

export interface Tour {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string;
  categoryName: string;
  pricing: Pricing;
  departureLocation: string;
  destinationLocation: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
}

export interface TourFullInfo {
  id: string;
  name: string;
  summary?: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  pricing: Pricing;
  duration: Duration;
  participantLimit: ParticipantLimit;
  services: Services;
  categoryId: number;
  departureLocationId: number;
  destinationLocationId: number;
  itineraries: Itinerary[];
  tourImages: TourImage[];
}

export interface TourDetail {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  pricing: Pricing;
  durationDays: number;
  durationNights: number;
  minParticipants: number;
  maxParticipants: number;
  includes: string[];
  excludes: string[];
  categoryName: string;
  departureLocationName: string;
  destinationLocationName: string;
  itineraries: Itinerary[];
  tourImages: TourImage[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketPrice {
  originalPrice: number;
  discountPrice: number | null;
}

export interface Pricing {
  adultPrice: TicketPrice;
  childPrice: TicketPrice;
  infantPrice: TicketPrice;
  singleSupplement: number;
  currency: "VND" | "USD";
}

export interface Duration {
  days: number;
  nights: number;
}

export interface ParticipantLimit {
  minParticipants: number;
  maxParticipants: number;
}

export interface Services {
  includes: string[];
  excludes: string[];
}
export interface Itinerary {
  dayNumber: number;
  title: string;
  description?: string;
  activities: string[];
}

export interface TourImage {
  imageUrl: string;
  isThumbnail: boolean;
}

export interface Schedule {
  id: number;
  departureDate: Date;
  totalSeats: number;
  surcharge: number;
  pricing: Pricing;
  status: ScheduleStatus;
}
