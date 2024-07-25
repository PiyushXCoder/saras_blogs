import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import "./globals.css";
import { NavBar } from "@/components/custom_ui/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { signIn, signOut, auth } from "@/auth";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const t = await getTranslations("common");
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <NavBar banner={t("title")}>
              {session && (
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <Button className="w-full max-md:rounded-none">
                    {t("sign_out")}
                  </Button>
                </form>
              )}

              {session && (
                <Image
                  src={session?.user?.image || ""}
                  alt=""
                  width="40"
                  height="40"
                  className="rounded-xl max-md:m-3"
                />
              )}

              {!session && (
                <form
                  action={async () => {
                    "use server";
                    await signIn("");
                  }}
                >
                  <Button className="w-full max-md:rounded-none">
                    {t("sign_in")}
                  </Button>
                </form>
              )}
            </NavBar>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
