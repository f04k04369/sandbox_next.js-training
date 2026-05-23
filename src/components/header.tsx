import Link from "next/link";
import React, { Suspense } from "react";
import MenuSheet from "./menu-sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import PlaceSearchBar from "./place-search-bar";
import AddressModal from "./address-modal";

function Header() {
  return (
    <header className="bg-background h-16 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center  h-full space-x-4 px-4 max-w-[1920px] mx-auto">
        <Suspense
          fallback={
            <Button variant={"ghost"} size={"icon"} disabled>
              <Menu />
            </Button>
          }
        >
          <MenuSheet />
        </Suspense>
        <div className="font-bold">
          <Link href={"/"}>Delivery APP</Link>
        </div>
        <AddressModal />
        <div className="flex-1">
          <Suspense
            fallback={<div className="h-9 rounded-md bg-muted animate-pulse" />}
          >
            <PlaceSearchBar />
          </Suspense>
        </div>
        <div>カート</div>
      </div>
    </header>
  );
}

export default Header;
