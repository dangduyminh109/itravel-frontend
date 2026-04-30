import { faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TourDetail } from "@/features/tour/types/tour.type";
import { Badge } from "@/components/ui/badge";

const TourDescViewTab = ({ tour }: { tour?: TourDetail }) => {
  return (
    <div>
      <TabsContent value="tourDesc">
        <Card defaultValue="preview">
          <CardHeader className="p-4">
            <CardTitle>Tour Description</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground p-4 pt-0">
            <div className="grid grid-cols-5 gap-3 p-2 rounded-md border-2 border-primary">
              <div className="col-span-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Tour Name
                </p>
                <div className="shadow-sm p-2 border rounded-md mt-1 flex items-center gap-2">
                  <FontAwesomeIcon className={"text-primary"} icon={faMap} />
                  {tour?.name}
                </div>
              </div>
              <div className="col-span-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <div className="shadow-sm p-2 border rounded-md mt-1">
                  <Badge
                    className={
                      tour?.status === "ACTIVE"
                        ? "bg-[var(--success)] hover:bg-[var(--success)]"
                        : tour?.status === "INACTIVE"
                          ? "bg-[var(--warning)] hover:bg-[var(--warning)]"
                          : "bg-muted hover:bg-muted text-primary"
                    }
                  >
                    {tour?.status}
                  </Badge>
                </div>
              </div>
              <div className="col-span-5">
                <p className="text-sm font-medium text-muted-foreground">
                  Summary
                </p>
                <div className="shadow-sm p-3 border rounded-md mt-1 min-h-[120px] whitespace-pre-wrap text-sm relative">
                  {tour?.summary || ""}
                </div>
              </div>
              <div className="col-span-5">
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
                <div className="relative shadow-sm p-3 border rounded-md mt-1 min-h-[120px] text-sm">
                  <div
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: tour?.description || "",
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default TourDescViewTab;
