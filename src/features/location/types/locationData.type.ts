import { LocationType } from "./location.type";

export interface CreateLocationData {
  name: string;
  type: LocationType;
  status: "ACTIVE" | "INACTIVE";
  description?: string;
  parentId?: number;
}

export interface UpdateLocationData extends CreateLocationData {
  id: number;
}
