"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteImage } from "@/lib/actions/image.actions";

type DeleteModalProps = {
  imageId: string;
};

export function DeleteModal({ imageId }: DeleteModalProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent className="py-10">
        <DialogHeader>
          <DialogTitle className="mb-5">Delete your image</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this image? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex w-full items-center justify-center space-x-2 pt-5">
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>

          <Button
            type="submit"
            onClick={() =>
              startTransition(async () => {
                await deleteImage(imageId);
              })
            }
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
