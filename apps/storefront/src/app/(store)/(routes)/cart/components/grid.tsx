'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCartContext } from '@/state/Cart'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Item } from './item'
import { Receipt } from './receipt'
import { Skeleton } from './skeleton'

export const CartGrid = () => {
   const { loading, cart } = useCartContext()
   const items = cart?.items || []

   if (loading) {
      return (
         <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
               {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} />
               ))}
            </div>
            <Receipt />
         </div>
      )
   }

   if (items.length === 0) {
      return (
         <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
               <Card>
                  <CardContent className="p-8 text-center space-y-4">
                     <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/60" />
                     <p className="text-lg font-medium">عربة التسوق فارغة حالياً</p>
                     <p className="text-sm text-muted-foreground">
                        لم تقم بإضافة أي منتجات للسلة بعد. تصفح أحدث المنتجات وأضف ما يعجبك!
                     </p>
                     <Link href="/products">
                        <Button className="mt-2">تصفح المنتجات</Button>
                     </Link>
                  </CardContent>
               </Card>
            </div>
            <Receipt />
         </div>
      )
   }

   return (
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="md:col-span-2 space-y-3">
            {items.map((cartItem: any, index: number) => (
               <Item
                  cartItem={cartItem}
                  key={cartItem.id || cartItem.productId || index}
               />
            ))}
         </div>
         <Receipt />
      </div>
   )
}
