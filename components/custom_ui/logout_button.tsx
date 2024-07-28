"use client";

import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

function LogoutButton() {
  const t = useTranslations("common");
  return (
    <Button
      onClick={async () =>
        fetch("/api/auth/logout").then(() => {
          window.location.reload();
        })
      }
      className="max-md:rounded-none"
    >
      {t("sign_out")}
    </Button>
  );
}

export { LogoutButton };
