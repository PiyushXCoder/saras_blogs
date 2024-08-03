import { PrismaClient } from "@prisma/client";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (
    typeof process.env.DATABASE_URL == "undefined" ||
    typeof process.env.BASE_URL == "undefined"
  )
    return [];

  const prisma = new PrismaClient();

  const posts = await prisma.post.findMany();

  return posts.map((post) => {
    return {
      url: process.env.BASE_URL + "/" + post.id,
      lastModified: post.published_at,
      changeFrequency: "weekly",
    };
  });
}
