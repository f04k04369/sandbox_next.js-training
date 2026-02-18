import React from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import Link from 'next/link'  

export default function RestaurantCard() {
  return (
    <div className='relative'>
      <Link href={"/abc"} className='inset-0 absolute z-10'></Link>
      <div className='relative aspect-video rounded-lg overflow-hidden'>
        <Image className='object-cover' src={"/test-img.png"} fill alt="レストラン画像" sizes='(max-width: 1280px) 25vw, 280px' />
      </div>
      <div className='flex justify-between items-center'>
        <p className='font-bold'>name</p>
        <div className='z-20'>
          <Heart color='grey' strokeWidth={3} size={15} className='hover:fill-red-500 hover:stroke-0'/>
        </div>
      </div>
    </div>
  );
}
