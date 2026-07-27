"use client";
import { useCart } from "@/hooks/cart/useCart";
import { computeCartDisplayLogic } from "@/lib/cart/utils";
import React, { useEffect, useState } from "react";
import CartSheet from "./cart-sheet";
import CartDropDown from "./cart-drop-down";
import type { Cart } from "@/types";
import { useCartVisibility } from "@/app/context/cartContext";
import { useParams } from "next/navigation";

export default function Cart() {
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const { isOpen, openCart, closeCart } = useCartVisibility();
  const { restaurantId } = useParams<{ restaurantId?: string }>();
  const { carts, isLoading, cartError, targetCart,mutateCart } = useCart(restaurantId);
  const { displayMode, sheetCart, cartCount } = computeCartDisplayLogic(
    carts,
    selectedCart,
    targetCart,
  );

  useEffect(() => {
    if (!carts || !selectedCart) return;
    const updatedCart = carts.find((cart) => cart.id === selectedCart.id) ?? null;
    setSelectedCart(updatedCart);
  }, [carts]);

  useEffect(() => {
    if (isOpen) return;
    setTimeout(() => setSelectedCart(null), 200);
  }, [isOpen]);

  if (cartError) {
    return <div>Error: {cartError.message}</div>;
  }
  if (isLoading || !carts) {
    return <div>...Loading</div>;
  }

  return displayMode === "cartSheet" ? (
    <CartSheet
      cart={sheetCart}
      count={cartCount}
      isOpen={isOpen}
      openCart={openCart}
      closeCart={closeCart}
      mutateCart={mutateCart}
    />
  ) : (
    <CartDropDown
      carts={carts}
      setSelectedCart={setSelectedCart}
      openCart={openCart}
    />
  );
}
