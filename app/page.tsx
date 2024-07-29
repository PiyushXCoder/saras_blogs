// import { useTranslations } from "next-intl";
import { auth } from "@/auth";
import { Posts } from "@/components/custom_ui/posts";

export default async function Home() {
  const session = await auth();

  return (
    <main className="w-full flex flex-col items-center">
      <div className="max-w-[50rem] w-full">
        <Posts userEmail={session?.user?.email || ""} />
      </div>
    </main>
  );
}
