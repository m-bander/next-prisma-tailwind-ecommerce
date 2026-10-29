import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'

import {
   AvailableToggle,
   BrandCombobox,
   CategoriesCombobox,
   SortBy,
} from './components/options'

export const dynamic = 'force-dynamic'

export default async function Products({ searchParams }) {
   const { sort, isAvailable, brand, category, categories, page = 1 } = searchParams ?? {}
   const catFilter = category || categories

   const orderBy = getOrderBy(sort)

   const brands = await prisma.brand.findMany()
   const allCategories = await prisma.category.findMany()
   const products = await prisma.product.findMany({
      where: {
         ...(isAvailable === 'true' ? { isAvailable: true } : {}),
         ...(brand ? { brand: { title: { contains: brand, mode: 'insensitive' } } } : {}),
         ...(catFilter ? { categories: { some: { title: { contains: catFilter, mode: 'insensitive' } } } } : {}),
      },
      orderBy,
      take: 40,
      include: {
         brand: true,
         categories: true,
      },
   })

   return (
      <>
         <Heading
            title="Products"
            description="Below is a list of products you have in your cart."
         />
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
            <SortBy initialData={sort} />
            <CategoriesCombobox
               initialCategory={catFilter}
               categories={allCategories}
            />
            <BrandCombobox initialBrand={brand} brands={brands} />
            <AvailableToggle initialData={isAvailable} />
         </div>
         <Separator />
         {isVariableValid(products) ? (
            <ProductGrid products={products} />
         ) : (
            <ProductSkeletonGrid />
         )}
      </>
   )
}

function getOrderBy(sort) {
   let orderBy

   switch (sort) {
      case 'featured':
         orderBy = {
            orders: {
               _count: 'desc',
            },
         }
         break
      case 'most_expensive':
         orderBy = {
            price: 'desc',
         }
         break
      case 'least_expensive':
         orderBy = {
            price: 'asc',
         }
         break

      default:
         orderBy = {
            orders: {
               _count: 'desc',
            },
         }
         break
   }

   return orderBy
}
