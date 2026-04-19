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
import { useRouter } from "next/dist/client/components/navigation";
import { useLoadingStore } from "@/store/loading.store";
import { createCategorySchema } from "@/features/tour/schemas/create-category.schema";
import { Textarea } from "@/components/ui/textarea";
import { CreateCategoryData } from "@/features/tour/types/categoryData.type";
import { createCategory } from "@/features/tour/services/category.service";

type createCategorySchema = z.infer<typeof createCategorySchema>;

const page = () => {
  const breadcrumbData = {
    title: "Create Category",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Tour", href: "/admin/tour" },
      { name: "Category", href: "/admin/tour/category" },
      { name: "Create Category", href: "/admin/tour/category/create" },
    ],
  };
  const router = useRouter();
  const { isLoading, setLoading } = useLoadingStore();
  const location = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<createCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      status: "ACTIVE",
    },
  });

  const onSubmit = async (data: createCategorySchema) => {
    const categoryData: CreateCategoryData = {
      name: data.name,
      status: data.status as "ACTIVE" | "INACTIVE",
      description: data.description,
    };
    setLoading(true);
    try {
      const result = await createCategory(categoryData);
      if (result.success) {
        toast.success(result.message || "Create category successfully!");
      } else {
        toast.error(result.message || "Failed to create category.");
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
          <div className="col-span-5 lg:col-span-5">
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
        <div className="flex justify-between mt-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button disabled={isLoading} className="cursor-pointer" type="submit">
            Create Category
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
