import { Cart } from "@/types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Divide, ShoppingCart } from "lucide-react";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
interface CartSheetProps {
  cart: Cart | null;
  count: number;
}

export default function CartSheet({ cart, count }: CartSheetProps) {
  return (
    <Sheet>
      <SheetTrigger className="relative cursor-pointer">
        <ShoppingCart />
        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-700 rounded-full size-4 text-xs text-primary-foreground flex items-center justify-center">
          {"#"}
        </span>
      </SheetTrigger>

      <SheetContent className="p-6">
        <SheetHeader className="sr-only">
          <SheetTitle>カート</SheetTitle>
          <SheetDescription>
            カート内の商品を確認・編集できます。購入手続きに進むには「お会計に進む」へ。
          </SheetDescription>
        </SheetHeader>

        {cart ? (
          <div>あいてむ</div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Image src="/images/trolley.png" width={192} height={192} alt="カート" />
            <h2 className="text-xl font-bold">商品をカートに追加しよう</h2>
            <SheetClose asChild>
              <Button className="rounded-full">お買い物を開始する</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
