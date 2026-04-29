"use client";

import CustomBreadcrumb from "@/components/shared/breadcrumb/CustomBreadcrumb";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/dist/client/components/navigation";
import { useLoadingStore } from "@/store/loading.store";
import { updateCategorySchema } from "@/features/tour/schemas/update-category.schema";
import { Textarea } from "@/components/ui/textarea";
import { UpdateCategoryData } from "@/features/tour/types/categoryData.type";
import {
  getCategory,
  updateCategory,
} from "@/features/tour/services/category.service";
import { useEffect } from "react";

type updateCategorySchema = z.infer<typeof updateCategorySchema>;

const page = () => {
  const { id } = useParams<{ id: string }>();
  const breadcrumbData = {
    title: "Edit Category",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Tour", href: "/admin/tour" },
      { name: "Category", href: "/admin/tour/category" },
      { name: "Edit Category", href: `/admin/tour/category/${id}/edit` },
    ],
  };

  const router = useRouter();
  const { isLoading, setLoading } = useLoadingStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<updateCategorySchema>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const result = await getCategory(Number(id));
        if (result.success) {
          const categoryData = result.response;
          setValue("name", categoryData.name);
          setValue("status", categoryData.status);
          setValue("description", categoryData.description || "");
        } else {
          toast.error(result.message || "Failed to fetch category data.");
          router.push("/admin/tour/category");
        }
      } catch (e) {
        toast.error("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, setValue, router, setLoading]);

  const onSubmit = async (data: updateCategorySchema) => {
    const categoryData: UpdateCategoryData = {
      id: Number(id),
      name: data.name,
      status: data.status as "ACTIVE" | "INACTIVE",
      description: data.description,
    };
    setLoading(true);
    try {
      const result = await updateCategory(categoryData);
      if (result.success) {
        toast.success(result.message || "Update category successfully!");
      } else {
        toast.error(result.message || "Failed to update category.");
      }
    } catch (e) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-5 w-full gap-2 rounded-md p-2">
          <div className="col-span-12 lg:col-span-5">
            <h3 className="font-bold">General Information</h3>
            <div className="flex flex-col gap-3 p-4 rounded-md border-2 border-primary bg-background">
              <Field className="gap-1">
                <FieldLabel htmlFor="name">Category Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter category name"
                  {...register("name")}
                />
                {errors.name?.message && (
                  <FieldDescription className="text-red-500 text-xs mt-1 ml-1">
                    {errors.name.message}
                  </FieldDescription>
                )}
              </Field>

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Field className="gap-1 w-full">
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectGroup>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.status?.message && (
                      <p className="mt-1 text-red-500 text-xs ml-1">
                        {errors.status?.message}
                      </p>
                    )}
                  </Field>
                )}
              />

              <Field className="gap-1">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Enter description"
                  className="min-h-[120px]"
                  {...register("description")}
                />
                {errors.description?.message && (
                  <FieldDescription className="text-red-500 text-xs mt-1 ml-1">
                    {errors.description.message}
                  </FieldDescription>
                )}
              </Field>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button disabled={isLoading} className="cursor-pointer" type="submit">
            Update Category
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
