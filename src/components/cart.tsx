"use client";
import { useCart } from '@/hooks/cart/useCart';
import React from 'react'

export default function Cart() {
  const { carts } = useCart();
  return (
    <div></div>
  );
}
