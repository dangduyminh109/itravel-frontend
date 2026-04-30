"use client";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  faArrowRotateLeft,
  faArrowsRotate,
  faChair,
  faMoneyBillWave,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FieldDescription } from "@/components/ui/field";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { z } from "zod";
import { scheduleItemSchema } from "@/features/tour/schemas/schedule.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ScheduleTable from "../table/ScheduleTable";
import {
  createSchedule,
  deleteSchedule,
  updateSchedule,
} from "@/features/tour/services/schedule.service";
import {
  CreateScheduleData,
  UpdateScheduleData,
} from "@/features/tour/types/scheduleData.type";
import { ScheduleStatus } from "@/features/tour/types/tourData.type";
import { Input } from "@/components/ui/input";
import { useLoadingStore } from "@/store/loading.store";

type scheduleItemSchema = z.infer<typeof scheduleItemSchema>;

type TourScheduleTabProps = {
  getValues: any;
  errors: any;
  tourId: string;
};

const TourScheduleUpdateTab = (props: TourScheduleTabProps) => {
  const { tourId, getValues: getTourValues, errors: tourErrors } = props;
  const [isUpdate, setIsUpdate] = useState<number | null>(null);
  const { setLoading } = useLoadingStore();
  const {
    register,
    control,
    getValues,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleItemSchema),
    defaultValues: {
      departureDate: new Date().toISOString().slice(0, 10),
      totalSeats:
        Number(getTourValues("participantLimit.maxParticipants")) || 1,
      surcharge: 0,
      status: "OPEN",
      pricing: {
        adultPrice: {
          originalPrice:
            Number(getTourValues("pricing.adultPrice.originalPrice")) ||
            undefined,
          discountPrice:
            Number(getTourValues("pricing.adultPrice.discountPrice")) ||
            undefined,
        },
        childPrice: {
          originalPrice:
            Number(getTourValues("pricing.childPrice.originalPrice")) ||
            undefined,
          discountPrice:
            Number(getTourValues("pricing.childPrice.discountPrice")) ||
            undefined,
        },
        infantPrice: {
          originalPrice:
            Number(getTourValues("pricing.infantPrice.originalPrice")) ||
            undefined,
          discountPrice:
            Number(getTourValues("pricing.infantPrice.discountPrice")) ||
            undefined,
        },
        singleSupplement:
          Number(getTourValues("pricing.singleSupplement")) || 0,
        currency: getTourValues("pricing.currency") || "VND",
      },
    },
  });
  const minParticipants = getTourValues("participantLimit.minParticipants");
  const onCancel = () => {
    setIsUpdate(null);
    reset();
  };

  const onDelete = async () => {
    setLoading(true);
    const result = await deleteSchedule(isUpdate!);
    if (result.success) {
      toast.success("Schedule deleted successfully");
      setIsUpdate(null);
      reset();
    }
    setLoading(false);
  };

  const onSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      const data = getValues();
      if (data.totalSeats < minParticipants) {
        toast.error(
          `Total seats must be greater than or equal to minimum participants (${minParticipants})`,
        );
        return;
      }
      setLoading(true);
      try {
        if (data.id) {
          const scheduleData: UpdateScheduleData = {
            id: data.id,
            departureDate: new Date(data.departureDate),
            totalSeats: data.totalSeats,
            surcharge: data.surcharge,
            status: data.status as ScheduleStatus,
            pricing: {
              adultPrice: {
                originalPrice: data.pricing.adultPrice.originalPrice,
                discountPrice: data.pricing.adultPrice.discountPrice || null,
              },
              childPrice: {
                originalPrice: data.pricing.childPrice.originalPrice,
                discountPrice: data.pricing.childPrice.discountPrice || null,
              },
              infantPrice: {
                originalPrice: data.pricing.infantPrice.originalPrice,
                discountPrice: data.pricing.infantPrice.discountPrice || null,
              },
              singleSupplement: data.pricing.singleSupplement || 0,
              currency: data.pricing.currency,
            },
          };
          const result = await updateSchedule(scheduleData);
          if (result.success) {
            toast.success("Schedule updated successfully");
            setIsUpdate(null);
            reset();
          } else {
            toast.error(result.message || "Failed to update schedule");
          }
        } else {
          const scheduleData: CreateScheduleData = {
            departureDate: new Date(data.departureDate),
            totalSeats: data.totalSeats,
            surcharge: data.surcharge,
            status: data.status as ScheduleStatus,
            pricing: {
              adultPrice: {
                originalPrice: data.pricing.adultPrice.originalPrice,
                discountPrice: data.pricing.adultPrice.discountPrice || null,
              },
              childPrice: {
                originalPrice: data.pricing.childPrice.originalPrice,
                discountPrice: data.pricing.childPrice.discountPrice || null,
              },
              infantPrice: {
                originalPrice: data.pricing.infantPrice.originalPrice,
                discountPrice: data.pricing.infantPrice.discountPrice || null,
              },
              singleSupplement: data.pricing.singleSupplement || 0,
              currency: data.pricing.currency,
            },
            tourId: tourId,
          };
          const result = await createSchedule(scheduleData);
          if (result.success) {
            toast.success("Schedule created successfully");
            setIsUpdate(null);
            reset();
          } else {
            toast.error(result.message || "Failed to create schedule");
          }
        }
      } catch (error) {
        toast.error("An error occurred while saving the schedule");
        return;
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (getValues("id")) {
      setIsUpdate(Number(getValues("id")));
    }
  }, [watch("id")]);
  return (
    <div>
      <TabsContent value="schedule">
        <Card defaultValue="preview">
          <CardHeader className="p-4">
            <CardTitle>Schedule Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground p-4 pt-0">
            <div className="grid grid-cols-5 gap-3 p-2 rounded-md border-2 border-primary">
              <div className="md:col-span-2 col-span-5">
                <Controller
                  control={control}
                  name="departureDate"
                  render={({ field }) => {
                    const [datePart, timePart] = (field.value || "").split("T");
                    const selectedDate = datePart
                      ? new Date(datePart + "T00:00:00")
                      : undefined;

                    const time = timePart?.slice(0, 5) || "10:30";

                    return (
                      <>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            if (!date) {
                              field.onChange("");
                              return;
                            }

                            const newDate = `${date.getFullYear()}-${String(
                              date.getMonth() + 1,
                            ).padStart(
                              2,
                              "0",
                            )}-${String(date.getDate()).padStart(2, "0")}`;

                            field.onChange(`${newDate}T${time}:00`);
                          }}
                          className="rounded-lg border w-full"
                          captionLayout="dropdown"
                        />
                        <Field className="w-full mt-2">
                          <Input
                            type="time"
                            value={time}
                            onChange={(e) => {
                              const newTime = e.target.value;

                              if (!datePart) return;

                              field.onChange(`${datePart}T${newTime}:00`);
                            }}
                          />
                        </Field>
                      </>
                    );
                  }}
                />
                {errors.departureDate?.message && (
                  <p className="mt-1 text-red-500 text-xs ml-1">
                    {errors.departureDate?.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-3 col-span-5 grid grid-cols-2 gap-1">
                <Controller
                  name="totalSeats"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1 col-span-2 md:col-span-1">
                      <FieldLabel htmlFor="totalSeats">Total Seats</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="totalSeats"
                          type="number"
                          placeholder="Enter totalSeats"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />

                        <InputGroupAddon align="inline-start">
                          <FontAwesomeIcon
                            className="text-primary"
                            icon={faChair}
                          />
                        </InputGroupAddon>
                      </InputGroup>

                      {errors.totalSeats?.message && (
                        <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                          {errors.totalSeats.message}
                        </FieldDescription>
                      )}

                      {Number(field.value) < minParticipants && (
                        <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                          Total seats must be greater than or equal to minimum
                          participants ({minParticipants})
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />

                <Field className="gap-1 col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="surcharge">Surcharge</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="surcharge"
                      type="number"
                      placeholder="Enter surcharge"
                      {...register("surcharge", { valueAsNumber: true })}
                    />
                    <InputGroupAddon align="inline-start">
                      <FontAwesomeIcon
                        className={"text-primary"}
                        icon={faMoneyBillWave}
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.surcharge?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.surcharge.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field className="gap-1 col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="pricing.adultPrice.originalPrice">
                    Adult Original Price
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="pricing.adultPrice.originalPrice"
                      type="number"
                      placeholder="Enter original price"
                      {...register("pricing.adultPrice.originalPrice", {
                        valueAsNumber: true,
                      })}
                    />
                    <InputGroupAddon align="inline-start">
                      <FontAwesomeIcon
                        className={"text-primary"}
                        icon={faMoneyBillWave}
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.pricing?.adultPrice?.originalPrice?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.pricing.adultPrice.originalPrice.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field className="gap-1 col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="pricing.adultPrice.discountPrice">
                    Adult Discount Price
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="pricing.adultPrice.discountPrice"
                      type="number"
                      placeholder="Enter discount price"
                      {...register("pricing.adultPrice.discountPrice", {
                        valueAsNumber: true,
                      })}
                    />
                    <InputGroupAddon align="inline-start">
                      <FontAwesomeIcon
                        className={"text-primary"}
                        icon={faMoneyBillWave}
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.pricing?.adultPrice?.discountPrice?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.pricing.adultPrice.discountPrice.message}
                    </FieldDescription>
                  )}
                  {errors.pricing?.adultPrice?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.pricing.adultPrice.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field className="gap-1 col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="pricing.childPrice.originalPrice">
                    Child Original Price
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="pricing.childPrice.originalPrice"
                      type="number"
                      placeholder="Enter original price"
                      {...register("pricing.childPrice.originalPrice", {
                        valueAsNumber: true,
                      })}
                    />
                    <InputGroupAddon align="inline-start">
                      <FontAwesomeIcon
                        className={"text-primary"}
                        icon={faMoneyBillWave}
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.pricing?.childPrice?.originalPrice?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.pricing.childPrice.originalPrice.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field className="gap-1 col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="pricing.childPrice.discountPrice">
                    Child Discount Price
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="pricing.childPrice.discountPrice"
                      type="number"
                      placeholder="Enter discount price"
                      {...register("pricing.childPrice.discountPrice", {
                        valueAsNumber: true,
                      })}
                    />
                    <InputGroupAddon align="inline-start">
                      <FontAwesomeIcon
                        className={"text-primary"}
                        icon={faMoneyBillWave}
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.pricing?.childPrice?.discountPrice?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.pricing.childPrice.discountPrice.message}
                    </FieldDescription>
                  )}
                  {errors.pricing?.childPrice?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.pricing.childPrice.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field className="gap-1 col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="pricing.infantPrice.originalPrice">
                    Infant Original Price
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="pricing.infantPrice.originalPrice"
                      type="number"
                      placeholder="Enter original price"
                      {...register("pricing.infantPrice.originalPrice", {
                        valueAsNumber: true,
                      })}
                    />
                    <InputGroupAddon align="inline-start">
                      <FontAwesomeIcon
                        className={"text-primary"}
                        icon={faMoneyBillWave}
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.pricing?.infantPrice?.originalPrice?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.pricing.infantPrice.originalPrice.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field className="gap-1 col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="pricing.infantPrice.discountPrice">
                    Infant Discount Price
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="pricing.infantPrice.discountPrice"
                      type="number"
                      placeholder="Enter discount price"
                      {...register("pricing.infantPrice.discountPrice", {
                        valueAsNumber: true,
                      })}
                    />
                    <InputGroupAddon align="inline-start">
                      <FontAwesomeIcon
                        className={"text-primary"}
                        icon={faMoneyBillWave}
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.pricing?.infantPrice?.discountPrice?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.pricing.infantPrice.discountPrice.message}
                    </FieldDescription>
                  )}

                  {errors.pricing?.infantPrice?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.pricing.infantPrice.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field className="gap-1 col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="pricing.singleSupplement">
                    Single Supplement
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="pricing.singleSupplement"
                      type="number"
                      placeholder="Enter single supplement"
                      {...register("pricing.singleSupplement", {
                        valueAsNumber: true,
                      })}
                    />
                    <InputGroupAddon align="inline-start">
                      <FontAwesomeIcon
                        className={"text-primary"}
                        icon={faMoneyBillWave}
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.pricing?.singleSupplement?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.pricing.singleSupplement.message}
                    </FieldDescription>
                  )}
                </Field>
                <div className="col-span-2 md:col-span-1">
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
                            <SelectValue placeholder="select status" />
                          </SelectTrigger>

                          <SelectContent className="bg-background">
                            <SelectGroup>
                              <SelectItem value="UPCOMING">Upcoming</SelectItem>
                              <SelectItem value="OPEN">Open</SelectItem>
                              <SelectItem value="FULL">Full</SelectItem>
                              <SelectItem value="CANCELLED">
                                Cancelled
                              </SelectItem>
                              <SelectItem value="COMPLETED">
                                Completed
                              </SelectItem>
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
                </div>
              </div>
              <div className="col-span-5 text-center">
                {isUpdate !== null && (
                  <>
                    <Button
                      type="button"
                      onClick={() => onDelete()}
                      className="bg-[var(--error)] hover:bg-[var(--error)] cursor-pointer mx-2"
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onCancel()}
                      className="bg-secondary hover:bg-secondary cursor-pointer mx-2"
                    >
                      <FontAwesomeIcon icon={faArrowRotateLeft} />
                      Cancel
                    </Button>
                  </>
                )}
                <Button
                  type="button"
                  onClick={() => onSubmit()}
                  className="bg-primary cursor-pointer mx-2"
                >
                  {isUpdate !== null ? (
                    <FontAwesomeIcon icon={faArrowsRotate} />
                  ) : (
                    <FontAwesomeIcon icon={faPlus} />
                  )}
                  {isUpdate !== null ? "Update Schedule" : "Add Schedule"}
                </Button>
              </div>
            </div>
            <Card defaultValue="preview" className="mt-2">
              <CardHeader className="p-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Schedules</span>
                  <span>
                    Currency: {getTourValues("pricing.currency") || "VND"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {tourErrors?.schedules?.message && (
                  <FieldDescription className="text-red-500 text-center mt-1 ml-1">
                    {tourErrors.schedules.message}
                  </FieldDescription>
                )}
                <div className="p-2 col-span-5 rounded-lg mt-2 overflow-auto max-h-100 max-w-[100%] border border-muted shadow">
                  <ScheduleTable
                    tourId={tourId}
                    setValue={setValue}
                    isView={false}
                  />
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default TourScheduleUpdateTab;
