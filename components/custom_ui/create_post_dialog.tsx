"use client";

import React, { useState } from "react";
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
import { useRouter } from "next/navigation";

const CreatePostDialog = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ children }, _) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const createPost = (formData: FormData) => {
    fetch("/api/data/post?" + new URLSearchParams(formData as any), {
      method: "POST",
    })
      .then(async (data) => {
        if (data.status == 200) {
          setIsOpen(false);
          router.replace("/edit/" + formData.get("id"));
        } else alert(await data.text());
      })
      .catch((error) => console.log(error));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
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

CreatePostDialog.displayName = "CreatePostDialog";

export { CreatePostDialog };
