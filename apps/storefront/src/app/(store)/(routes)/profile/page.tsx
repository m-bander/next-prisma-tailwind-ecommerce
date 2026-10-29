'use client'

import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { useUserContext } from '@/state/User'
import { Heart, ListOrdered, Mail, MapPin, Package, Phone, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function ProfilePage() {
   const { authenticated } = useAuthenticated()
   const { user, loading } = useUserContext()
   const router = useRouter()

   useEffect(() => {
      if (authenticated === false) {
         router.push('/login')
      }
   }, [authenticated, router])

   if (loading || !user) {
      return (
         <div className="container mx-auto py-12 max-w-4xl text-center">
            <p className="text-muted-foreground animate-pulse">جاري تحميل بيانات الحساب...</p>
         </div>
      )
   }

   return (
      <div className="container mx-auto py-8 max-w-5xl">
         <Heading
            title="حسابي الشخصي (Profile)"
            description="إدارة معلوماتك الشخصية، العناوين، ومتابعة الطلبات السابقة"
         />
         <Separator className="my-6" />

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <Card className="md:col-span-1">
               <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                     <User className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-xl">{user.name || 'مستخدم متجر'}</CardTitle>
                  <CardDescription className="text-xs">
                     عضو في المتجر
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4 text-sm pt-2">
                  <div className="flex items-center gap-3 text-muted-foreground">
                     <Mail className="w-4 h-4 text-primary" />
                     <span className="truncate">{user.email || 'غير مسجل'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                     <Phone className="w-4 h-4 text-primary" />
                     <span>{user.phone || 'غير مسجل'}</span>
                  </div>
                  <Separator />
                  <Link href="/profile/edit" className="block">
                     <Button variant="outline" className="w-full">
                        تعديل البيانات
                     </Button>
                  </Link>
               </CardContent>
            </Card>

            {/* Quick Links and Sections */}
            <div className="md:col-span-2 space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Orders */}
                  <Card className="hover:border-primary transition">
                     <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-base flex items-center gap-2">
                              <ListOrdered className="w-5 h-5 text-primary" />
                              طلباتي
                           </CardTitle>
                           <Badge variant="secondary">مفعل</Badge>
                        </div>
                        <CardDescription className="text-xs">
                           عرض كافة الطلبات الحالية والسابقة وحالتها
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <Link href="/profile/orders">
                           <Button size="sm" className="w-full">
                              عرض الطلبات
                           </Button>
                        </Link>
                     </CardContent>
                  </Card>

                  {/* Addresses */}
                  <Card className="hover:border-primary transition">
                     <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-base flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-primary" />
                              عناوين الشحن
                           </CardTitle>
                           <Badge variant="secondary">{user.addresses?.length || 0} عنوان</Badge>
                        </div>
                        <CardDescription className="text-xs">
                           إدارة عناوين التوصيل المسجلة بحسابك
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <Link href="/profile/addresses">
                           <Button size="sm" variant="outline" className="w-full">
                              إدارة العناوين
                           </Button>
                        </Link>
                     </CardContent>
                  </Card>

                  {/* Cart */}
                  <Card className="hover:border-primary transition">
                     <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-base flex items-center gap-2">
                              <ShoppingCart className="w-5 h-5 text-primary" />
                              عربة التسوق
                           </CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                           المنتجات الجاهزة للشراء حالياً في عربتك
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <Link href="/cart">
                           <Button size="sm" variant="outline" className="w-full">
                              الذهاب للعربة
                           </Button>
                        </Link>
                     </CardContent>
                  </Card>

                  {/* Wishlist */}
                  <Card className="hover:border-primary transition">
                     <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-base flex items-center gap-2">
                              <Heart className="w-5 h-5 text-primary" />
                              قائمة الرغبات
                           </CardTitle>
                           <Badge variant="secondary">{user.wishlist?.length || 0} منتج</Badge>
                        </div>
                        <CardDescription className="text-xs">
                           المنتجات التي حفظتها لشرائها لاحقاً
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <Link href="/wishlist">
                           <Button size="sm" variant="outline" className="w-full">
                              عرض المفضلة
                           </Button>
                        </Link>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </div>
   )
}
