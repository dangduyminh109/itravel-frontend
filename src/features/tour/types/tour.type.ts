import { Itinerary } from "./itinerary.type";
import { Pricing } from "./pricing.type";
import { TourImage } from "./tourImage.type";

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
  includedServices: string[];
  excludedServices: string[];
  categoryName: string;
  departureLocationName: string;
  destinationLocationName: string;
  itineraries: Itinerary[];
  tourImages: TourImage[];
  createdAt: string;
  updatedAt: string;
}
