"use client"
import { useModal } from "@/app/context/modalContext";
import React from "react";
import CarouselContainer from "./carousel-container";
import Link from "next/link";
import MenuCard from "./menu-card";
import { Menu } from "@/types";

interface MenuClientProps {
    restaurantId: string;
    menus: Menu[];
}

export default function MenuClient({menus, restaurantId}: MenuClientProps) {
    const { openModal } = useModal();
  return (
    <CarouselContainer slideToShow={6}>
      {menus.map((menu) => (
        <Link key={menu.id} href={`/restaurant/${restaurantId}`}>
          <MenuCard key={menu.id} menu={menu} onClick={openModal} />
        </Link>
      ))}
    </CarouselContainer>
  );
}
