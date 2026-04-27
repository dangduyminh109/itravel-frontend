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
import { faMap, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
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

type TourDescTabProps = {
  register: any;
  control: any;
  errors: any;
  categories: { id: number; name: string }[];
  flatLocations: { id: number; name: string; type: string; depth: number }[];
};

const TourDescTab = (props: TourDescTabProps) => {
  const { register, control, errors, categories, flatLocations } = props;

  return (
    <div>
      <TabsContent value="detail">
        <Card defaultValue="preview">
          <CardHeader className="p-4">
            <CardTitle>Tour Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground p-4 pt-0">
            <div className="grid grid-cols-5 gap-3 p-2 rounded-md border-2 border-primary">
              <div className="col-span-5">
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1 w-full">
                      <FieldLabel htmlFor="categoryId">Category</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
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
                      <Field className="gap-1 w-full">
                        <FieldLabel htmlFor="departureLocationId">
                          Departure Location
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
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
                      <Field className="gap-1 w-full">
                        <FieldLabel htmlFor="destinationLocationId">
                          Destination Location
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
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
                <Field className="gap-1 flex-1">
                  <FieldLabel htmlFor="minParticipants">
                    Min Participants
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="minParticipants"
                      type="number"
                      placeholder="Enter min participants"
                      {...register("minParticipants", { valueAsNumber: true })}
                    />
                  </InputGroup>
                  {errors.minParticipants?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.minParticipants.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field className="gap-1 flex-1">
                  <FieldLabel htmlFor="maxParticipants">
                    Max Participants
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="maxParticipants"
                      type="number"
                      placeholder="Enter max participants"
                      {...register("maxParticipants", { valueAsNumber: true })}
                    />
                  </InputGroup>
                  {errors.maxParticipants?.message && (
                    <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                      {errors.maxParticipants.message}
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
                          <TableHead>Orginal Price</TableHead>
                          <TableHead>Discount Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Adult</TableCell>
                          <TableCell>
                            <Field className="gap-1 col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.adultPrice.originalPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.adultPrice.originalPrice",
                                    { valueAsNumber: true },
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
                            <Field className="gap-1 col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.adultPrice.discountPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.adultPrice.discountPrice",
                                    { valueAsNumber: true },
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
                            </Field>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Child</TableCell>
                          <TableCell>
                            <Field className="gap-1 col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.childPrice.originalPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.childPrice.originalPrice",
                                    { valueAsNumber: true },
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
                            <Field className="gap-1 col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.childPrice.discountPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.childPrice.discountPrice",
                                    { valueAsNumber: true },
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
                            </Field>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Infant</TableCell>
                          <TableCell>
                            <Field className="gap-1 col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.infantPrice.originalPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.infantPrice.originalPrice",
                                    { valueAsNumber: true },
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
                            <Field className="gap-1 col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.infantPrice.discountPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.infantPrice.discountPrice",
                                    { valueAsNumber: true },
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
                            </Field>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Single Supplement
                          </TableCell>
                          <TableCell>
                            <Field className="gap-1 col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.singleSupplement.originalPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.singleSupplement.originalPrice",
                                    { valueAsNumber: true },
                                  )}
                                />
                                <InputGroupAddon align="inline-start">
                                  <FontAwesomeIcon
                                    className={"text-primary"}
                                    icon={faMoneyBillWave}
                                  />
                                </InputGroupAddon>
                              </InputGroup>
                              {errors?.pricing?.singleSupplement?.originalPrice
                                ?.message && (
                                <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                  {
                                    errors?.pricing?.singleSupplement
                                      ?.originalPrice?.message
                                  }
                                </FieldDescription>
                              )}
                            </Field>
                          </TableCell>
                          <TableCell>
                            <Field className="gap-1 col-span-4">
                              <InputGroup>
                                <InputGroupInput
                                  id="pricing.singleSupplement.discountPrice"
                                  type="number"
                                  placeholder="Enter price"
                                  {...register(
                                    "pricing.singleSupplement.discountPrice",
                                    { valueAsNumber: true },
                                  )}
                                />
                                <InputGroupAddon align="inline-start">
                                  <FontAwesomeIcon
                                    className={"text-primary"}
                                    icon={faMoneyBillWave}
                                  />
                                </InputGroupAddon>
                              </InputGroup>
                              {errors?.pricing?.singleSupplement?.discountPrice
                                ?.message && (
                                <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                                  {
                                    errors?.pricing?.singleSupplement
                                      ?.discountPrice?.message
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
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default TourDescTab;
