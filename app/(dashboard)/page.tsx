import ImageCard from "@/components/shared/image-card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllImages } from "@/lib/actions/image.actions";
import { Image } from "@/lib/database/models/image.model";

export default async function Page() {
  const images: any = await getAllImages({ page: 1 });
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Heading
          title={" Image API Platform"}
          description={"Visualize Engaging Experiences"}
        />
        <Separator></Separator>
        <div className="flex items-center justify-between space-y-2">
          <div className="hidden items-center space-x-2 md:flex">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Trending </TabsTrigger>
                <TabsTrigger value="analytics" disabled>
                  Analytics
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {images?.data?.map((image: Image) => (
                <ImageCard key={image._id} image={image}></ImageCard>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
