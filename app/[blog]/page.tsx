import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";
import PostView from "@/components/custom_ui/post_preview";
import { auth } from "@/auth";

export default async function Blog({
  params: { blog },
}: {
  params: { blog: string };
}) {
  const prisma = new PrismaClient();
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: {
      id: blog,
    },
  });

  if (
    !post ||
    (!post.is_published && session?.user?.email != post.author_email)
  )
    return <div>Not found</div>;

  if (!process.env.POSTS_DIR) return <div>Error</div>;

  const data = readFileSync(
    path.join(process.env.POSTS_DIR, blog + ".mdx"),
  ).toString();

  return (
    <main className="w-full flex flex-col items-center">
      <div className="max-w-[60rem] w-full mt-6">
        <PostView source={data} />
      </div>
    </main>
  );
}
