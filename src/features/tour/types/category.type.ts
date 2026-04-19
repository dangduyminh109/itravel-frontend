export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}