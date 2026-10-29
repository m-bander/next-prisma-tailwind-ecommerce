'use client'

import { Heading } from '@/components/native/heading'
import React from 'react'

import { CartGrid } from './components/grid'

export default function Cart() {
   return (
      <div>
         <Heading
            title="Cart"
            description="Below is a list of products you have in your cart."
         />
         <CartGrid />
      </div>
   )
}
