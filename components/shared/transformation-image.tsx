"use client";

import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

import React from "react";

import { CldImage } from "next-cloudinary";

import { dataUrl, debounce, getImageSize } from "@/lib/utils";
import { Transformations } from "@/types";

interface TransformationImageProps {
  image: any;
  isTransforming: boolean;
  setIsTransforming: React.Dispatch<React.SetStateAction<boolean>>;
  transformationConfig: Transformations | null | undefined;
  type: string;
}

const TransformedImage = ({
  image,
  type,
  transformationConfig,
  isTransforming,
  setIsTransforming,
}: TransformationImageProps) => {
  return (
    <div>
      <div className="mb-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Transformed
      </div>

      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            src={image?.publicId}
            alt={image.title}
            sizes={"(max-width: 767px) 100vw, 50vw"}
            placeholder={dataUrl as PlaceholderValue}
            className="h-fit min-h-72 w-full rounded-[10px] border border-dashed bg-accent/20 object-cover p-2"
            onLoad={() => {
              setIsTransforming && setIsTransforming(false);
            }}
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false);
              }, 8000)();
            }}
            {...transformationConfig}
          />

          {isTransforming && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="mx-auto flex items-center">
                <svg
                  className="-ml-1 mr-3 h-5 w-5 animate-spin text-gray-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="my-5">Loading...</p>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-fit  min-h-72  w-full items-center justify-center rounded-[10px] border border-dashed bg-accent/50 object-cover p-2 lg:max-h-80">
          No transformed image available.
        </div>
      )}
    </div>
  );
};

export default TransformedImage;
