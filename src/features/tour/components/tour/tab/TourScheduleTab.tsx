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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Calendar } from "@/components/ui/calendar";

type TourScheduleTabProps = {
  setValue: any;
  getValues: any;
  errors: any;
};

import { z } from "zod";
import { scheduleItemSchema } from "@/features/tour/schemas/create-tour.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type scheduleItemSchema = z.infer<typeof scheduleItemSchema>;

const TourScheduleTab = (props: TourScheduleTabProps) => {
  const {
    setValue: setTourValue,
    getValues: getTourValues,
    errors: tourErrors,
  } = props;
  const [isUpdate, setIsUpdate] = useState<number | null>(null);

  const {
    register,
    control,
    getValues,
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
            Number(getTourValues("pricing.adultPrice.discountPrice")) || 0,
        },
        childPrice: {
          originalPrice:
            Number(getTourValues("pricing.childPrice.originalPrice")) ||
            undefined,
          discountPrice:
            Number(getTourValues("pricing.childPrice.discountPrice")) || 0,
        },
        infantPrice: {
          originalPrice:
            Number(getTourValues("pricing.infantPrice.originalPrice")) ||
            undefined,
          discountPrice:
            Number(getTourValues("pricing.infantPrice.discountPrice")) || 0,
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

  const onDelete = () => {
    const updatedSchedules = [...(getTourValues("schedules") || [])];
    updatedSchedules.splice(Number(isUpdate), 1);
    setTourValue("schedules", updatedSchedules);
    setIsUpdate(null);
    reset();
  };

  const onSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      const data = getValues();
      console.log(
        "Schedule data to submit:",
        data,
        data.totalSeats < minParticipants,
        minParticipants,
      );
      if (data.totalSeats < minParticipants) {
        toast.error(
          `Total seats must be greater than or equal to minimum participants (${minParticipants})`,
        );
        return;
      }
      if (isUpdate != null) {
        const updatedSchedules = [...(getTourValues("schedules") || [])];
        updatedSchedules[isUpdate] = data;
        setTourValue("schedules", updatedSchedules);
        setIsUpdate(null);
        reset();
      } else {
        setTourValue("schedules", [
          data,
          ...(getTourValues("schedules") || []),
        ]);
        reset();
      }
    }
  };

  function handleSelectSchedule(index: number) {
    setIsUpdate(index);
    if (getTourValues("schedules")[index]) {
      reset(getTourValues("schedules")[index]);
    }
  }

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
                    const selectedDate = field.value
                      ? new Date(field.value)
                      : undefined;

                    return (
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (!date) {
                            field.onChange("");
                            return;
                          }

                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0",
                          );
                          const day = String(date.getDate()).padStart(2, "0");

                          const formatted = `${year}-${month}-${day}`;

                          field.onChange(formatted);
                        }}
                        className="rounded-lg border w-full"
                        captionLayout="dropdown"
                      />
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
              <CardHeader className="p-4">
                <CardTitle className="flex justify-between items-center">
                  <span>Schedules</span>
                  <span>
                    Currency: {getTourValues("pricing.currency") || "VND"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tourErrors?.schedules?.message && (
                  <FieldDescription className="text-red-500 text-center mt-1 ml-1">
                    {tourErrors.schedules.message}
                  </FieldDescription>
                )}
                <div className="col-span-5 rounded-lg mt-2 overflow-auto max-h-100 max-w-[100%] border border-muted shadow">
                  <Table>
                    <TableHeader className="bg-foreground [&_tr:hover]:bg-foreground [&_th]:!text-background [&_th]:!whitespace-nowrap">
                      <TableRow>
                        <TableHead>departureDate</TableHead>
                        <TableHead>Total Seats</TableHead>
                        <TableHead>Surcharge</TableHead>
                        <TableHead>Adult Price</TableHead>
                        <TableHead>Child Price</TableHead>
                        <TableHead>Infant Price</TableHead>
                        <TableHead>Single Supplement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getTourValues("schedules")?.length > 0 ? (
                        getTourValues("schedules").map(
                          (item: any, index: number) => (
                            <TableRow
                              key={index}
                              onClick={() => handleSelectSchedule(index)}
                            >
                              <TableCell>{item.departureDate}</TableCell>
                              <TableCell>{item.totalSeats}</TableCell>
                              <TableCell>{item.surcharge}</TableCell>
                              <TableCell className="p-0">
                                <Table>
                                  <TableHeader className="bg-primary [&_tr:hover]:bg-foreground [&_th]:!text-background [&_th]:!whitespace-nowrap">
                                    <TableRow>
                                      <TableHead>Original</TableHead>
                                      <TableHead>Discount</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>
                                        {
                                          item.pricing?.adultPrice
                                            ?.originalPrice
                                        }
                                      </TableCell>
                                      <TableCell>
                                        {
                                          item.pricing?.adultPrice
                                            ?.discountPrice
                                        }
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </TableCell>
                              <TableCell className="p-0">
                                <Table>
                                  <TableHeader className="bg-secondary [&_tr:hover]:bg-foreground [&_th]:!text-background [&_th]:!whitespace-nowrap">
                                    <TableRow>
                                      <TableHead>Original</TableHead>
                                      <TableHead>Discount</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>
                                        {
                                          item.pricing?.childPrice
                                            ?.originalPrice
                                        }
                                      </TableCell>
                                      <TableCell>
                                        {
                                          item.pricing?.childPrice
                                            ?.discountPrice
                                        }
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </TableCell>
                              <TableCell className="p-0">
                                <Table>
                                  <TableHeader className="bg-primary [&_tr:hover]:bg-foreground [&_th]:!text-background [&_th]:!whitespace-nowrap">
                                    <TableRow>
                                      <TableHead>Original</TableHead>
                                      <TableHead>Discount</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>
                                        {
                                          item.pricing?.infantPrice
                                            ?.originalPrice
                                        }
                                      </TableCell>
                                      <TableCell>
                                        {
                                          item.pricing?.infantPrice
                                            ?.discountPrice
                                        }
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </TableCell>
                              <TableCell className="p-0 text-center">
                                {item.pricing?.singleSupplement || 0}
                              </TableCell>
                            </TableRow>
                          ),
                        )
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">
                            No schedule data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default TourScheduleTab;
