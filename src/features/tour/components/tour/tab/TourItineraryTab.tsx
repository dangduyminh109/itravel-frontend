"use client";
import { Field, FieldLabel } from "@/components/ui/field";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FieldDescription } from "@/components/ui/field";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

type TourItineraryTabProps = {
  register: any;
  control: any;
  errors: any;
  duration: {
    days: number;
    nights: number;
  };
  getValues: any;
  itinerary: any;
  setValue: any;
};

const TourItineraryTab = (props: TourItineraryTabProps) => {
  const { register, errors, duration, itinerary, getValues, setValue } = props;
  function handleOpen(e: any) {
    const parent = e.currentTarget.parentElement;
    const desc = parent.querySelector(".desc");
    if (desc) {
      if (desc.classList.contains("h-80")) {
        desc.classList.remove("h-80");
        desc.classList.add("h-0");
      } else {
        desc.classList.remove("h-0");
        desc.classList.add("h-80");
      }
    }
  }

  const [itineraries, setItineraries] = useState(
    getValues("itineraries") || [],
  );

  return (
    <div>
      <TabsContent value="itinerary">
        <Card defaultValue="preview">
          <CardHeader className="p-4">
            <CardTitle>Tour Itinerary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground p-4 pt-0">
            <div className="grid grid-cols-5 gap-3 p-2 rounded-md border-2 border-primary">
              <div className="col-span-5 flex gap-3 flex-wrap">
                <Field className="gap-1 flex-1">
                  <FieldLabel htmlFor="duration.days">Duration Day</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="duration.days"
                      type="number"
                      placeholder="Enter duration in days"
                      {...register("duration.days", { valueAsNumber: true })}
                    />
                  </InputGroup>
                  {errors?.duration?.days?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.duration.days.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field className="gap-1 flex-1">
                  <FieldLabel htmlFor="duration.nights">
                    Duration Nights
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="duration.nights"
                      type="number"
                      placeholder="Enter duration in nights"
                      {...register("duration.nights", { valueAsNumber: true })}
                    />
                  </InputGroup>
                  {errors?.duration?.nights?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.duration.nights.message}
                    </FieldDescription>
                  )}
                </Field>
              </div>
              <div className="col-span-5">
                <div className="flex items-center justify-between mb-2">
                  <h2>Itineraries</h2>
                  <Button
                    type="button"
                    size={"sm"}
                    className="cursor-pointer"
                    onClick={() => {
                      const currentItineraries = itineraries || [];
                      const newItinerary = {
                        dayNumber: currentItineraries.length + 1,
                        title: "",
                        description: "",
                        activities: [""],
                      };
                      setValue("itineraries", [
                        ...currentItineraries,
                        newItinerary,
                      ]);
                      setItineraries((prev: any) => [...prev, newItinerary]);
                      if (newItinerary.dayNumber > duration.days) {
                        setValue("duration.days", newItinerary.dayNumber);
                        if (duration.nights < newItinerary.dayNumber - 1) {
                          setValue(
                            "duration.nights",
                            newItinerary.dayNumber - 1,
                          );
                        }
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Itinerary
                  </Button>
                </div>
                {itineraries.map((item: any, index: number) => {
                  return (
                    <Card className="mt-2" key={index}>
                      <CardHeader
                        className="min-h-15 p-4 flex flex-row items-center justify-between 
                        bg-primary cursor-pointer rounded-md overflow-hidden"
                        onClick={handleOpen}
                      >
                        <CardTitle className="font-bold text-white">
                          Day {item.dayNumber}
                        </CardTitle>
                        {index > 0 && (
                          <Button
                            className="rounded-full cursor-pointer h-6 w-6"
                            size={"sm"}
                            variant={"destructive"}
                            type="button"
                            onClick={() => {
                              const currentItineraries = itinerary || [];
                              const updatedItineraries =
                                currentItineraries.filter(
                                  (_: any, i: any) =>
                                    i !== currentItineraries.indexOf(item),
                                );
                              setValue("itineraries", updatedItineraries);
                              if (duration.days <= duration.nights) {
                                setValue(
                                  "duration.nights",
                                  updatedItineraries.length - 1,
                                );
                              }
                              setValue(
                                "duration.days",
                                updatedItineraries.length,
                              );
                            }}
                          >
                            <FontAwesomeIcon size="sm" icon={faXmark} />
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="desc h-80 p-0 transition-all duration-300 overflow-auto">
                        <div className="p-4 pt-2">
                          <Field className="gap-1">
                            <FieldLabel htmlFor={`itineraries.${index}.title`}>
                              Title
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id={`itineraries.${index}.title`}
                                placeholder="Enter itinerary title"
                                {...register(`itineraries.${index}.title`)}
                              />
                            </InputGroup>
                            {errors.itineraries?.[index]?.title?.message && (
                              <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                {errors.itineraries?.[index]?.title?.message}
                              </FieldDescription>
                            )}
                          </Field>
                          <div className="w-full">
                            <div className="rounded-lg mt-2 overflow-auto max-h-100 max-w-[100%] border border-muted shadow">
                              <Table>
                                <TableHeader className="bg-foreground [&_tr:hover]:bg-foreground [&_th]:!text-background [&_th]:!whitespace-nowrap">
                                  <TableRow>
                                    <TableHead>
                                      <div className="flex items-center justify-between">
                                        <span>Activities</span>
                                        <Button
                                          type="button"
                                          size="icon"
                                          onClick={() => {
                                            setValue(
                                              `itineraries.${index}.activities`,
                                              [
                                                ...getValues(
                                                  `itineraries.${index}.activities`,
                                                ),
                                                "",
                                              ],
                                            );
                                          }}
                                        >
                                          <FontAwesomeIcon icon={faPlus} />
                                        </Button>
                                      </div>
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-medium align-top">
                                      {getValues(
                                        `itineraries.${index}.activities`,
                                      ).map((_: string, itemIndex: number) => (
                                        <div
                                          className="w-full relative my-4"
                                          key={`${index}-${itemIndex}`}
                                        >
                                          <Field
                                            className="gap-1 col-span-5 relative mb-2"
                                            key={`${index}-${itemIndex}`}
                                          >
                                            <Textarea
                                              id={`itineraries.${index}.activities.${itemIndex}`}
                                              placeholder="Enter activity"
                                              className="min-h-[60px]"
                                              {...register(
                                                `itineraries.${index}.activities.${itemIndex}`,
                                              )}
                                            />
                                          </Field>
                                          {errors.itineraries?.[index]
                                            ?.activities?.[itemIndex]
                                            ?.message && (
                                            <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                              {
                                                errors.itineraries?.[index]
                                                  ?.activities?.[itemIndex]
                                                  ?.message
                                              }
                                            </FieldDescription>
                                          )}
                                          {itemIndex > 0 && (
                                            <Button
                                              className="rounded-full cursor-pointer md:h-6 md:w-6 h-4 w-4
                                                        absolute md:top-[-8px] md:right-[-8px] top-1 right-1 z-10"
                                              size={"sm"}
                                              variant={"destructive"}
                                              type="button"
                                              onClick={() => {
                                                const currentActivities =
                                                  itineraries[index]
                                                    ?.activities || [];

                                                currentActivities.splice(
                                                  itemIndex,
                                                  1,
                                                );
                                                setValue(
                                                  `itineraries.${index}.activities`,
                                                  currentActivities,
                                                );
                                                setItineraries((prev: any) => {
                                                  const updated = [...prev];
                                                  updated[index] = {
                                                    ...updated[index],
                                                    activities:
                                                      currentActivities,
                                                  };
                                                  return updated;
                                                });
                                              }}
                                            >
                                              <FontAwesomeIcon
                                                size="sm"
                                                icon={faXmark}
                                              />
                                            </Button>
                                          )}
                                        </div>
                                      ))}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                          <Field className="gap-1 mt-2">
                            <FieldLabel
                              htmlFor={`itineraries.${index}.description`}
                            >
                              Description
                            </FieldLabel>
                            <Textarea
                              id={`itineraries.${index}.description`}
                              placeholder="Enter itinerary description"
                              className="min-h-40"
                              {...register(`itineraries.${index}.description`)}
                            />
                          </Field>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default TourItineraryTab;
