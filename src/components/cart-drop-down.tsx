import { ShoppingCart } from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cart, CartItem } from "@/types";

interface CartDropDownProps {
  carts: Cart[];
}

export default function CartDropDown({ carts }: CartDropDownProps) {
  const calculateItemTotal = (item: CartItem) =>
    item.quantity * item.menus.price;

  const caluculateSubtotal = (cartItem: CartItem[]) =>
    cartItem.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    
  const caluculateTotalQuantity = (cartItem: CartItem[]) => 
    cartItem.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative cursor-pointer">
        <ShoppingCart />
        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-700 rounded-full size-4 text-xs text-primary-foreground flex items-center justify-center">
          {carts.length}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[420px]">
        {carts.map((cart) => (
          <DropdownMenuItem key={cart.id} className="flex items-center p-4 justify-between">
            <div className="flex gap-3 flex-1 min-w-0">
              <div className="w-[64px] h-[64px] relative overflow-hidden rounded-full flex-none">
                <Image
                  fill
                  src={cart.photoUrl}
                  alt={cart.restaurantName ?? "レストラン名"}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base ">{cart.restaurantName}</p>
                <p>
                  小計: ￥{caluculateSubtotal(cart.cart_items).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center size-7 font-medium rounded-full bg-primary text-popover text-xs">
              {caluculateTotalQuantity(cart.cart_items)}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
