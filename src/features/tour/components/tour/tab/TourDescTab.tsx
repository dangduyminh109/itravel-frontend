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
import { faMap } from "@fortawesome/free-solid-svg-icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FieldDescription } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TourDescTabProps = {
  register: any;
  control: any;
  errors: any;
};

const TourDescTab = (props: TourDescTabProps) => {
  const { register, control, errors } = props;

  return (
    <div>
      <TabsContent value="tourDesc">
        <Card defaultValue="preview">
          <CardHeader className="p-4">
            <CardTitle>Tour Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground p-4 pt-0">
            <div className="grid grid-cols-5 gap-3 p-2 rounded-md border-2 border-primary">
              <Field className="gap-1 col-span-4">
                <FieldLabel htmlFor="name">Tour Name</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="name"
                    type="text"
                    placeholder="Enter name"
                    {...register("name")}
                  />
                  <InputGroupAddon align="inline-start">
                    <FontAwesomeIcon className={"text-primary"} icon={faMap} />
                  </InputGroupAddon>
                </InputGroup>
                {errors.name?.message && (
                  <FieldDescription className="text-red-500 text-xs mt-1 ml-1 max-w-80">
                    {errors.name.message}
                  </FieldDescription>
                )}
              </Field>
              <div className="col-span-1">
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
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                            <SelectItem value="DRAFT">Draft</SelectItem>
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

              <Field className="gap-1 col-span-5">
                <FieldLabel htmlFor="description">Summary</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Enter summary"
                  className="min-h-[120px]"
                  {...register("description")}
                />
              </Field>
              <Field className="gap-1 col-span-5">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Enter description"
                  className="min-h-[120px]"
                  {...register("description")}
                />
              </Field>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default TourDescTab;
