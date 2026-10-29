'use client'

import { Heading } from '@/components/native/heading'
import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Separator } from '@/components/native/separator'
import { Button } from '@/components/ui/button'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { Heart, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function WishlistPage() {
   const { authenticated } = useAuthenticated()
   const [products, setProducts] = useState<any[] | null>(null)
   const [loading, setLoading] = useState(true)
   const router = useRouter()

   useEffect(() => {
      async function getWishlist() {
         try {
            setLoading(true)
            const response = await fetch('/api/wishlist', { cache: 'no-store' })
            if (response.ok) {
               const data = await response.json()
               setProducts(data || [])
            } else {
               setProducts([])
            }
         } catch (error) {
            console.error(error)
            setProducts([])
         } finally {
            setLoading(false)
         }
      }

      if (authenticated === true) {
         getWishlist()
      } else if (authenticated === false) {
         setLoading(false)
      }
   }, [authenticated])

   if (authenticated === false) {
      return (
         <div className="container mx-auto py-16 text-center max-w-md">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">قائمة الرغبات (Wishlist)</h2>
            <p className="text-muted-foreground text-sm mb-6">
               يرجى تسجيل الدخول لعرض المنتجات المحفوظة في قائمة رغباتك
            </p>
            <Link href="/login">
               <Button>تسجيل الدخول</Button>
            </Link>
         </div>
      )
   }

   return (
      <div className="container mx-auto py-8">
         <Heading
            title="Wishlist"
            description="المنتجات التي قمت بحفظها في قائمة رغباتك للمستقبل"
         />
         <Separator className="my-6" />

         {loading ? (
            <ProductSkeletonGrid />
         ) : products && products.length > 0 ? (
            <ProductGrid products={products} />
         ) : (
            <div className="text-center py-16">
               <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
               <h3 className="text-lg font-medium">قائمة الرغبات فارغة</h3>
               <p className="text-sm text-muted-foreground mb-6">
                  لم تقم بإضافة أي منتجات لقائمة رغباتك بعد.
               </p>
               <Link href="/products">
                  <Button className="gap-2">
                     <ShoppingBag className="h-4 w-4" />
                     استكشف المنتجات
                  </Button>
               </Link>
            </div>
         )}
      </div>
   )
}
