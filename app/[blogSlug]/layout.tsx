import { genMetadata } from "@/helpers/metadata";
import { Metadata } from "next";

export async function generateMetadata({
  params: { blogSlug: blogSlug },
}: {
  params: { blogSlug: string };
}): Promise<Metadata> {
  try {
    const res = await fetch(
      process.env.BASE_URL +
        "/api/data/post?" +
        new URLSearchParams({ slug: blogSlug }),
    );
    if (res.status == 200) {
      const data: { title: string; summary: string | null } = await res.json();
      return genMetadata({
        title: data.title,
        description: data.summary,
      });
    }
  } catch (e) {
    console.log(e);
  }
  return await genMetadata();
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
