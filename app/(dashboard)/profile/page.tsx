import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import BreadCrumb from "@/components/breadcrumb";
import ImageCard from "@/components/shared/image-card";
import UserCredits from "@/components/shared/user-credits";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserAllImages } from "@/lib/actions/image.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { Image } from "@/lib/database/models/image.model";

const breadcrumbItems = [{ title: "Profile", link: "/dashboard/profile" }];
export default async function page() {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const images = await getUserAllImages({ userId: user._id });
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start space-x-4">
          <Heading
            title="Recent uploads"
            description={"Name : " + user.username}
          />
          <UserCredits></UserCredits>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {images?.data?.map((image: Image) => (
            <ImageCard key={image._id} image={image}></ImageCard>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
