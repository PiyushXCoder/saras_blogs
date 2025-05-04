import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";
import PostView from "@/components/custom_ui/post_preview";
import { auth } from "@/auth";
import Image from "next/image";
import { DateTime } from "luxon";

export default async function Blog({
  params: { blogSlug: blogSlug },
}: {
  params: { blogSlug: string };
}) {
  const prisma = new PrismaClient();
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: {
      slug: blogSlug || "",
    },
    include: { author: true },
  });

  if (
    !post ||
    (!post.is_published && session?.user?.email != post.author?.email)
  )
    return <div>Not found</div>;

  if (!process.env.POSTS_DIR) return <div>Error</div>;

  const data = readFileSync(
    path.join(process.env.POSTS_DIR, blogSlug + ".mdx"),
  ).toString();

  const relative_published = DateTime.fromISO(
    post.published_at.toISOString(),
  ).toRelative();

  return (
    <main className="w-full flex flex-col items-center">
      <div className="max-w-[60rem] w-full mt-6">
        <PostView source={data} />{" "}
        <div className="w-full flex flex-row items-center gap-3 mb-28">
          {" "}
          <Image
            src={post.author?.image || ""}
            alt=""
            width="60"
            height="60"
            className="rounded-xl max-md:m-3"
          />
          <div className="font-mono text-sm">
            {post.author?.name} <br /> {post.author?.email}
            <br />
            {"Published " + relative_published}
          </div>
        </div>
      </div>
    </main>
  );
}
