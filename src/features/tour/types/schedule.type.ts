import { Pricing } from "./pricing.type";

export interface Schedule {
  id: number;
  departureDate: Date;
  availableSeats: number;
  totalSeats: number;
  lockedSeats: number;
  bookedSeats: number;
  pricing: Pricing;
  status: "OPEN" | "FULL" | "CANCELLED" | "COMPLETED";
  surcharge: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
