import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { writeFileSync, readFileSync } from "fs";
import path from "path";

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

    if (!process.env.POSTS_DIR)
      return NextResponse.json({ error: "Internal" }, { status: 500 });

    return NextResponse.json({
      data: readFileSync(process.env.POSTS_DIR),
      ...data,
    });
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

    return NextResponse.json(data);
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const id = searchParams.get("id");
  const summary = searchParams.get("summary");

  if (id == null || title == null)
    return NextResponse.json(
      { error: "id or title is missing" },
      { status: 400 },
    );

  const prisma = new PrismaClient();

  const idExist =
    (await prisma.post.count({
      where: {
        id,
      },
    })) > 0;

  if (idExist)
    return NextResponse.json(
      { error: "Slug(id) already exist" },
      { status: 400 },
    );

  if (!process.env.POSTS_DIR)
    return NextResponse.json({ error: "Internal" }, { status: 500 });

  const session = await auth();

  await prisma.post.create({
    data: {
      id,
      title,
      summary: summary || "",
      author: session?.user?.name || "",
      author_email: session?.user?.email || "",
      is_published: false,
      published_at: Date(),
    },
  });

  const content =
    (await request.body?.getReader().read())?.value ||
    `# This title is not same as metadata
You can write content
> mdx is supported so
<h2>You see?</h2>`;

  writeFileSync(path.join(process.env.POSTS_DIR, id + ".mdx"), content, {
    flag: "w",
  });

  return NextResponse.json({ msg: "ok" });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const id = searchParams.get("id");
  const summary = searchParams.get("summary");
  const is_published = searchParams.get("is_published");

  if (id == null)
    return NextResponse.json({ error: "id is missing" }, { status: 400 });

  const prisma = new PrismaClient();

  const idExist =
    (await prisma.post.count({
      where: {
        id,
      },
    })) == 0;

  if (!idExist)
    return NextResponse.json(
      { error: "Slug(id) does not exist" },
      { status: 400 },
    );

  if (title) prisma.post.update({ data: { title }, where: { id } });
  if (summary) prisma.post.update({ data: { summary }, where: { id } });
  if (is_published)
    prisma.post.update({
      data: { is_published: Boolean(is_published) },
      where: { id },
    });

  if (!process.env.POSTS_DIR)
    return NextResponse.json({ error: "Internal" }, { status: 500 });

  const session = await auth();

  const post = await prisma.post.findFirst({
    where: { id },
  });

  if (post?.author_email != session?.user?.email)
    return NextResponse.json({ error: "Not permited" }, { status: 403 });

  const content = (await request.body?.getReader().read())?.value;

  if (content)
    writeFileSync(path.join(process.env.POSTS_DIR, id + ".mdx"), content, {
      flag: "w",
    });

  return NextResponse.json({ msg: "ok" });
}

/**
 * This can only update markdown. Not metadata
 */
export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id == null)
    return NextResponse.json({ error: "id is missing" }, { status: 400 });

  const prisma = new PrismaClient();

  const idExist =
    (await prisma.post.count({
      where: {
        id,
      },
    })) == 0;

  if (!idExist)
    return NextResponse.json(
      { error: "Slug(id) does not exist" },
      { status: 400 },
    );

  if (!process.env.POSTS_DIR)
    return NextResponse.json({ error: "Internal" }, { status: 500 });

  const session = await auth();

  const post = await prisma.post.findFirst({
    where: { id },
  });

  if (post?.author_email != session?.user?.email)
    return NextResponse.json({ error: "Not permited" }, { status: 403 });

  const content = (await request.body?.getReader().read())?.value;

  if (!content)
    return NextResponse.json({ error: "content is missing" }, { status: 400 });

  writeFileSync(path.join(process.env.POSTS_DIR, id + ".mdx"), content, {
    flag: "w",
  });

  return NextResponse.json({ msg: "ok" });
}
