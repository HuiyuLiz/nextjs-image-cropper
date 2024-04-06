import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import BreadCrumb from "@/components/breadcrumb";
import { DeleteModal } from "@/components/modal/delete-modal";
import TransformedImage from "@/components/shared/transformation-image";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { transformationTypes } from "@/constants/data";
import { getImageById } from "@/lib/actions/image.actions";
import { getImageSize } from "@/lib/utils";

export default async function Page({ params }: { params: { id: string } }) {
  const { userId } = auth();

  if (!userId) redirect("/");

  const image = await getImageById(params.id);

  const breadcrumbItems = [
    { title: "image", link: "/image-transformations/" + params.id },
  ];

  return (
    <>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
          <BreadCrumb items={breadcrumbItems} />
          <Heading
            title={image.title}
            description={`${
              transformationTypes[image.transformationType].title
            } (${image.aspectRatio ? image.aspectRatio : "1:1"}) authored by ${
              image.author.username
            }
            `}
          ></Heading>

          <div className="gap-8 md:grid md:grid-cols-3">
            <div className="flex flex-col items-start space-y-8">
              <div>
                <div className="mb-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Original
                </div>

                <Image
                  width={getImageSize(image.transformationType, image, "width")}
                  height={getImageSize(
                    image.transformationType,
                    image,
                    "height",
                  )}
                  src={image.secureURL}
                  alt="image"
                  className="image-container"
                />
              </div>

              {userId === image.author.clerkId && (
                <DeleteModal imageId={image._id}></DeleteModal>
              )}
            </div>

            <TransformedImage
              image={image}
              type={image.transformationType}
              isTransforming={false}
              transformationConfig={image.config}
            />
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
