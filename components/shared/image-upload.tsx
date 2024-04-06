"use client";

import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

import { CldImage, CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { dataUrl, getImageSize } from "@/lib/utils";

interface ImageUploadProps {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
}

export default function ImageUpload({
  onValueChange,
  setImage,
  publicId,
  image,
  type,
}: ImageUploadProps) {
  const { toast } = useToast();

  const handleUploadSuccess = (result: any) => {
    setImage((prev: any) => {
      return {
        ...prev,
        publicId: result?.info?.public_id,
        width: result?.info?.width,
        height: result?.info?.height,
        secureURL: result?.info?.secure_url,
      };
    });

    onValueChange(result.info.public_id);

    toast({
      title: "Image uploaded successfully",
      description: "1 credit was deducted.",
    });
  };

  const handleUploadError = () => {
    toast({
      title: "Error",
      variant: "destructive",
      description: "Something went wrong. Please try again.",
    });
  };

  return (
    <div className="space-y-2">
      {publicId && (
        <div>
          <CldImage
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            src={publicId}
            sizes={"(max-width: 767px) 100vw, 50vw"}
            alt="image"
            placeholder={dataUrl as PlaceholderValue}
            className="image-container"
          />
        </div>
      )}
      <CldUploadWidget
        uploadPreset="image_cropper"
        options={{
          multiple: false,
          resourceType: "image",
        }}
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
      >
        {({ open }) => {
          return (
            <div
              className={
                publicId
                  ? ""
                  : "image-container flex items-center justify-center"
              }
              onClick={() => open()}
            >
              <Button type="button">Choose File</Button>
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
