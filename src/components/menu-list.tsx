"use client"
import { Menu } from '@/types'
import React from 'react'
import MenuCard from './menu-card';
import Link from 'next/link';
import { useModal } from '@/app/context/modalContext';

interface MenuListProps {
    menus: Menu[];
    restaurantId: string;
}

export default function MenuList({menus, restaurantId}: MenuListProps) {
  const { openModal } = useModal();
  return (
      
    <ul className='grid grid-cols-6 gap-4'>
        {menus.map((menu) => (
            <Link key={menu.id} href={`/restaurant/${restaurantId}`}>
            <MenuCard key={menu.id} menu={menu} onClick={openModal} />
          </Link>
  
        ))}
    </ul>
  )
}
