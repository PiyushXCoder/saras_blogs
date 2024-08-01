"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DateTime } from "luxon";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useSession } from "@/auth";

interface PostData {
  id: string;
  title: string;
  author: { email: string; name: string };
  published_at: string;
  summary: string;
}

function Post({
  post: { id, title, author, published_at, summary },
}: {
  post: PostData;
}) {
  const session = useSession();
  const relative_published = DateTime.fromISO(published_at).toRelative();
  return (
    <Card className="mx-2 my-5">
      <CardHeader>
        <CardTitle>
          <Link href={"/" + id}>{title}</Link>
        </CardTitle>
        <CardDescription>
          {author.name + " — " + relative_published}
        </CardDescription>
      </CardHeader>
      <CardContent>{summary}</CardContent>
      <CardFooter>
        {session.data?.user?.email == author.email && (
          <Link href={"/edit/" + id}>
            <Button>Edit</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

function EndOfLoaded({ more }: { more: boolean }) {
  return (
    <div>
      {more ? (
        <Skeleton className="w-[calc(100%-1rem)] h-36 mx-2 mb-5"></Skeleton>
      ) : (
        ""
      )}
    </div>
  );
}

function Posts() {
  const pageLength = 20;
  const [skip, setSkip] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [postsElements, setPostsElements] = useState<React.ReactNode[]>();

  useEffect(() => {
    fetch("/api/data/post?skip=" + skip + "&page_length=" + pageLength)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        if (data.length < pageLength) setHasMorePosts(false);
      });
  }, [skip]);

  useEffect(() => {
    let elements: React.ReactNode[] = postsElements?.slice() || [];
    posts.forEach((post, i) => {
      elements.push(<Post key={skip + i} post={post} />);
    });
    setPostsElements(elements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, skip]);

  // TODO: Scroll event to load more
  // TODO: Search box

  return (
    <div className="w-full">
      <Input
        type="search"
        className="mx-2 my-10 w-[calc(100%_-_1rem)]"
        placeholder="&#x1f50e;  Search"
      />

      {postsElements}

      <EndOfLoaded more={hasMorePosts} />
    </div>
  );
}

export { Posts };
