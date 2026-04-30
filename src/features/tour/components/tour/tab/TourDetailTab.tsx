"use client";
import { Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  faMap,
  faMoneyBillWave,
  faPlus,
  faXmark,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type TourDescTabProps = {
  register: any;
  control: any;
  errors: any;
  setValue: any;
  getValues: any;
  categories: { id: number; name: string }[];
  flatLocations: { id: number; name: string; type: string; depth: number }[];
};

const TourDescTab = (props: TourDescTabProps) => {
  const {
    register,
    control,
    errors,
    setValue,
    getValues,
    categories,
    flatLocations,
  } = props;
  const [services, setServices] = useState({
    includes: getValues("services.includes") || [],
    excludes: getValues("services.excludes") || [],
  });

  return (
    <div>
      <TabsContent value="detail">
        <Card defaultValue="preview">
          <CardHeader className="p-4">
            <CardTitle>Tour Detail</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground p-4 pt-0">
            <div className="grid grid-cols-5 gap-3 p-2 rounded-md border-2 border-primary">
              <div className="col-span-5">
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Field className="w-full">
                      <FieldLabel htmlFor="categoryId">Category</FieldLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? String(field.value) : ""}
                      >
                        <SelectTrigger id="categoryId" className="w-full">
                          <SelectValue placeholder="select category" />
                        </SelectTrigger>

                        <SelectContent className="bg-background">
                          <SelectGroup>
                            {categories.length === 0 && (
                              <SelectItem value="-1" disabled>
                                No categories available
                              </SelectItem>
                            )}
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={String(category.id)}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.categoryId?.message && (
                        <p className="mt-1 text-red-500 text-xs ml-1">
                          {errors.categoryId?.message}
                        </p>
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="col-span-5 flex gap-3 flex-wrap">
                <div className="flex-1">
                  <Controller
                    name="departureLocationId"
                    control={control}
                    render={({ field }) => (
                      <Field className="w-full">
                        <FieldLabel htmlFor="departureLocationId">
                          Departure Location
                        </FieldLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value ? String(field.value) : ""}
                        >
                          <SelectTrigger
                            id="departureLocationId"
                            className="w-full"
                          >
                            <SelectValue placeholder="select departure location" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            <SelectGroup>
                              <SelectItem value="none">None</SelectItem>
                              {flatLocations.map((loc) => (
                                <SelectItem
                                  key={loc.id}
                                  value={loc.id.toString()}
                                >
                                  {"--".repeat(loc.depth)} {loc.name} (
                                  {loc.type})
                                </SelectItem>
                              ))}
                              {flatLocations.length === 0 && (
                                <div className="p-2 text-sm text-muted-foreground text-center">
                                  No results found
                                </div>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {errors.departureLocationId?.message && (
                          <p className="mt-1 text-red-500 text-xs ml-1">
                            {errors.departureLocationId?.message}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Controller
                    name="destinationLocationId"
                    control={control}
                    render={({ field }) => (
                      <Field className="w-full">
                        <FieldLabel htmlFor="destinationLocationId">
                          Destination Location
                        </FieldLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value ? String(field.value) : ""}
                        >
                          <SelectTrigger
                            id="destinationLocationId"
                            className="w-full"
                          >
                            <SelectValue placeholder="select destination location" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            <SelectGroup>
                              <SelectItem value="none">None</SelectItem>
                              {flatLocations.map((loc) => (
                                <SelectItem
                                  key={loc.id}
                                  value={loc.id.toString()}
                                >
                                  {"--".repeat(loc.depth)} {loc.name} (
                                  {loc.type})
                                </SelectItem>
                              ))}
                              {flatLocations.length === 0 && (
                                <div className="p-2 text-sm text-muted-foreground text-center">
                                  No results found
                                </div>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {errors.destinationLocationId?.message && (
                          <p className="mt-1 text-red-500 text-xs ml-1">
                            {errors.destinationLocationId?.message}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
              <div className="col-span-5 flex gap-3 flex-wrap">
                <Field className="flex-1">
                  <FieldLabel htmlFor="participantLimit.minParticipants">
                    Min Participants
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="participantLimit.minParticipants"
                      type="number"
                      placeholder="Enter min participants"
                      {...register("participantLimit.minParticipants", {
                        valueAsNumber: true,
                      })}
                    />
                  </InputGroup>
                  {errors.participantLimit?.minParticipants?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.participantLimit.minParticipants.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field className="flex-1">
                  <FieldLabel htmlFor="participantLimit.maxParticipants">
                    Max Participants
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="participantLimit.maxParticipants"
                      type="number"
                      placeholder="Enter max participants"
                      {...register("participantLimit.maxParticipants", {
                        valueAsNumber: true,
                      })}
                    />
                  </InputGroup>
                  {errors?.participantLimit?.maxParticipants?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.participantLimit.maxParticipants.message}
                    </FieldDescription>
                  )}
                  {errors?.participantLimit?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.participantLimit.message}
                    </FieldDescription>
                  )}
                </Field>
              </div>
              <div className="col-span-5">
                <h3 className="mb-1">Pricing</h3>
                <Card className="w-full p-2">
                  <Controller
                    name="pricing.currency"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        className="gap-4 flex w-full justify-center"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <div className="flex items-center gap-3 [&>*]:cursor-pointer">
                          <RadioGroupItem value="VND" id="VND" />
                          <Label htmlFor="VND">VND</Label>
                        </div>
                        <div className="flex items-center gap-3 [&>*]:cursor-pointer">
                          <RadioGroupItem value="USD" id="USD" />
                          <Label htmlFor="USD">USD</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  <div className="rounded-lg mt-2 overflow-auto max-h-100 max-w-[100%] border border-muted shadow">
                    <Table>
                      <TableHeader className="bg-foreground [&_tr:hover]:bg-foreground [&_th]:!text-background [&_th]:!whitespace-nowrap">
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Original Price</TableHead>
                          <TableHead>Discount Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Adult</TableCell>
                          <TableCell>
                            <Field className="col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.adultPrice.originalPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.adultPrice.originalPrice",
                                    {
                                      setValueAs: (v: string) =>
                                        v === "" ? undefined : Number(v),
                                    },
                                  )}
                                />
                                <InputGroupAddon align="inline-start">
                                  <FontAwesomeIcon
                                    className={"text-primary"}
                                    icon={faMoneyBillWave}
                                  />
                                </InputGroupAddon>
                              </InputGroup>
                              {errors.pricing?.adultPrice?.originalPrice
                                ?.message && (
                                <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                  {
                                    errors.pricing.adultPrice.originalPrice
                                      .message
                                  }
                                </FieldDescription>
                              )}
                            </Field>
                          </TableCell>
                          <TableCell>
                            <Field className="col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.adultPrice.discountPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.adultPrice.discountPrice",
                                    {
                                      setValueAs: (v: string) =>
                                        v === "" ? undefined : Number(v),
                                    },
                                  )}
                                />
                                <InputGroupAddon align="inline-start">
                                  <FontAwesomeIcon
                                    className={"text-primary"}
                                    icon={faMoneyBillWave}
                                  />
                                </InputGroupAddon>
                              </InputGroup>
                              {errors.pricing?.adultPrice?.discountPrice
                                ?.message && (
                                <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                  {
                                    errors.pricing.adultPrice.discountPrice
                                      .message
                                  }
                                </FieldDescription>
                              )}
                              {errors.pricing?.adultPrice?.message && (
                                <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                  {errors.pricing.adultPrice.message}
                                </FieldDescription>
                              )}
                            </Field>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Child</TableCell>
                          <TableCell>
                            <Field className="col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.childPrice.originalPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.childPrice.originalPrice",
                                    {
                                      setValueAs: (v: string) =>
                                        v === "" ? undefined : Number(v),
                                    },
                                  )}
                                />
                                <InputGroupAddon align="inline-start">
                                  <FontAwesomeIcon
                                    className={"text-primary"}
                                    icon={faMoneyBillWave}
                                  />
                                </InputGroupAddon>
                              </InputGroup>
                              {errors.pricing?.childPrice?.originalPrice
                                ?.message && (
                                <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                  {
                                    errors.pricing.childPrice.originalPrice
                                      .message
                                  }
                                </FieldDescription>
                              )}
                            </Field>
                          </TableCell>
                          <TableCell>
                            <Field className="col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.childPrice.discountPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.childPrice.discountPrice",
                                    {
                                      setValueAs: (v: string) =>
                                        v === "" ? undefined : Number(v),
                                    },
                                  )}
                                />
                                <InputGroupAddon align="inline-start">
                                  <FontAwesomeIcon
                                    className={"text-primary"}
                                    icon={faMoneyBillWave}
                                  />
                                </InputGroupAddon>
                              </InputGroup>
                              {errors.pricing?.childPrice?.discountPrice
                                ?.message && (
                                <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                  {
                                    errors.pricing.childPrice.discountPrice
                                      .message
                                  }
                                </FieldDescription>
                              )}
                              {errors.pricing?.childPrice?.message && (
                                <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                  {errors.pricing.childPrice.message}
                                </FieldDescription>
                              )}
                            </Field>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Infant</TableCell>
                          <TableCell>
                            <Field className="col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.infantPrice.originalPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.infantPrice.originalPrice",
                                    {
                                      setValueAs: (v: string) =>
                                        v === "" ? undefined : Number(v),
                                    },
                                  )}
                                />
                                <InputGroupAddon align="inline-start">
                                  <FontAwesomeIcon
                                    className={"text-primary"}
                                    icon={faMoneyBillWave}
                                  />
                                </InputGroupAddon>
                              </InputGroup>
                              {errors.pricing?.infantPrice?.originalPrice
                                ?.message && (
                                <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                  {
                                    errors.pricing.infantPrice.originalPrice
                                      .message
                                  }
                                </FieldDescription>
                              )}
                            </Field>
                          </TableCell>
                          <TableCell>
                            <Field className="col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.infantPrice.discountPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.infantPrice.discountPrice",
                                    {
                                      setValueAs: (v: string) =>
                                        v === "" ? undefined : Number(v),
                                    },
                                  )}
                                />
                                <InputGroupAddon align="inline-start">
                                  <FontAwesomeIcon
                                    className={"text-primary"}
                                    icon={faMoneyBillWave}
                                  />
                                </InputGroupAddon>
                              </InputGroup>
                              {errors.pricing?.infantPrice?.discountPrice
                                ?.message && (
                                <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                  {
                                    errors.pricing.infantPrice.discountPrice
                                      .message
                                  }
                                </FieldDescription>
                              )}
                              {errors.pricing?.infantPrice?.message && (
                                <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                  {errors.pricing.infantPrice.message}
                                </FieldDescription>
                              )}
                            </Field>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Single Supplement
                          </TableCell>
                          <TableCell colSpan={2}>
                            <Field className="col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.singleSupplement"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register("pricing.singleSupplement", {
                                    setValueAs: (v: string) =>
                                      v === "" ? undefined : Number(v),
                                  })}
                                />
                                <InputGroupAddon align="inline-start">
                                  <FontAwesomeIcon
                                    className={"text-primary"}
                                    icon={faMoneyBillWave}
                                  />
                                </InputGroupAddon>
                              </InputGroup>
                              {errors.pricing?.singleSupplement?.originalPrice
                                ?.message && (
                                <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                  {
                                    errors.pricing.singleSupplement
                                      .originalPrice.message
                                  }
                                </FieldDescription>
                              )}
                            </Field>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </div>
              <div className="col-span-5">
                <h3 className="mb-1">Service</h3>
                <Card className="w-full p-2">
                  <div className="rounded-lg mt-2 overflow-auto max-h-100 max-w-[100%] border border-muted shadow">
                    <Table>
                      <TableHeader className="bg-foreground [&_tr:hover]:bg-foreground [&_th]:!text-background [&_th]:!whitespace-nowrap">
                        <TableRow>
                          <TableHead>
                            <div className="flex items-center justify-between">
                              <span>Include</span>
                              <Button
                                type="button"
                                size="icon"
                                onClick={() => {
                                  const serviceInclude =
                                    getValues("services.includes");
                                  setServices((prev) => ({
                                    ...prev,
                                    includes: [...prev.includes, ""],
                                  }));
                                  serviceInclude.push("");
                                  setValue("services.includes", serviceInclude);
                                }}
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex items-center justify-between">
                              <span>Exclude</span>
                              <Button
                                type="button"
                                size="icon"
                                onClick={() => {
                                  const serviceExclude =
                                    getValues("services.excludes");
                                  setServices((prev) => ({
                                    ...prev,
                                    excludes: [...prev.excludes, ""],
                                  }));
                                  serviceExclude.push("");
                                  setValue("services.excludes", serviceExclude);
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
                            {services.includes.map(
                              (_: string, index: number) => (
                                <div
                                  className="w-full relative my-4"
                                  key={index}
                                >
                                  <Field
                                    className="col-span-5 relative mb-2"
                                    key={index}
                                  >
                                    <Textarea
                                      id={`services.includes.${index}`}
                                      placeholder="Enter include service"
                                      className="min-h-[60px]"
                                      {...register(
                                        `services.includes[${index}]`,
                                      )}
                                    />
                                  </Field>
                                  {errors.services?.includes?.[index]
                                    ?.message && (
                                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                      {
                                        errors.services?.includes?.[index]
                                          ?.message
                                      }
                                    </FieldDescription>
                                  )}
                                  <Button
                                    className="rounded-full cursor-pointer md:h-6 md:w-6 h-4 w-4
                                                        absolute md:top-[-8px] md:right-[-8px] top-1 right-1 z-10"
                                    size={"sm"}
                                    variant={"destructive"}
                                    type="button"
                                    onClick={() =>
                                      setServices((prev) => {
                                        const newincludes = [...prev.includes];
                                        newincludes.splice(index, 1);
                                        setValue(
                                          "services.includes",
                                          newincludes,
                                        );
                                        return {
                                          ...prev,
                                          includes: newincludes,
                                        };
                                      })
                                    }
                                  >
                                    <FontAwesomeIcon size="sm" icon={faXmark} />
                                  </Button>
                                </div>
                              ),
                            )}
                          </TableCell>
                          <TableCell className="font-medium align-top">
                            {services.excludes.map(
                              (_: string, index: number) => (
                                <div
                                  className="w-full relative my-4"
                                  key={index}
                                >
                                  <Field
                                    className="col-span-5 relative mb-2"
                                    key={index}
                                  >
                                    <Textarea
                                      id={`services.excludes.${index}`}
                                      placeholder="Enter exclude service"
                                      className="min-h-[60px]"
                                      {...register(
                                        `services.excludes[${index}]`,
                                      )}
                                    />
                                  </Field>
                                  {errors.services?.excludes?.[index]
                                    ?.message && (
                                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                      {
                                        errors.services?.excludes?.[index]
                                          ?.message
                                      }
                                    </FieldDescription>
                                  )}
                                  <Button
                                    className="rounded-full cursor-pointer md:h-6 md:w-6 h-4 w-4
                                                        absolute md:top-[-8px] md:right-[-8px] top-1 right-1 z-10"
                                    size={"sm"}
                                    variant={"destructive"}
                                    type="button"
                                    onClick={() =>
                                      setServices((prev) => {
                                        const newexcludes = [...prev.excludes];
                                        newexcludes.splice(index, 1);
                                        setValue(
                                          "services.excludes",
                                          newexcludes,
                                        );
                                        return {
                                          ...prev,
                                          excludes: newexcludes,
                                        };
                                      })
                                    }
                                  >
                                    <FontAwesomeIcon size="sm" icon={faXmark} />
                                  </Button>
                                </div>
                              ),
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default TourDescTab;
