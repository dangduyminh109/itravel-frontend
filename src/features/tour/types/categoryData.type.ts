export interface CreateCategoryData {
  name: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateCategoryData {
  id: number;
  name: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
}
