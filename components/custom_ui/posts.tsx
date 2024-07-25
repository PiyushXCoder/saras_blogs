import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DateTime } from "luxon";
import Image from "next/image";

interface PostData {
  title: string;
  author: string;
  published: Date;
  summary: string;
  thumbnail: string | null;
}

function Post({ title, author, published, summary, thumbnail }: PostData) {
  const relative_published = DateTime.fromISO(
    published.toISOString(),
  ).toRelative();
  return (
    <Card className="mx-2 my-5">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {"@" + author + " — " + relative_published}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {thumbnail !== null && <Image alt={thumbnail} src={thumbnail} />}
        {summary}
      </CardContent>
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
  const hasMorePosts = true;
  const posts: PostData[] = [
    {
      title: "Weekly News",
      author: "Piyush",
      published: new Date(),
      summary: "The Summary",
      thumbnail: null,
    },
    {
      title: "Weekly News",
      author: "Piyush",
      published: new Date(),
      summary: "The Summary",
      thumbnail: null,
    },
    {
      title: "Weekly News",
      author: "Piyush",
      published: new Date(),
      summary: "The Summary",
      thumbnail: null,
    },
    {
      title: "Weekly News",
      author: "Piyush",
      published: new Date(),
      summary: "The Summary",
      thumbnail: null,
    },
  ];
  const posts_elements: React.ReactNode[] = [];

  posts.forEach((post, i) => {
    posts_elements.push(
      <Post
        key={i}
        title={post.title}
        author={post.author}
        published={post.published}
        summary={post.summary}
        thumbnail={post.thumbnail}
      />,
    );
  });

  return (
    <div className="w-full">
      <Input
        type="search"
        className="mx-2 my-10 w-[calc(100%_-_1rem)]"
        placeholder="&#x1f50e;  Search"
      />

      {posts_elements}

      <EndOfLoaded more={hasMorePosts} />
    </div>
  );
}

export { Posts };
