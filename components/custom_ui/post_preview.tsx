"use client";

import MarkdownPreview from "@uiw/react-markdown-preview";

export default function PostView({ source }: { source: string }) {
  return <MarkdownPreview source={source} className="p-10 my-5 rounded-lg" />;
}
