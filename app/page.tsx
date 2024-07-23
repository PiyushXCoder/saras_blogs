import { useTranslations } from "next-intl";
import { Posts } from "./posts";

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center">
      <div className="max-w-[50rem] w-full">
        <Posts />
      </div>
    </main>
  );
}
