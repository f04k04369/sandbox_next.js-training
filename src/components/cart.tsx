"use client";
import { useCart } from "@/hooks/cart/useCart";
import { computeCartDisplayLogic } from "@/lib/cart/utils";
import React from "react";
import CartSheet from "./cart-sheet";
import CartDropDown from "./cart-drop-down";

export default function Cart() {
  const { carts } = useCart();
  const { displayMode, sheetCart, cartCount } = computeCartDisplayLogic(carts);
  return displayMode === "cartSheet" ? <CartSheet cart={sheetCart} count={cartCount}/> : <CartDropDown />;
}
