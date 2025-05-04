"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "@/auth";
import { EditMetadataDialog } from "@/components/custom_ui/edit_metadata_dialog";
import { useRouter } from "next/navigation";

const MarkdownEditor = dynamic(() => import("@uiw/react-markdown-editor"), {
  ssr: false,
});

export default function Home({
  params: { blogSlug },
}: {
  params: { blogSlug: string };
}) {
  const [markdown, setMarkdown] = useState<string>("");
  const [isPostLoaded, setIsPostLoaded] = useState(true);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch(
      "/api/data/post?" + new URLSearchParams({ slug: blogSlug, body: "true" }),
    ).then(async (res) => {
      if (res.status == 200) {
        const { data, author }: { data: string; author: { email: string } } =
          await res.json();
        if (session.data?.user?.email != author.email) {
          setIsPostLoaded(false);
          return;
        }
        setMarkdown(data);
      } else setIsPostLoaded(false);
    });
  }, [blogSlug, session.data?.user?.email]);

  if (!isPostLoaded) {
    return <div>Some issue!</div>;
  }

  const saveAsUnpublished = () => {
    fetch(
      "/api/data/post?" +
        new URLSearchParams({ slug: blogSlug, is_published: "false" }),
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
        new URLSearchParams({ slug: blogSlug, is_published: "true" }),
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

  const Delete = () => {
    if (!confirm("Do you want to delete")) return;

    fetch(
      "/api/data/post?" +
        new URLSearchParams({ slug: blogSlug, is_published: "true" }),
      {
        method: "DELETE",
      },
    )
      .then(async (res) => {
        if (res.status == 200) {
          router.replace("/");
        } else alert(await res.text());
      })
      .catch((err) => {
        alert("Failed to delete");
        console.log(err);
      });
  };

  return (
    <main className="w-full flex flex-col items-center">
      <div className="max-w-[70rem] w-full">
        <div className="flex flex-row overflow-scroll gap-2 my-4">
          <Button onClick={saveAsUnpublished}>Save as Unpublished</Button>
          <Button onClick={saveAsPublished}>Publish</Button>
          <EditMetadataDialog blogSlug={blogSlug}>
            <Button>Edit Metadata</Button>
          </EditMetadataDialog>
          <Button onClick={Delete}>Delete</Button>
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
