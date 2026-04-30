import {
  faLocationDot,
  faMaximize,
  faMinimize,
  faMoneyBillWave,
  faTableList,
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

const TourDescViewTab = ({ tour }: { tour?: TourDetail }) => {
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
                <p className="text-sm font-medium text-muted-foreground">
                  Category
                </p>
                <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                  <FontAwesomeIcon
                    className={"text-primary"}
                    icon={faTableList}
                  />
                  {tour?.categoryName}
                </div>
              </div>
              <div className="col-span-5 flex gap-3 flex-wrap">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Departure Location
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faLocationDot}
                    />
                    {tour?.departureLocationName}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Destination Location
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faLocationDot}
                    />
                    {tour?.destinationLocationName}
                  </div>
                </div>
              </div>
              <div className="col-span-5 flex gap-3 flex-wrap">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Min Participants
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faMinimize}
                    />
                    {tour?.minParticipants}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Max Participants
                  </p>
                  <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                    <FontAwesomeIcon
                      className={"text-primary"}
                      icon={faMaximize}
                    />
                    {tour?.maxParticipants}
                  </div>
                </div>
              </div>
              <div className="col-span-5">
                <h3 className="mb-1">Pricing</h3>
                <Card className="w-full p-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Currency
                    </p>
                    <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                      <FontAwesomeIcon
                        className={"text-primary"}
                        icon={faMoneyBillWave}
                      />
                      {tour?.pricing?.currency}
                    </div>
                  </div>
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
                            <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                              {tour?.pricing?.adultPrice?.originalPrice}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                              {tour?.pricing?.adultPrice?.discountPrice}
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Child</TableCell>
                          <TableCell>
                            <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                              {tour?.pricing?.childPrice?.originalPrice}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                              {tour?.pricing?.childPrice?.discountPrice}
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Infant</TableCell>
                          <TableCell>
                            <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                              {tour?.pricing?.infantPrice?.originalPrice}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                              {tour?.pricing?.infantPrice?.discountPrice}
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Single Supplement
                          </TableCell>
                          <TableCell colSpan={2}>
                            <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                              {tour?.pricing?.singleSupplement}
                            </div>
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
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex items-center justify-between">
                              <span>Exclude</span>
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium align-top">
                            {tour?.includes?.map(
                              (service: string, index: number) => (
                                <div
                                  className="w-full relative my-4"
                                  key={index}
                                >
                                  <div className="shadow-sm p-3 border rounded-md mt-1 min-h-[120px] whitespace-pre-wrap text-sm relative">
                                    {service || ""}
                                  </div>
                                </div>
                              ),
                            )}
                          </TableCell>
                          <TableCell className="font-medium align-top">
                            {tour?.excludes?.map(
                              (service: string, index: number) => (
                                <div
                                  className="w-full relative my-4"
                                  key={index}
                                >
                                  <div className="shadow-sm p-3 border rounded-md mt-1 min-h-[120px] whitespace-pre-wrap text-sm relative">
                                    {service || ""}
                                  </div>
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

export default TourDescViewTab;
