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
import { DialogTriggerProps } from "@radix-ui/react-dialog";
import { Textarea } from "../ui/textarea";

interface GeneratePostContentDialogProps extends DialogTriggerProps {
  setMardown: React.Dispatch<React.SetStateAction<string>>;
}

const GeneratePostContentDialog = React.forwardRef<
  HTMLButtonElement,
  GeneratePostContentDialogProps
>(({ children, setMardown }, _) => {
  const [prompt, setPrompt] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const GeneratePostContent = async () => {
    fetch("/api/data/gen_ai?" + new URLSearchParams({ prompt }), {
      method: "GET",
    }).then(async (res) => {
      setIsThinking(true);
      if (res.status == 200) {
        const { result }: { result: string } = await res.json();
        setMardown(result);
        setIsOpen(false);
        setIsThinking(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>Create a new post</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" action={GeneratePostContent}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              What you are thinking about post
            </Label>
            <Textarea
              name="prompt"
              className="col-span-3"
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <DialogFooter>
            {isThinking && <div className="flex items-center">Thinking...</div>}
            <Button type="submit">Generate</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

GeneratePostContentDialog.displayName = "CreatePostDialog";

export { GeneratePostContentDialog };
