import { PrismaClient } from "@prisma/client";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prisma = new PrismaClient();

  const posts = await prisma.post.findMany({});

  const pageMaps: MetadataRoute.Sitemap = [];

  posts.forEach((post) => {
    pageMaps.push({
      url: process.env.BASE_URL + "/" + post.id,
      lastModified: post.published_at,
      changeFrequency: "weekly",
    });
  });

  return pageMaps;
}
