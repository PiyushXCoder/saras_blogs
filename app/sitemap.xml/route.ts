import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(_request: Request) {
  if (
    typeof process.env.DATABASE_URL == "undefined" ||
    typeof process.env.BASE_URL == "undefined"
  )
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });

  const prisma = new PrismaClient();

  let posts = [];
  try {
    posts = await prisma.post.findMany();
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }

  let xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  posts.forEach((post) => {
    xml +=
      "<url>" +
      "<loc>" +
      process.env.BASE_URL +
      "/" +
      post.id +
      "</loc>" +
      "<lastmod>" +
      post.published_at.getDate() +
      "-" +
      post.published_at.getMonth() +
      "-" +
      post.published_at.getFullYear() +
      "</lastmod>" +
      "</url>";
  });

  xml += "</urlset>";

  const headers = new Headers();
  headers.set("Content-Type", "text/xml");
  let response = new Response(xml, { headers });

  return response;
}
