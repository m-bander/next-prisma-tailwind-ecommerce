'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Config from '@/config/site'
import { cn } from '@/lib/utils'
import { MenuIcon, ShoppingBag, ShoppingBasket, Heart, User, ListOrdered, Tag } from 'lucide-react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const mobileLinks = [
   { title: 'الرئيسية (Home)', href: '/' },
   { title: 'جميع المنتجات (All Products)', href: '/products' },
   { title: 'عربة التسوق (Cart)', href: '/cart' },
   { title: 'قائمة الرغبات (Wishlist)', href: '/wishlist' },
   { title: 'حسابي (Profile)', href: '/profile' },
   { title: 'طلباتي (My Orders)', href: '/profile/orders' },
]

const categories = [
   { title: 'الملابس الرجالية', href: '/products?category=الملابس الرجالية' },
   { title: 'الملابس النسائية', href: '/products?category=الملابس النسائية' },
   { title: 'الأحذية الرياضية', href: '/products?category=الأحذية' },
   { title: 'الساعات والإكسسوارات', href: '/products?category=الساعات والإكسسوارات' },
   { title: 'الإلكترونيات الذكية', href: '/products?category=الإلكترونيات الذكية' },
   { title: 'الحقائب والمحافظ', href: '/products?category=الحقائب والمحافظ' },
]

export function MobileNav() {
   const [open, setOpen] = useState(false)

   return (
      <Sheet open={open} onOpenChange={setOpen}>
         <SheetTrigger asChild>
            <Button
               variant="ghost"
               className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
               <MenuIcon className="h-6 w-6" />
               <span className="sr-only">Toggle Menu</span>
            </Button>
         </SheetTrigger>
         <SheetContent side="left" className="pr-0">
            <MobileLink
               href="/"
               className="flex items-center"
               onOpenChange={setOpen}
            >
               <span className="text-xl font-bold text-primary">
                  {Config.name}
               </span>
            </MobileLink>
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
               <div className="flex flex-col space-y-3">
                  {mobileLinks.map((item) => (
                     <MobileLink
                        key={item.href}
                        href={item.href}
                        onOpenChange={setOpen}
                     >
                        {item.title}
                     </MobileLink>
                  ))}
               </div>
               <div className="flex flex-col space-y-2 pt-6">
                  <h4 className="font-semibold text-sm text-foreground/80">التصنيفات</h4>
                  {categories.map((cat) => (
                     <MobileLink
                        key={cat.href}
                        href={cat.href}
                        onOpenChange={setOpen}
                        className="text-muted-foreground hover:text-foreground text-sm"
                     >
                        {cat.title}
                     </MobileLink>
                  ))}
               </div>
            </ScrollArea>
         </SheetContent>
      </Sheet>
   )
}

interface MobileLinkProps extends LinkProps {
   onOpenChange?: (open: boolean) => void
   children: React.ReactNode
   className?: string
}

function MobileLink({
   href,
   onOpenChange,
   className,
   children,
   ...props
}: MobileLinkProps) {
   const router = useRouter()
   return (
      <Link
         href={href}
         onClick={() => {
            router.push(href.toString())
            onOpenChange?.(false)
         }}
         className={cn(className)}
         {...props}
      >
         {children}
      </Link>
   )
}
