import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const search = searchParams.get("search");
  const skip = Number.parseInt(searchParams.get("skip") || "0");
  const pageLength = Number.parseInt(searchParams.get("page_length") || "20");
  let is_published = false;

  const session = await auth();
  if (session) {
    is_published = true;
  }

  const prisma = new PrismaClient();

  if (id != null) {
    const data = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    // TODO
  } else {
    const data = await prisma.post.findMany({
      skip,
      take: pageLength,
      where: {
        title: {
          contains: search || "",
        },
        OR: [
          {
            is_published: false,
          },
          {
            is_published,
            author_email: session?.user?.email || "",
          },
        ],
      },
    });

    return Response.json(data);
  }
}
