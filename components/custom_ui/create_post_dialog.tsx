"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogTriggerProps } from "@radix-ui/react-dialog";
import { Textarea } from "../ui/textarea";

const CreatePostDialog = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ children }, _) => {
  const createPost = (formData: FormData) => {
    console.log("In here", formData);

    fetch("/api/data/post?" + new URLSearchParams(formData as any), {
      method: "POST",
    })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>Create a new post</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" action={createPost}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input name="title" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Slug
            </Label>
            <Input name="id" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Summary
            </Label>
            <Textarea name="summary" className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export { CreatePostDialog };
