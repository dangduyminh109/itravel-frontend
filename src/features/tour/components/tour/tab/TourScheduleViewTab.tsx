"use client";
import { faChair, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import ScheduleTable from "../table/ScheduleTable";
import { ScheduleData } from "@/features/tour/types/tourData.type";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TourScheduleViewTab = ({ tourId }: { tourId: string }) => {
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  function setValue(data: ScheduleData) {
    setSchedule({
      ...data,
      departureDate: new Date(data.departureDate),
    });
  }

  const time = schedule?.departureDate
    ? `${schedule.departureDate.getHours().toString().padStart(2, "0")}:${schedule.departureDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    : "00:00";

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
                <Calendar
                  mode="single"
                  selected={schedule?.departureDate}
                  className="rounded-lg border w-full mb-2"
                  captionLayout="dropdown"
                />
                <Input type="time" value={time} readOnly />
              </div>
              <div className="md:col-span-3 col-span-5 grid grid-cols-2 gap-1">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total seats
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faChair}
                    />
                    {schedule?.totalSeats || 0}
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Surcharge
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faMoneyBillWave}
                    />
                    {schedule?.surcharge || 0}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Adult Original Price
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faMoneyBillWave}
                    />
                    {schedule?.pricing?.adultPrice?.originalPrice || 0}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Adult Discount Price
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faMoneyBillWave}
                    />
                    {schedule?.pricing?.adultPrice?.discountPrice || 0}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Child Original Price
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faMoneyBillWave}
                    />
                    {schedule?.pricing?.childPrice?.originalPrice || 0}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Child Discount Price
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faMoneyBillWave}
                    />
                    {schedule?.pricing?.childPrice?.discountPrice || 0}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Infant Original Price
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faMoneyBillWave}
                    />
                    {schedule?.pricing?.infantPrice?.originalPrice || 0}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Infant Discount Price
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faMoneyBillWave}
                    />
                    {schedule?.pricing?.infantPrice?.discountPrice || 0}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Single Supplement
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faMoneyBillWave}
                    />
                    {schedule?.pricing?.singleSupplement || 0}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1">
                    <Badge>{schedule?.status}</Badge>
                  </div>
                </div>
              </div>
            </div>
            <Card defaultValue="preview" className="mt-2">
              <CardHeader className="p-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Schedules</span>
                  <span>Currency: {"VND"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="p-2 col-span-5 rounded-lg mt-2 overflow-auto max-h-100 max-w-[100%] border border-muted shadow">
                  <ScheduleTable
                    tourId={tourId}
                    setValue={setValue}
                    isView={true}
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

export default TourScheduleViewTab;
