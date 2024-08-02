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
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
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

function EndOfLoaded({ more }: { more: Boolean }) {
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
  const pageLength = 10;
  const [skip, setSkip] = useState(0);
  const [query, setQuery] = useState("");
  const [hasMorePosts, setHasMorePosts] = useState<Boolean>(true);
  const [postsElements, setPostsElements] = useState<React.ReactNode[]>([]);
  const targetRef = useRef(null);

  useEffect(() => {
    fetch(
      "/api/data/post?" +
        new URLSearchParams({
          skip: skip.toString(),
          page_length: pageLength.toString(),
          query: query,
        }).toString(),
    )
      .then((res) => res.json())
      .then((data: PostData[]) => {
        let elements: React.ReactNode[] = postsElements?.slice() || [];
        data.forEach((post, i) => {
          elements.push(<Post key={skip + i} post={post} />);
        });
        setPostsElements(elements);

        if (data.length < pageLength) setHasMorePosts(false);
        else {
          setHasMorePosts(true);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, query]);

  useEffect(() => {
    const current = targetRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMorePosts && postsElements?.length != 0)
          setSkip(skip + pageLength);
      },
      {
        root: null, // viewport
        rootMargin: "0px", // no margin
        threshold: 0.5, // 50% of target visible
      },
    );

    if (current) {
      observer.observe(current);
    }

    // Clean up the observer
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsElements]);

  const doSearch = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = (e?.target as HTMLInputElement)?.value;

    setSkip(0);
    setHasMorePosts(false);
    setPostsElements([]);
    setQuery(value);
  };

  return (
    <div className="w-full">
      <Input
        type="search"
        className="mx-2 my-10 w-[calc(100%_-_1rem)]"
        placeholder="&#x1f50e;  Search"
        onChange={doSearch}
      />

      {postsElements}

      <div ref={targetRef}>
        <EndOfLoaded more={hasMorePosts} />
      </div>
    </div>
  );
}

export { Posts };
