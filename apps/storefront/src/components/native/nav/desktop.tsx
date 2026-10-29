'use client'

import {
   NavigationMenu,
   NavigationMenuContent,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   NavigationMenuTrigger,
   navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import config from '@/config/site'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { forwardRef } from 'react'

const categoriesList = [
   { title: 'الملابس الرجالية', href: '/products?category=الملابس الرجالية', description: 'أحدث صيحات الملابس والقمصان والجينز' },
   { title: 'الملابس النسائية', href: '/products?category=الملابس النسائية', description: 'فساتين وأزياء نسائية راقية وعصرية' },
   { title: 'الأحذية الرياضية', href: '/products?category=الأحذية', description: 'أحذية جري وسنيكرز وأحذية رسمية' },
   { title: 'الساعات والإكسسوارات', href: '/products?category=الساعات والإكسسوارات', description: 'ساعات يد فخمة ونظارات وأحزمة' },
   { title: 'الإلكترونيات الذكية', href: '/products?category=الإلكترونيات الذكية', description: 'سماعات رأس وساعات ذكية وشواحن' },
   { title: 'الحقائب والمحافظ', href: '/products?category=الحقائب والمحافظ', description: 'حقائب ظهر ولابتوب ومحافظ جلدية' },
]

const brandsList = [
   { title: 'Nike', href: '/products?brand=Nike', description: 'أقوى الأحذية والملابس الرياضية' },
   { title: 'Adidas', href: '/products?brand=Adidas', description: 'أحذية وسنيكرز وملابس تمرين' },
   { title: 'Zara', href: '/products?brand=Zara', description: 'أحدث خطوط الموضة والأزياء العصرية' },
   { title: 'Apple', href: '/products?brand=Apple', description: 'ساعات ذكية وسماعات وإكسسوارات' },
   { title: 'Sony', href: '/products?brand=Sony', description: 'سماعات رأس بأعلى تقنيات الصوت' },
   { title: "Levi's", href: "/products?brand=Levi's", description: 'الجينز الأصلي والجاكيتات الكلاسيكية' },
   { title: 'Fossil', href: '/products?brand=Fossil', description: 'ساعات كرونوغراف وإكسسوارات فاخرة' },
   { title: 'Urban Line', href: '/products?brand=Urban Line', description: 'أزياء شبابية وسترات للمدينة' },
]

export function MainNav() {
   return (
      <div className="hidden md:flex gap-4">
         <Link href="/" className="flex items-center">
            <span className="hidden font-bold sm:inline-block text-lg">
               {config.name}
            </span>
         </Link>
         <NavMenu />
      </div>
   )
}

export function NavMenu() {
   return (
      <NavigationMenu>
         <NavigationMenuList>
            <NavigationMenuItem>
               <Link href="/products" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                     <div className="font-normal text-foreground/70">
                        المنتجات (Products)
                     </div>
                  </NavigationMenuLink>
               </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <NavigationMenuTrigger>
                  <div className="font-normal text-foreground/70">
                     التصنيفات (Categories)
                  </div>
               </NavigationMenuTrigger>
               <NavigationMenuContent>
                  <ul className="grid w-[450px] gap-2 p-4 md:w-[550px] md:grid-cols-2">
                     {categoriesList.map((cat) => (
                        <ListItem
                           key={cat.title}
                           title={cat.title}
                           href={cat.href}
                        >
                           {cat.description}
                        </ListItem>
                     ))}
                  </ul>
               </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <NavigationMenuTrigger>
                  <div className="font-normal text-foreground/70">
                     العلامات التجارية (Brands)
                  </div>
               </NavigationMenuTrigger>
               <NavigationMenuContent>
                  <ul className="grid w-[450px] gap-2 p-4 md:w-[550px] md:grid-cols-2">
                     {brandsList.map((brand) => (
                        <ListItem
                           key={brand.title}
                           title={brand.title}
                           href={brand.href}
                        >
                           {brand.description}
                        </ListItem>
                     ))}
                  </ul>
               </NavigationMenuContent>
            </NavigationMenuItem>
         </NavigationMenuList>
      </NavigationMenu>
   )
}

const ListItem = forwardRef<
   React.ElementRef<'a'>,
   React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
   return (
      <li>
         <NavigationMenuLink asChild>
            <Link
               href={href as string}
               ref={ref}
               className={cn(
                  'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  className
               )}
               {...props}
            >
               <div className="text-sm font-medium leading-none">{title}</div>
               <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                  {children}
               </p>
            </Link>
         </NavigationMenuLink>
      </li>
   )
})

ListItem.displayName = 'ListItem'
