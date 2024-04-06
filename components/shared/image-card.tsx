"use client";

import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Link from "next/link";

import { CldImage } from "next-cloudinary";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Image } from "@/lib/database/models/image.model";
import { dataUrl } from "@/lib/utils";

type ImageProps = {
  image: Image;
};

export default function ImageCard({ image }: ImageProps) {
  return (
    <Link href={`/image-transformations/${image._id}`}>
      <Card className="w-full max-w-sm border-none shadow-md">
        <div className="aspect-w-4 aspect-h-5 relative overflow-hidden rounded-[10px]">
          <CldImage
            src={image.publicId}
            alt={image.title}
            width={image.width}
            height={image.height}
            {...image.config}
            placeholder={dataUrl as PlaceholderValue}
            className="duration-250 h-60 w-full cursor-pointer rounded-[10px] object-cover transition ease-out hover:scale-105 hover:ease-in"
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          />
        </div>
        <CardHeader className="grid gap-1 p-4">
          <CardTitle>{image.title}</CardTitle>
          <CardDescription>
            <span className="text-small">
              {image?.updatedAt instanceof Date
                ? image?.updatedAt.toISOString().split("T")[0]
                : ""}
            </span>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
