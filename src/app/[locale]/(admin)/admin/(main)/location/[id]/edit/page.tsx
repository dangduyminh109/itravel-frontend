"use client";

import CustomBreadcrumb from "@/components/shared/breadcrumb/CustomBreadcrumb";
import { toast } from "sonner";
import { useParams, useRouter } from "next/dist/client/components/navigation";
import { useLoadingStore } from "@/store/loading.store";
import {
  getLocation,
  getLocationTree,
  updateLocation,
} from "@/features/location/services/location.service";
import { UpdateLocationData } from "@/features/location/types/locationData.type";
import { useEffect, useState } from "react";
import { Location, LocationType } from "@/features/location/types/location.type";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateLocationSchema } from "@/features/location/schemas/update-location.schema";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import * as z from "zod";

type LocationFormValues = z.infer<typeof updateLocationSchema>;

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoading, setLoading } = useLoadingStore();
  const [flatLocations, setFlatLocations] = useState<
    { id: number; name: string; type: string; depth: number }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  const breadcrumbData = {
    title: "Edit Location",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Location", href: "/admin/location" },
      { name: "Edit Location", href: `/admin/location/${id}/edit` },
    ],
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(updateLocationSchema),
    defaultValues: {
      status: "ACTIVE",
      type: "PROVINCE",
      parentId: null,
    },
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [locationResult, treeResult] = await Promise.all([
          getLocation(Number(id)),
          getLocationTree(),
        ]);

        if (locationResult.success) {
          const location = locationResult.response;
          setValue("name", location.name);
          setValue("type", location.type);
          setValue("status", location.status);
          setValue("description", location.description || "");
          setValue("parentId", location.parent?.id || null);
        } else {
          toast.error(locationResult.message || "Failed to fetch location data.");
          router.push("/admin/location");
        }

        if (treeResult.success) {
          const flattened: {
            id: number;
            name: string;
            type: string;
            depth: number;
          }[] = [];
          
          const flattenAndFilter = (nodes: Location[], depth = 0) => {
            nodes.forEach((node) => {
              if (node.id === Number(id)) {
                return;
              }
              
              flattened.push({
                id: node.id,
                name: node.name,
                type: node.type,
                depth,
              });
              
              if (node.children && node.children.length > 0) {
                flattenAndFilter(node.children, depth + 1);
              }
            });
          };
          
          flattenAndFilter(treeResult.response);
          setFlatLocations(flattened);
        }
      } catch (e) {
        toast.error("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, router, setLoading, setValue]);

  const filteredLocations = flatLocations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: LocationFormValues) => {
    const locationData: UpdateLocationData = {
      id: Number(id),
      name: data.name,
      type: data.type as LocationType,
      status: data.status as "ACTIVE" | "INACTIVE",
      description: data.description,
      parentId: data.parentId || undefined,
    };

    setLoading(true);
    try {
      const result = await updateLocation(locationData);
      if (result.success) {
        toast.success(result.message || "Update location successfully!");
        router.push("/admin/location");
      } else {
        toast.error(result.message || "Failed to update location.");
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
            <h3 className="font-bold text-lg mb-2">General Information</h3>
            <div className="flex flex-col gap-3 p-4 rounded-md border-2 border-primary bg-background">
              <Field className="gap-1">
                <FieldLabel htmlFor="name">Location Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter location name"
                  {...register("name")}
                />
                {errors.name?.message && (
                  <FieldDescription className="text-red-500 text-xs mt-1 ml-1">
                    {errors.name.message}
                  </FieldDescription>
                )}
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1 w-full">
                      <FieldLabel htmlFor="type">Location Type</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id="type" className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectGroup>
                            <SelectItem value="AREA">Area</SelectItem>
                            <SelectItem value="REGION">Region</SelectItem>
                            <SelectItem value="PROVINCE">Province</SelectItem>
                            <SelectItem value="DESTINATION">
                              Destination
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.type?.message && (
                        <p className="mt-1 text-red-500 text-xs ml-1">
                          {errors.type.message}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1 w-full">
                      <FieldLabel htmlFor="status">Status</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                          {errors.status.message}
                        </p>
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="parentId"
                control={control}
                render={({ field }) => (
                  <Field className="gap-1 w-full">
                    <FieldLabel htmlFor="parentId">
                      Parent Location (Optional)
                    </FieldLabel>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(val === "none" ? null : Number(val))
                      }
                      value={field.value?.toString() || "none"}
                    >
                      <SelectTrigger id="parentId" className="w-full">
                        <SelectValue placeholder="Select parent location" />
                      </SelectTrigger>
                      <SelectContent className="bg-background max-h-60 overflow-y-auto">
                        <div className="p-2 sticky top-0 bg-background z-10 border-b">
                          <Input
                            placeholder="Search location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <SelectGroup>
                          <SelectItem value="none">None</SelectItem>
                          {filteredLocations.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id.toString()}>
                              {"--".repeat(loc.depth)} {loc.name} ({loc.type})
                            </SelectItem>
                          ))}
                          {filteredLocations.length === 0 && searchTerm && (
                            <div className="p-2 text-sm text-muted-foreground text-center">
                              No results found
                            </div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.parentId?.message && (
                      <p className="mt-1 text-red-500 text-xs ml-1">
                        {errors.parentId.message}
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
        <div className="flex justify-between mt-4 px-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button disabled={isLoading} className="cursor-pointer" type="submit">
            Update Location
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
