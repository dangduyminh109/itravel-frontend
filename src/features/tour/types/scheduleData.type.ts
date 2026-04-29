import { Pricing } from "./pricing.type";
import { ScheduleStatus } from "./tourData.type";

export interface CreateScheduleData {
  departureDate: Date;
  totalSeats: number;
  surcharge?: number;
  pricing: Pricing;
  status: ScheduleStatus;
  tourId: string;
}

export interface UpdateScheduleData {
  id: number;
  departureDate: Date;
  totalSeats: number;
  surcharge?: number;
  pricing: Pricing;
  status: ScheduleStatus;
}
