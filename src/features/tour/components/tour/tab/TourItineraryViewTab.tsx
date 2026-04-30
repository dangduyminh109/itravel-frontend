import {
  faMapLocation,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { TourDetail } from "@/features/tour/types/tour.type";

const TourItineraryViewTab = ({ tour }: { tour?: TourDetail }) => {
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
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Duration Days
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon className={"text-primary"} icon={faSun} />
                    {tour?.durationDays}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Duration Nights
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon className={"text-primary"} icon={faMoon} />
                    {tour?.durationNights}
                  </div>
                </div>
              </div>
              <div className="col-span-5">
                <div className="flex items-center justify-between mb-2">
                  <h2>Itineraries</h2>
                </div>
                {tour?.itineraries.map((item: any, index: number) => {
                  return (
                    <Card className="mt-2" key={index}>
                      <CardHeader
                        className="min-h-15 p-4 flex flex-row items-center justify-between 
                        bg-primary rounded-md overflow-hidden"
                      >
                        <CardTitle className="font-bold text-white">
                          Day {item.dayNumber}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="desc h-80 p-0 transition-all duration-300 overflow-auto">
                        <div className="p-4 pt-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Title
                            </p>
                            <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                              <FontAwesomeIcon
                                className={"text-primary"}
                                icon={faMapLocation}
                              />
                              {item.title}
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="rounded-lg mt-2 overflow-auto max-h-100 max-w-[100%] border border-muted shadow">
                              <Table>
                                <TableHeader className="bg-foreground [&_tr:hover]:bg-foreground [&_th]:!text-background [&_th]:!whitespace-nowrap">
                                  <TableRow>
                                    <TableHead>
                                      <div className="flex items-center justify-between">
                                        <span>Activities</span>
                                      </div>
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-medium align-top">
                                      {item?.activities?.map(
                                        (
                                          activity: string,
                                          itemIndex: number,
                                        ) => (
                                          <div
                                            className="w-full relative my-4"
                                            key={`${index}-${itemIndex}`}
                                          >
                                            <div
                                              className="w-full relative my-4"
                                              key={index}
                                            >
                                              <div className="shadow-sm p-3 border rounded-md mt-1 min-h-[120px] whitespace-pre-wrap text-sm relative">
                                                {activity}
                                              </div>
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-muted-foreground">
                              Description
                            </p>
                            <div className="shadow-sm p-3 border rounded-md mt-1 min-h-[120px] whitespace-pre-wrap text-sm relative">
                              {item?.description || ""}
                            </div>
                          </div>
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

export default TourItineraryViewTab;
