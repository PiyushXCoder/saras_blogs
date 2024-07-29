"use client";

import MarkdownPreview from "@uiw/react-markdown-preview";

export default async function PostView({ source }: { source: string }) {
  return <MarkdownPreview source={source} className="p-10 rounded-lg" />;
}
