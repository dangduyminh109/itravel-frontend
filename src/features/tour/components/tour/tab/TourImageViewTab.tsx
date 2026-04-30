import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TourDetail } from "@/features/tour/types/tour.type";
import Link from "next/link";

const TourImageTab = ({ tour }: { tour?: TourDetail }) => {
  const imageThumnail =
    tour?.tourImages.find((image) => image.isThumbnail)?.imageUrl ||
    tour?.tourImages[0]?.imageUrl ||
    "";

  return (
    <div>
      <TabsContent value="image">
        <Card defaultValue="preview">
          <CardHeader className="p-4">
            <CardTitle>Tour Images</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground p-4 pt-0">
            <div className="grid grid-cols-5 gap-3 p-2 rounded-md border-2 border-primary">
              <div className="md:col-span-2 col-span-5">
                <Card className="relative w-full h-full rounded-xl overflow-hidden">
                  <img
                    className="h-full w-full object-cover"
                    src={imageThumnail}
                    alt="tour-image"
                  />
                </Card>
              </div>
              <div className="md:col-span-3 col-span-5 grid grid-cols-5 grid-rows-3 gap-1">
                {tour?.tourImages?.map((image, index) => (
                  <Card
                    key={index}
                    className="relative aspect-square col-span-1 row-span-1 rounded-xl overflow-hidden"
                  >
                    <img
                      src={image.imageUrl}
                      alt="tour-image"
                      className="w-full h-full object-cover"
                    />
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-between mt-2">
          <Link
            className="cursor-pointer bg-background border text-sm
                          rounded-md px-3 py-1 hover:bg-accent"
            href="/admin/tour"
          >
            Back
          </Link>
          <Link
            className="cursor-pointer bg-primary text-background rounded-md px-3 py-1"
            href={`/admin/tour/${tour?.id}/edit`}
          >
            Update Tour
          </Link>
        </div>
      </TabsContent>
    </div>
  );
};

export default TourImageTab;
