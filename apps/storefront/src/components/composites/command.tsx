'use client'

import { Button } from '@/components/ui/button'
import {
   CommandDialog,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import {
   CircleIcon,
   HeartIcon,
   LaptopIcon,
   ListOrderedIcon,
   MoonIcon,
   PackageIcon,
   ShoppingBagIcon,
   ShoppingBasketIcon,
   SunIcon,
   UserIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import * as React from 'react'

const storeLinks = [
   { title: 'جميع المنتجات (All Products)', href: '/products', icon: ShoppingBagIcon },
   { title: 'عربة التسوق (Cart)', href: '/cart', icon: ShoppingBasketIcon },
   { title: 'قائمة الرغبات (Wishlist)', href: '/wishlist', icon: HeartIcon },
   { title: 'حسابي (Profile)', href: '/profile', icon: UserIcon },
   { title: 'طلباتي (My Orders)', href: '/profile/orders', icon: ListOrderedIcon },
   { title: 'الملابس الرجالية', href: '/products?category=الملابس الرجالية', icon: PackageIcon },
   { title: 'الملابس النسائية', href: '/products?category=الملابس النسائية', icon: PackageIcon },
   { title: 'الأحذية', href: '/products?category=الأحذية', icon: PackageIcon },
   { title: 'الساعات والإكسسوارات', href: '/products?category=الساعات والإكسسوارات', icon: PackageIcon },
   { title: 'الإلكترونيات الذكية', href: '/products?category=الإلكترونيات الذكية', icon: PackageIcon },
   { title: 'الحقائب والمحافظ', href: '/products?category=الحقائب والمحافظ', icon: PackageIcon },
]

export function CommandMenu({ ...props }: any) {
   const router = useRouter()
   const [open, setOpen] = React.useState(false)
   const [products, setProducts] = React.useState<any[]>([])
   const { setTheme } = useTheme()

   React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
         if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpen((open) => !open)
         }
      }

      document.addEventListener('keydown', down)
      return () => document.removeEventListener('keydown', down)
   }, [])

   React.useEffect(() => {
      if (open && products.length === 0) {
         fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
               if (Array.isArray(data)) setProducts(data)
            })
            .catch(() => {})
      }
   }, [open, products.length])

   const runCommand = React.useCallback((command: () => unknown) => {
      setOpen(false)
      command()
   }, [])

   return (
      <>
         <Button
            variant="outline"
            className={cn(
               'relative w-full justify-start text-sm font-light text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
            )}
            onClick={() => setOpen(true)}
            {...props}
         >
            <span className="inline-flex">البحث في المتجر...</span>
         </Button>
         <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="ابحث عن منتج أو تصنيف أو صفحة..." />
            <CommandList>
               <CommandEmpty>لا توجد نتائج مطابقة.</CommandEmpty>

               {/* Products search results */}
               {products.length > 0 && (
                  <CommandGroup heading="المنتجات (Products)">
                     {products.slice(0, 15).map((prod) => (
                        <CommandItem
                           key={prod.id}
                           value={`${prod.title} ${prod?.brand?.title || ''}`}
                           onSelect={() => {
                              runCommand(() => router.push(`/products/${prod.id}`))
                           }}
                        >
                           <ShoppingBagIcon className="mr-2 h-4 w-4 text-primary" />
                           <div className="flex justify-between w-full items-center">
                              <span className="truncate">{prod.title}</span>
                              <span className="text-xs font-bold text-muted-foreground ml-2">
                                 ${prod.price}
                              </span>
                           </div>
                        </CommandItem>
                     ))}
                  </CommandGroup>
               )}

               <CommandSeparator />

               <CommandGroup heading="أقسام وصفحات المتجر">
                  {storeLinks.map((navItem) => {
                     const Icon = navItem.icon || CircleIcon
                     return (
                        <CommandItem
                           key={navItem.href}
                           value={navItem.title}
                           onSelect={() => {
                              runCommand(() => router.push(navItem.href))
                           }}
                        >
                           <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                           {navItem.title}
                        </CommandItem>
                     )
                  })}
               </CommandGroup>

               <CommandSeparator />
               <CommandGroup heading="المظهر (Theme)">
                  <CommandItem
                     onSelect={() => runCommand(() => setTheme('light'))}
                  >
                     <SunIcon className="mr-2 h-4" />
                     فاتح (Light)
                  </CommandItem>
                  <CommandItem
                     onSelect={() => runCommand(() => setTheme('dark'))}
                  >
                     <MoonIcon className="mr-2 h-4" />
                     داكن (Dark)
                  </CommandItem>
                  <CommandItem
                     onSelect={() => runCommand(() => setTheme('system'))}
                  >
                     <LaptopIcon className="mr-2 h-4" />
                     تلقائي (System)
                  </CommandItem>
               </CommandGroup>
            </CommandList>
         </CommandDialog>
      </>
   )
}
