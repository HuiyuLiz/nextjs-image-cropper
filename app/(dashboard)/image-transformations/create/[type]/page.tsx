import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import BreadCrumb from "@/components/breadcrumb";
import { TransformationForm } from "@/components/forms/transformation-form";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { transformationTypes } from "@/constants/data";
import { getUserById } from "@/lib/actions/user.actions";

export default async function Page({ params }: { params: { type: string } }) {
  const { userId } = auth();

  if (!userId) redirect("/");

  const user = await getUserById(userId);

  if (!user) redirect("/");

  const title = transformationTypes[params.type].title;
  const description = transformationTypes[params.type].subTitle as string;

  const breadcrumbItems = [
    { title, link: "/image-transformations/create/" + params.type },
  ];

  const transformation = transformationTypes[params.type];

  return (
    <>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
          <BreadCrumb items={breadcrumbItems} />
          <Heading title={title} description={description} />
          <TransformationForm
            userId={user._id}
            initialData={null}
            type={transformation.type}
            creditBalance={user.creditBalance}
          />
        </div>
      </ScrollArea>
    </>
  );
}
