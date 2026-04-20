export type LocationType = "AREA" | "REGION" | "PROVINCE" | "DESTINATION";

export interface Location {
  id: number;
  name: string;
  slug: string;
  type: LocationType;
  status: "ACTIVE" | "INACTIVE";
  description?: string;
  parent?: Location;
  children?: Location[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
