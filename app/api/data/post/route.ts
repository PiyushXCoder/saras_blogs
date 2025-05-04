import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const query = searchParams.get("query");
  const skip = Number.parseInt(searchParams.get("skip") || "0");
  const pageLength = Number.parseInt(searchParams.get("page_length") || "20");
  const addBody = searchParams.get("body");

  const session = await auth();
  const prisma = new PrismaClient();

  if (slug != null) {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { author: true },
    });

    if (!post)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });

    if (!process.env.POSTS_DIR)
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });

    if (!post.is_published && post?.author?.email != session?.user?.email)
      return NextResponse.json({ error: "Not permited" }, { status: 403 });

    if (addBody == "true") {
      return NextResponse.json({
        data: readFileSync(
          path.join(process.env.POSTS_DIR, slug + ".mdx"),
        ).toString(),
        ...post,
      });
    } else return NextResponse.json(post);
  } else {
    let is_published = true;
    if (session) is_published = false;

    const data = await prisma.post.findMany({
      skip,
      take: pageLength,
      where: {
        title: {
          contains: query || "",
        },
        OR: [
          {
            is_published: true,
          },
          {
            is_published,
            author: { email: session?.user?.email || "" },
          },
        ],
      },
      include: { author: true },
    });

    return NextResponse.json(data);
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  let slug = searchParams.get("slug");
  const summary = searchParams.get("summary");

  if (title == null)
    return NextResponse.json(
      { error: "slug or title is missing" },
      { status: 400 },
    );

  slug =
    slug && slug.length > 0 ? slug : title.replace(/\s+/g, "-").toLowerCase();

  const prisma = new PrismaClient();

  const slugExists =
    (await prisma.post.count({
      where: {
        slug,
      },
    })) > 0;

  if (slugExists)
    return NextResponse.json({ error: "Slug already exist" }, { status: 400 });

  if (!process.env.POSTS_DIR)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });

  const session = await auth();

  let author = await prisma.author.upsert({
    where: {
      email: session?.user?.email || undefined,
    },
    update: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      image: session?.user?.image || "",
    },
    create: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      image: session?.user?.image || "",
    },
  });

  await prisma.post.create({
    data: {
      slug,
      title,
      summary: summary || "",
      author_id: author?.id,
      is_published: false,
      published_at: new Date(),
    },
  });

  const content =
    (await request.body?.getReader().read())?.value ||
    `# This title is not same as metadata
You can write content
> mdx is supported so
<h2>You see?</h2>`;

  writeFileSync(path.join(process.env.POSTS_DIR, slug + ".mdx"), content, {
    flag: "w",
  });

  return NextResponse.json({ msg: "ok", slug });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const slug = searchParams.get("slug");
  const summary = searchParams.get("summary");
  const is_published = searchParams.get("is_published");

  if (slug == null)
    return NextResponse.json({ error: "slug is missing" }, { status: 400 });

  const prisma = new PrismaClient();
  const session = await auth();

  const post = await prisma.post.findFirst({
    where: { slug },
    include: { author: true },
  });

  if (!post) return NextResponse.json({ error: "Not Found" }, { status: 404 });

  if (!process.env.POSTS_DIR)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });

  if (post?.author?.email != session?.user?.email)
    return NextResponse.json({ error: "Not permited" }, { status: 403 });

  if (title) await prisma.post.update({ data: { title }, where: { slug } });
  if (summary) await prisma.post.update({ data: { summary }, where: { slug } });
  if (is_published)
    await prisma.post.update({
      data: { is_published: is_published === "true" },
      where: { slug },
    });

  const content = (await request.body?.getReader().read())?.value;

  if (content)
    writeFileSync(path.join(process.env.POSTS_DIR, slug + ".mdx"), content, {
      flag: "w",
    });

  return NextResponse.json({ msg: "ok" });
}

/**
 * This can only update markdown. Not metadata
 */
export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug == null)
    return NextResponse.json({ error: "slug is missing" }, { status: 400 });

  const prisma = new PrismaClient();
  const session = await auth();

  const post = await prisma.post.findFirst({
    where: { slug },
    include: { author: true },
  });

  if (!post) return NextResponse.json({ error: "Not Found" }, { status: 400 });

  if (!process.env.POSTS_DIR)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });

  if (post?.author?.email != session?.user?.email)
    return NextResponse.json({ error: "Not permited" }, { status: 403 });

  const content = (await request.body?.getReader().read())?.value;

  if (!content)
    return NextResponse.json({ error: "content is missing" }, { status: 400 });

  writeFileSync(path.join(process.env.POSTS_DIR, slug + ".mdx"), content, {
    flag: "w",
  });

  return NextResponse.json({ msg: "ok" });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug == null)
    return NextResponse.json({ error: "slug is missing" }, { status: 400 });

  const prisma = new PrismaClient();
  const session = await auth();

  const post = await prisma.post.findFirst({
    where: { slug },
    include: { author: true },
  });

  if (!post) return NextResponse.json({ error: "Not Found" }, { status: 400 });

  if (!process.env.POSTS_DIR)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });

  if (post?.author?.email != session?.user?.email)
    return NextResponse.json({ error: "Not permited" }, { status: 403 });

  await prisma.post.delete({ where: { slug } });

  unlinkSync(path.join(process.env.POSTS_DIR, slug + ".mdx"));

  return NextResponse.json({ msg: "ok" });
}
