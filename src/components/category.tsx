import React from 'react'
import Image from 'next/image';
import { CategoryType } from './categories'

interface CategoryProps {
  category: CategoryType;
}

export default function Category({category}: CategoryProps) {
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-full bg-green-200">
        <Image className="object-cover scale-75" src={category.imageUrl} fill alt={category.categoryName} sizes='(max-width: 1280px) 10vw, 97px' />
      </div>
      <div className='mt-2 text-center'>
        <p className='text-xs truncate'>{category.categoryName}</p>
      </div>
    </div>
  )
}
