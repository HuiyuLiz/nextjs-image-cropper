"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { getCldImageUrl } from "next-cloudinary";
import * as z from "zod";

import { AlertModal } from "@/components/modal/alert-modal";
import ImageUpload from "@/components/shared/image-upload";
import TransformationImage from "@/components/shared/transformation-image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { aspectRatioOptions } from "@/constants/data";
import { transformationTypes } from "@/constants/data";
import { addImage } from "@/lib/actions/image.actions";
import { updateCredits } from "@/lib/actions/user.actions";
import { deepMergeObjects } from "@/lib/utils";
import type { AspectRatioKey, Transformations } from "@/types";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title must be at least 1 character" }),
  aspectRatio: z
    .string({
      required_error: "Please select an aspect ratio",
    })
    .optional(),
  publicId: z.string().min(1, { message: "Please upload an image" }),
});

type TransformationFormValues = z.infer<typeof formSchema>;

interface TransformationFormProps {
  initialData?: any | null;
  userId: string;
  type: string;
  creditBalance: number;
  config?: Transformations | null;
}

export const TransformationForm: React.FC<TransformationFormProps> = ({
  initialData,
  userId,
  type,
  creditBalance,
  config,
}) => {
  const transformationType = transformationTypes[type];
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(initialData);
  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const defaultValues = initialData
    ? initialData
    : {
        title: "",
        aspectRatio: "",
        publicId: "",
      };

  const form = useForm<TransformationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSelectFieldHandler = (
    value: string,
    onChangeField: (value: string) => void,
  ) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];

    setImage((prev: any) => {
      return {
        ...prev,
        aspectRatio: imageSize.aspectRatio,
        width: imageSize.width,
        height: imageSize.height,
      };
    });

    setNewTransformation(transformationType.config);

    return onChangeField(value);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    if (!data || !image) return;

    const transformationURL = getCldImageUrl({
      width: image?.width,
      height: image?.height,
      src: image?.publicId,
      ...transformationConfig,
    });

    const imageData = {
      title: data.title,
      publicId: image?.publicId,
      transformationType: type,
      width: image?.width,
      height: image?.height,
      config: transformationConfig,
      secureURL: image?.secureURL,
      transformationURL,
      aspectRatio: data.aspectRatio,
    };

    try {
      const newImage = await addImage({
        image: imageData,
        userId,
        path: "/",
      });

      if (newImage) {
        form.reset();
        setImage(data);
        router.push(`/image-transformations/${newImage._id}`);
      }
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  };

  const handleTransformImage = async () => {
    setIsTransforming(true);

    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig),
    );

    setNewTransformation(null);

    startTransition(async () => {
      await updateCredits(userId, -1);
    });
  };

  const onConfirm = async () => {
    router.push("/credits");
  };

  const onClose = () => {
    setOpen(false);
    router.push("/");
  };

  useEffect(() => {
    if (image && type === "removeBackground") {
      setNewTransformation(transformationType.config);
    }
  }, [image, transformationType.config, type]);

  useEffect(() => {
    if (creditBalance <= 0) {
      setOpen(true);
    }
  }, [creditBalance]);

  return (
    <>
      <AlertModal isOpen={open} onClose={onClose} onConfirm={onConfirm} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="please enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === "fill" && (
              <FormField
                control={form.control}
                name="aspectRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aspect Ratio</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        onSelectFieldHandler(value, field.onChange)
                      }
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select aspect ratio"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* @ts-ignore  */}
                        {Object.keys(aspectRatioOptions).map((ratio) => (
                          <SelectItem key={ratio} value={ratio}>
                            {aspectRatioOptions[ratio as AspectRatioKey].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="publicId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onValueChange={field.onChange}
                      setImage={setImage}
                      publicId={field.value}
                      image={image}
                      type={type}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TransformationImage
              image={image}
              isTransforming={isTransforming}
              setIsTransforming={setIsTransforming}
              transformationConfig={transformationConfig}
              type={type}
            ></TransformationImage>
          </div>

          <Button
            className="ml-auto mr-2 w-[100px]"
            type="button"
            disabled={isTransforming || newTransformation === null}
            onClick={handleTransformImage}
          >
            {isTransforming ? "Transforming" : "Transform"}
          </Button>
          <Button
            variant={"outline"}
            className="w-[100px]"
            type="submit"
            disabled={isSubmitting}
          >
            Upload
          </Button>
        </form>
      </Form>
    </>
  );
};
