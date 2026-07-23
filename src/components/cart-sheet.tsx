import { Cart, CartItem } from "@/types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Divide, ShoppingCart, Trash2 } from "lucide-react";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface CartSheetProps {
  cart: Cart | null;
  count: number;
}

export default function CartSheet({ cart, count }: CartSheetProps) {
  const calculateItemTotal = (item: CartItem) =>
    item.quantity * item.menus.price;
    
  const caluculateSubtotal = (cartItem: CartItem[]) => cartItem.reduce((sum,item) => sum + calculateItemTotal(item), 0);

  return (
    <Sheet>
      <SheetTrigger className="relative cursor-pointer">
        <ShoppingCart />
        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-700 rounded-full size-4 text-xs text-primary-foreground flex items-center justify-center">
          {count}
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
          <>
            <div className="flex items-center justify-between">
              <Link
                className="font-bold text-2xl"
                href={`/restaurant/${cart.restaurant_id}`}
              >
                {cart.restaurantName}
              </Link>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="red" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>ゴミ箱を空にする</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* メニューエリア */}
            <ul className="flex-1 overflow-y-auto">
              {cart.cart_items.map((item) => (
                <li className="border-b py-5" key={item.id}>
                  <div className="flex items-center justify-between">
                    <p>{item.menus.name}</p>
                    <div className="relative w-[72px] h-[72px]">
                      <Image
                        src={item.menus.photoUrl}
                        alt={item.menus.name}
                        fill
                        sizes="72px"
                        className="object-cover rounded"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="quantity" className="sr-only">
                      数量
                    </label>
                    <select
                      id="quantity"
                      name="quantity"
                      value={item.quantity}
                      onChange={() => {}}
                      className="border rounded-full pr-8 pl-4 bg-muted h-9"
                    >
                      <option value="0">削除する</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <p>￥{calculateItemTotal(item).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center font-bold text-xl">
              <div>小計</div>
              <div>{caluculateSubtotal(cart.cart_items).toLocaleString()}</div>
            </div>
            <SheetClose asChild>
              <Button asChild>
                <Link href={`/checkout/${cart.restaurant_id}`}>
                  お会計に進む
                </Link>
              </Button>
            </SheetClose>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Image
              src="/images/trolley.png"
              width={192}
              height={192}
              alt="カート"
            />
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
