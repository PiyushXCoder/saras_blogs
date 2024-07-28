"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(() => import("@uiw/react-markdown-editor"), {
  ssr: false,
});

const mdStr = `# Title of Blog \nContent of blog`;

export default function Home() {
  const [markdown, setMarkdown] = useState(mdStr);
  return (
    <main className="w-full flex flex-col items-center">
      <div className="max-w-[70rem] w-full">
        <div className="flex flex-row overflow-scroll gap-2 my-4">
          <Button className="small">Save as Draft</Button>
          <Button>Publish</Button>
          <Button>Edit Metadata</Button>
          <Button>Delete</Button>
        </div>
        <MarkdownEditor value={markdown} height="30rem" visible={true} />
      </div>
    </main>
  );
}
