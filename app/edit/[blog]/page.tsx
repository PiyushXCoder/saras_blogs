"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "@/auth";
import { stringify } from "querystring";

const MarkdownEditor = dynamic(() => import("@uiw/react-markdown-editor"), {
  ssr: false,
});

export default function Home({
  params: { blog },
}: {
  params: { blog: string };
}) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [isPermited, setIsPermited] = useState(true);
  const session = useSession();

  useEffect(() => {
    fetch("/api/data/post?id=" + encodeURI(blog)).then(async (res) => {
      if (res.status == 200) {
        const { data, author_email }: { data: string; author_email: string } =
          await res.json();
        if (session.data?.user?.email != author_email) {
          setIsPermited(false);
          return;
        }
        setMarkdown(data);
      }
    });
  }, []);

  if (!isPermited) {
    return <div>Not Found</div>;
  }

  if (!markdown) return <div></div>;

  const saveAsUnpublished = () => {
    fetch(
      "/api/data/post?" +
        new URLSearchParams({ id: blog, is_published: "false" }),
      {
        method: "PUT",
        body: markdown,
      },
    )
      .then(async (res) => {
        if (res.status == 200) alert("Saved");
        else alert(await res.text());
      })
      .catch((err) => {
        alert("Failed to save");
        console.log(err);
      });
  };

  const saveAsPublished = () => {
    fetch(
      "/api/data/post?" +
        new URLSearchParams({ id: blog, is_published: "true" }),
      {
        method: "PUT",
        body: markdown,
      },
    )
      .then(async (res) => {
        if (res.status == 200) alert("Saved");
        else alert(await res.text());
      })
      .catch((err) => {
        alert("Failed to save");
        console.log(err);
      });
  };

  const Delete = () => {};

  return (
    <main className="w-full flex flex-col items-center">
      <div className="max-w-[70rem] w-full">
        <div className="flex flex-row overflow-scroll gap-2 my-4">
          <Button onClick={saveAsUnpublished}>Save as Unpublished</Button>
          <Button onClick={saveAsPublished}>Publish</Button>
          <Button>Edit Metadata</Button>
          <Button>Delete</Button>
        </div>
        <MarkdownEditor
          value={markdown}
          height="30rem"
          visible={true}
          onChange={(value, _viewUpdate) => setMarkdown(value)}
        />
      </div>
    </main>
  );
}
