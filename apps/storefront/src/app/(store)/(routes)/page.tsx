import {
   BlogPostCard,
   BlogPostGrid,
   BlogPostSkeletonGrid,
} from '@/components/native/BlogCard'
import Carousel from '@/components/native/Carousel'
import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import { Badge } from '@/components/ui/badge'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'
import Link from 'next/link'

export default async function Index() {
   const products = await prisma.product.findMany({
      take: 12,
      include: {
         brand: true,
         categories: true,
      },
      orderBy: {
         createdAt: 'desc',
      },
   })

   const categories = await prisma.category.findMany()

   const blogs = await prisma.blog.findMany({
      include: { author: true },
      take: 3,
   })

   const banners = await prisma.banner.findMany()

   return (
      <div className="flex flex-col border-neutral-200 dark:border-neutral-700">
         <Carousel images={banners.map((obj) => obj.image)} />
         
         {/* Categories shortcut bar */}
         <div className="mt-8 mb-2 flex flex-wrap gap-2 items-center justify-center sm:justify-start">
            <span className="text-sm font-semibold text-muted-foreground mr-1">التصنيفات:</span>
            <Link href="/products">
               <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition px-3 py-1">
                  الكل
               </Badge>
            </Link>
            {categories.map((cat) => (
               <Link key={cat.id} href={`/products?category=${cat.title}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition px-3 py-1">
                     {cat.title}
                  </Badge>
               </Link>
            ))}
         </div>

         <Separator className="my-6" />
         
         <div className="flex items-center justify-between mb-4">
            <Heading
               title="أحدث المنتجات (Featured Products)"
               description="تشكيلة حصرية من أفضل المنتجات المتاحة للشراء الفوري"
            />
            <Link href="/products" className="text-sm font-semibold text-primary hover:underline">
               عرض جميع المنتجات (30) ←
            </Link>
         </div>

         {isVariableValid(products) ? (
            <ProductGrid products={products} />
         ) : (
            <ProductSkeletonGrid />
         )}

         <Separator className="my-10" />

         <div className="flex items-center justify-between mb-4">
            <Heading
               title="مقالات ومدونة المتجر (Blog)"
               description="أحدث المقالات والإرشادات لاختيار وتنسيق مشترياتك"
            />
         </div>

         {isVariableValid(blogs) ? (
            <BlogPostGrid blogs={blogs} />
         ) : (
            <BlogPostSkeletonGrid />
         )}
      </div>
   )
}
