"use client";
import {
  faArrowUpFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/dist/client/components/navigation";
import { toast } from "sonner";

type TourImageTabProps = {
  isLoading: boolean;
  tourImage: {
    thumbnailImage: File | null;
    imageList: File[];
  };
  setTourImage: React.Dispatch<
    React.SetStateAction<{
      thumbnailImage: File | null;
      imageList: File[];
    }>
  >;
};

const TourImageTab = (props: TourImageTabProps) => {
  const { isLoading, tourImage, setTourImage } = props;
  const router = useRouter();
  const imagesRef = useRef<HTMLInputElement>(null);
  function handleChangeThumbnailImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setTourImage((prev) => ({
        ...prev,
        thumbnailImage: file,
      }));
    }
  }

  function handleChangeTourImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (files) {
      if (files.length + tourImage.imageList.length > 15) {
        toast.error("You can only upload up to 15 images");
        e.target.value = "";
        return;
      }

      const fileArray = Array.from(files);
      setTourImage((prev) => ({
        ...prev,
        imageList: [...prev.imageList, ...fileArray],
      }));
    }
    e.target.value = "";
  }

  function handleRemoveImage(index: number) {
    setTourImage((prev) => {
      const newImageList = [...prev.imageList];
      newImageList.splice(index, 1);
      return {
        ...prev,
        imageList: newImageList,
      };
    });
  }

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
                <input
                  type="file"
                  hidden
                  id="thumbnailImage"
                  onChange={handleChangeThumbnailImage}
                />
                {tourImage.thumbnailImage ? (
                  <Card className="relative w-full h-full rounded-xl overflow-hidden">
                    <Button
                      className="rounded-full cursor-pointer md:h-6 md:w-6 h-4 w-4
                      absolute md:top-2 md:right-2 top-1 right-1 z-10"
                      size={"sm"}
                      variant={"destructive"}
                      type="button"
                      onClick={() =>
                        setTourImage((prev) => ({
                          ...prev,
                          thumbnailImage: null,
                        }))
                      }
                    >
                      <FontAwesomeIcon size="sm" icon={faXmark} />
                    </Button>
                    <img
                      className="h-full w-full object-cover"
                      src={URL.createObjectURL(tourImage.thumbnailImage)}
                      alt="tour-image"
                    />
                  </Card>
                ) : (
                  <label
                    htmlFor="thumbnailImage"
                    className="cursor-pointer inline-flex flex-col items-center justify-center
                    gap-2 px-3 py-2 text-primary h-full w-full min-h-40
                    rounded-md border border-primary border-dashed"
                  >
                    <FontAwesomeIcon size="2xl" icon={faArrowUpFromBracket} />
                    Upload Thumbnail
                  </label>
                )}
              </div>
              <div className="md:col-span-3 col-span-5 grid grid-cols-5 grid-rows-3 gap-1">
                <input
                  ref={imagesRef}
                  type="file"
                  hidden
                  multiple
                  id="tourImages"
                  onChange={handleChangeTourImage}
                />
                {tourImage.imageList.length < 15 && (
                  <div className="col-span-1 row-span-1">
                    <label
                      htmlFor="tourImages"
                      className="cursor-pointer inline-flex flex-col items-center justify-center
                    text-primary w-full aspect-square text-xs
                    rounded-md border border-primary border-dashed"
                    >
                      <FontAwesomeIcon icon={faArrowUpFromBracket} />
                      Images
                    </label>
                  </div>
                )}
                {tourImage.imageList?.map((file, index) => (
                  <Card
                    key={index}
                    className="relative aspect-square col-span-1 row-span-1 rounded-xl overflow-hidden"
                  >
                    <Button
                      className="rounded-full cursor-pointer md:h-6 md:w-6 h-4 w-4
                      absolute md:top-2 md:right-2 top-1 right-1 z-10"
                      size={"sm"}
                      variant={"destructive"}
                      type="button"
                      onClick={() => {
                        handleRemoveImage(index);
                      }}
                    >
                      <FontAwesomeIcon size="sm" icon={faXmark} />
                    </Button>
                    <img
                      src={URL.createObjectURL(file)}
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
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isLoading}>
            Create Tour
          </Button>
        </div>
      </TabsContent>
    </div>
  );
};

export default TourImageTab;
