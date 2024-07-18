"use client";

import React, { useState } from "react";
import { ThemeSwitcher } from "./theme_switcher";
import { Button } from "../ui/button";

const NavBar = ({
  children,
  banner,
}: Readonly<{ children: React.ReactNode; banner: string }>) => {
  const [isVisible, setVisible] = useState(false);

  return (
    <nav className="sticky w-full h-fit p-2 top-0 backdrop-blur-sm flex flex-row">
      {/* Banner */}
      <div className="flex-none px-5 flex flex-row items-center font-bold text-lg">
        {banner}
      </div>

      {/* Menu */}
      <div className="flex-1" />

      {/* Extra Buttons */}
      <div
        className={
          "flex flex-col top-0 left-0 flex-1 justify-end gap-x-2 " +
          "max-md:z-50 max-md:fixed max-md:w-full max-md:bg-background " +
          "md:px-3 md:flex-row md:items-center " +
          (isVisible ? "" : " max-md:hidden")
        }
      >
        <div className="">
          <Button
            className="py-3 float-end bg-background text-foreground m-1 md:hidden"
            onClick={() => setVisible(false)}
          >
            X
          </Button>
        </div>
        {children}
      </div>

      <ThemeSwitcher />

      <div className="block md:hidden pl-2">
        <Button onClick={() => setVisible(true)}>≡</Button>
      </div>
    </nav>
  );
};

export { NavBar };
