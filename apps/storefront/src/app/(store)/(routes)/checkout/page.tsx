'use client'

import { Separator } from '@/components/native/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { writeLocalCart } from '@/lib/cart'
import { useCartContext } from '@/state/Cart'
import { CheckCircle2, ChevronRight, CreditCard, Loader2, MapPin, PackageCheck, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
   const router = useRouter()
   const { authenticated } = useAuthenticated()
   const { cart, dispatchCart } = useCartContext()

   const [addresses, setAddresses] = useState<any[]>([])
   const [selectedAddressId, setSelectedAddressId] = useState<string>('')
   const [showNewAddress, setShowNewAddress] = useState<boolean>(false)
   const [loadingAddresses, setLoadingAddresses] = useState<boolean>(true)
   const [submittingOrder, setSubmittingOrder] = useState<boolean>(false)
   const [completedOrder, setCompletedOrder] = useState<any>(null)

   // New address form state
   const [newCity, setNewCity] = useState('القاهرة')
   const [newAddress, setNewAddress] = useState('')
   const [newPhone, setNewPhone] = useState('')
   const [newPostalCode, setNewPostalCode] = useState('11511')

   useEffect(() => {
      if (authenticated === false) {
         // If not authenticated, give a moment then redirect to login
         const timer = setTimeout(() => {
            router.push('/login')
         }, 1000)
         return () => clearTimeout(timer)
      }

      if (authenticated === true) {
         fetchAddresses()
      }
   }, [authenticated, router])

   async function fetchAddresses() {
      try {
         setLoadingAddresses(true)
         const res = await fetch('/api/addresses', { cache: 'no-store' })
         if (res.ok) {
            const data = await res.json()
            setAddresses(data || [])
            if (data && data.length > 0) {
               setSelectedAddressId(data[0].id)
            } else {
               setShowNewAddress(true)
            }
         }
      } catch (err) {
         console.error(err)
      } finally {
         setLoadingAddresses(false)
      }
   }

   // Calculate costs
   const items = cart?.items || []
   let totalAmount = 0
   let discountAmount = 0

   for (const item of items) {
      const price = item?.product?.price || 0
      const discount = item?.product?.discount || 0
      const count = item?.count || 1
      totalAmount += price * count
      discountAmount += discount * count
   }

   const afterDiscount = totalAmount - discountAmount
   const taxAmount = afterDiscount * 0.09
   const payableAmount = afterDiscount + taxAmount

   async function handlePlaceOrder() {
      if (items.length === 0) {
         toast.error('عربة التسوق فارغة!')
         return
      }

      try {
         setSubmittingOrder(true)

         let addressIdToUse = selectedAddressId

         // If creating new address first
         if (showNewAddress || !addressIdToUse) {
            if (!newAddress || !newCity) {
               toast.error('يرجى ملء تفاصيل العنوان ورقم الهاتف')
               setSubmittingOrder(false)
               return
            }

            const addrRes = await fetch('/api/addresses', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  city: newCity,
                  address: newAddress,
                  phone: newPhone || '+201000000000',
                  postalCode: newPostalCode || '11511',
               }),
            })

            if (addrRes.ok) {
               const savedAddr = await addrRes.json()
               addressIdToUse = savedAddr.id
            }
         }

         const orderRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               addressId: addressIdToUse,
               city: newCity,
               address: newAddress,
               phone: newPhone,
               postalCode: newPostalCode,
            }),
         })

         if (orderRes.ok) {
            const order = await orderRes.json()
            // Clear cart
            writeLocalCart({ items: [] })
            dispatchCart({ items: [] })
            setCompletedOrder(order)
            toast.success('تم تأكيد الطلب بنجاح!')
         } else {
            toast.error('تعذر إتمام الطلب، حاول مرة أخرى')
         }
      } catch (err) {
         console.error(err)
         toast.error('حدث خطأ غير متوقع أثناء إتمام الطلب')
      } finally {
         setSubmittingOrder(false)
      }
   }

   // If order was successfully completed
   if (completedOrder) {
      return (
         <div className="container mx-auto max-w-2xl py-12 px-4 text-center">
            <Card className="border-green-200 dark:border-green-900 bg-card shadow-lg">
               <CardHeader className="flex flex-col items-center gap-3 pb-4">
                  <div className="rounded-full bg-green-100 dark:bg-green-950/60 p-4 text-green-600">
                     <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <CardTitle className="text-2xl font-bold">تم تأكيد طلبك بنجاح!</CardTitle>
                  <CardDescription className="text-base">
                     رقم الطلب: <span className="font-mono font-bold text-foreground">#{completedOrder.number}</span>
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="rounded-lg bg-muted p-4 text-right space-y-2">
                     <div className="flex justify-between font-medium text-foreground">
                        <span>حالة الطلب:</span>
                        <Badge variant="secondary">قيد التجهيز (Processing)</Badge>
                     </div>
                     <div className="flex justify-between font-medium text-foreground">
                        <span>طريقة الدفع:</span>
                        <span>الدفع عند الاستلام (بدون دفع إلكتروني)</span>
                     </div>
                     <div className="flex justify-between font-medium text-foreground">
                        <span>المبلغ الإجمالي:</span>
                        <span className="font-bold text-lg text-primary">${completedOrder.payable?.toFixed(2)}</span>
                     </div>
                  </div>
                  <p className="text-xs">
                     تم تسجيل طلبك وحفظه في حسابك بنجاح، يمكنك متابعة تفاصيل الطلب عبر صفحة طلباتي.
                  </p>
               </CardContent>
               <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link href="/profile/orders" className="w-full sm:w-auto">
                     <Button className="w-full gap-2">
                        <PackageCheck className="h-4 w-4" />
                        عرض طلباتي
                     </Button>
                  </Link>
                  <Link href="/products" className="w-full sm:w-auto">
                     <Button variant="outline" className="w-full gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        متابعة التسوق
                     </Button>
                  </Link>
               </CardFooter>
            </Card>
         </div>
      )
   }

   if (authenticated === false) {
      return (
         <div className="container mx-auto max-w-md py-16 text-center">
            <Card>
               <CardHeader>
                  <CardTitle>تسجيل الدخول مطلوب</CardTitle>
                  <CardDescription>يرجى تسجيل الدخول أولاً لتتمكن من إتمام الطلب</CardDescription>
               </CardHeader>
               <CardFooter>
                  <Link href="/login" className="w-full">
                     <Button className="w-full">الانتقال لتسجيل الدخول</Button>
                  </Link>
               </CardFooter>
            </Card>
         </div>
      )
   }

   return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
         <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">إتمام الطلب (Checkout)</h1>
            <p className="text-sm text-muted-foreground">راجع بيانات الشحن وأكد طلبك بسهولة وسرعة</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 columns: Shipping Address & Payment Selection */}
            <div className="lg:col-span-2 space-y-6">
               {/* 1. Shipping Address */}
               <Card>
                  <CardHeader className="pb-3">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <MapPin className="h-5 w-5 text-primary" />
                           <CardTitle className="text-lg">عنوان التوصيل</CardTitle>
                        </div>
                        {addresses.length > 0 && (
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowNewAddress(!showNewAddress)}
                           >
                              {showNewAddress ? 'استخدام عنوان مسجل' : '+ إضافة عنوان جديد'}
                           </Button>
                        )}
                     </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {!showNewAddress && addresses.length > 0 ? (
                        <div className="grid gap-3">
                           {addresses.map((addr) => (
                              <label
                                 key={addr.id}
                                 className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                                    selectedAddressId === addr.id
                                       ? 'border-primary bg-primary/5'
                                       : 'hover:border-foreground/30'
                                 }`}
                              >
                                 <input
                                    type="radio"
                                    name="address"
                                    checked={selectedAddressId === addr.id}
                                    onChange={() => setSelectedAddressId(addr.id)}
                                    className="mt-1"
                                 />
                                 <div className="text-sm space-y-1">
                                    <div className="font-medium text-foreground">
                                       {addr.city} - {addr.address}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                       الهاتف: {addr.phone} | الرمز البريدي: {addr.postalCode}
                                    </div>
                                 </div>
                              </label>
                           ))}
                        </div>
                     ) : (
                        <div className="grid gap-3 pt-2">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                 <Label htmlFor="city">المدينة / المحافظة</Label>
                                 <Input
                                    id="city"
                                    value={newCity}
                                    onChange={(e) => setNewCity(e.target.value)}
                                    placeholder="مثال: القاهرة"
                                    required
                                 />
                              </div>
                              <div className="space-y-1">
                                 <Label htmlFor="phone">رقم الهاتف للتواصل</Label>
                                 <Input
                                    id="phone"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    placeholder="+201012345678"
                                    required
                                 />
                              </div>
                           </div>
                           <div className="space-y-1">
                              <Label htmlFor="address">العنوان بالتفصيل</Label>
                              <Input
                                 id="address"
                                 value={newAddress}
                                 onChange={(e) => setNewAddress(e.target.value)}
                                 placeholder="اسم الشارع، رقم المبنى، الشقة"
                                 required
                              />
                           </div>
                           <div className="space-y-1">
                              <Label htmlFor="postal">الرمز البريدي</Label>
                              <Input
                                 id="postal"
                                 value={newPostalCode}
                                 onChange={(e) => setNewPostalCode(e.target.value)}
                                 placeholder="11511"
                              />
                           </div>
                        </div>
                     )}
                  </CardContent>
               </Card>

               {/* 2. Payment Method (Cash on delivery / Mock payment without actual gateway) */}
               <Card>
                  <CardHeader className="pb-3">
                     <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">طريقة الدفع</CardTitle>
                     </div>
                     <CardDescription>
                        بوابات الدفع الإلكتروني معطلة حالياً بناءً على طلبك - يتم تأكيد الطلب مباشرة.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     <div className="flex items-center gap-3 p-3.5 rounded-lg border border-primary bg-primary/5">
                        <input type="radio" checked readOnly className="accent-primary" />
                        <div className="flex-1">
                           <div className="font-semibold text-sm flex items-center gap-2">
                              <span>الدفع عند الاستلام (Cash on Delivery)</span>
                              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300">
                                 مفعل
                              </Badge>
                           </div>
                           <p className="text-xs text-muted-foreground mt-0.5">
                              ادفع نقداً عند استلام طلبك لباب منزلك دون الحاجة لأي بطاقة بنكية.
                           </p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 p-3.5 rounded-lg border bg-muted/40 opacity-70">
                        <input type="radio" disabled />
                        <div className="flex-1">
                           <div className="font-semibold text-sm flex items-center gap-2">
                              <span>بطاقة بنكية / فيزا وماستركارد (Online Payment)</span>
                              <Badge variant="secondary" className="text-xs">معطل حالياً</Badge>
                           </div>
                           <p className="text-xs text-muted-foreground mt-0.5">
                              تم تعطيل بوابة الدفع الإلكتروني لهذه النسخة.
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Right column: Order Summary */}
            <div className="space-y-6">
               <Card>
                  <CardHeader className="pb-3">
                     <CardTitle className="text-lg">ملخص الطلب ({items.length} منتج)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {/* Items list */}
                     <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                        {items.length === 0 ? (
                           <p className="text-sm text-muted-foreground text-center py-4">
                              لا توجد منتجات في العربة
                           </p>
                        ) : (
                           items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                 <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                                    <Image
                                       src={item?.product?.images?.[0] || 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=300&q=80'}
                                       alt={item?.product?.title || 'product'}
                                       fill
                                       className="object-cover"
                                    />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{item?.product?.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                       الكمية: {item.count} × ${((item?.product?.price || 0) - (item?.product?.discount || 0)).toFixed(2)}
                                    </p>
                                 </div>
                                 <div className="font-bold text-sm">
                                    ${(((item?.product?.price || 0) - (item?.product?.discount || 0)) * item.count).toFixed(2)}
                                 </div>
                              </div>
                           ))
                        )}
                     </div>

                     <Separator />

                     {/* Calculations */}
                     <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                           <span>المجموع الفرعي:</span>
                           <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                           <div className="flex justify-between text-emerald-600 font-medium">
                              <span>إجمالي الخصم:</span>
                              <span>-${discountAmount.toFixed(2)}</span>
                           </div>
                        )}
                        <div className="flex justify-between text-muted-foreground">
                           <span>ضريبة القيمة المضافة (9%):</span>
                           <span>${taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                           <span>تكلفة الشحن:</span>
                           <span className="text-emerald-600 font-medium">مجاناً</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-base font-bold">
                           <span>المبلغ المستحق:</span>
                           <span className="text-primary">${payableAmount.toFixed(2)}</span>
                        </div>
                     </div>
                  </CardContent>
                  <CardFooter>
                     <Button
                        className="w-full gap-2 text-base h-11"
                        disabled={items.length === 0 || submittingOrder}
                        onClick={handlePlaceOrder}
                     >
                        {submittingOrder ? (
                           <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              جاري تأكيد الطلب...
                           </>
                        ) : (
                           <>
                              <ShieldCheck className="h-5 w-5" />
                              تأكيد الطلب الآن (${payableAmount.toFixed(2)})
                           </>
                        )}
                     </Button>
                  </CardFooter>
               </Card>
            </div>
         </div>
      </div>
   )
}
