"use client";

import React, { useEffect, useState } from "react";
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

interface DialogTriggerPropsExt extends DialogTriggerProps {
  blogId: string;
}

const EditMetadataDialog = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerPropsExt
>(({ blogId, children }, _) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetch("/api/data/post?" + new URLSearchParams({ id: blogId })).then(
      async (res) => {
        if (res.status == 200) {
          const data: { title: string; summary: string | null } =
            await res.json();
          setTitle(data.title);
          setSummary(data.summary || "");
        }
      },
    );
  }, [setTitle, setSummary, blogId]);

  const createPost = (formData: FormData) => {
    formData.append("id", blogId);

    fetch("/api/data/post?" + new URLSearchParams(formData as any), {
      method: "PUT",
    })
      .then(async (data) => {
        if (data.status == 200) setIsOpen(false);
        else alert(await data.text());
      })
      .catch((error) => console.log(error));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Metadata</DialogTitle>
          <DialogDescription>Edit metadata of exisiting post</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" action={createPost}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input name="title" className="col-span-3" defaultValue={title} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="summary" className="text-right">
              Summary
            </Label>
            <Textarea
              name="summary"
              className="col-span-3"
              defaultValue={summary}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

EditMetadataDialog.displayName = "EditMetadataDialog";

export { EditMetadataDialog };
