import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import "./globals.css";
import { NavBar } from "@/components/custom_ui/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { signIn, auth } from "@/auth";
import Image from "next/image";
import { CreatePostDialog } from "@/components/custom_ui/create_post_dialog";
import { Label } from "@radix-ui/react-label";
import { LogoutButton } from "@/components/custom_ui/logout_button";
import { SessionProvider } from "next-auth/react";
import { genMetadata } from "@/helpers/metadata";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return await genMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("common");
  const session = await auth();

  return (
    <html suppressHydrationWarning={true} lang={locale}>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <NavBar banner={t("title")}>
                {session && (
                  <form>
                    <CreatePostDialog>
                      <Button className="w-full max-md:rounded-none">
                        {t("create_post")}
                      </Button>
                    </CreatePostDialog>
                  </form>
                )}

                {session && <LogoutButton />}

                {session && (
                  <div className="flex row items-center">
                    <Image
                      src={session?.user?.image || ""}
                      alt=""
                      width="40"
                      height="40"
                      className="rounded-xl max-md:m-3"
                    />
                    <Label className="md:hidden">{session.user?.name}</Label>
                  </div>
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
        </SessionProvider>
      </body>
    </html>
  );
}
