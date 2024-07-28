"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import sun from "./imgs/sun.svg";
import Image from "next/image";

const ThemeSwitcher = React.forwardRef(() => {
  const { theme, setTheme } = useTheme();

  const changeTheme = () => {
    if (theme == "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute(
        "data-color-mode",
        theme || "light",
      );
    }
  }, [theme]);

  return (
    <Button onClick={changeTheme} className="px-2">
      <Image src={sun} alt="theme" className="w-6 dark:invert" />
    </Button>
  );
});

export { ThemeSwitcher };
