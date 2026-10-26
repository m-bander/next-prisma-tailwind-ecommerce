import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const items = [
   {
      title: 'بنطلون جينز رجالي كلاسيك',
      brand: 'Urban Line',
      price: 899,
      stock: 18,
      discount: 10,
      description: 'بنطلون جينز مريح بقصة مستقيمة، مناسب للاستخدام اليومي.',
      image:
         'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
      keywords: ['بنطلون', 'جينز', 'رجالي', 'ملابس'],
   },
   {
      title: 'بنطلون كارغو بجيوب متعددة',
      brand: 'Street Wear',
      price: 1099,
      stock: 12,
      discount: 5,
      description: 'بنطلون كارغو عملي بجيوب جانبية وقماش قطني متين.',
      image:
         'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80',
      keywords: ['بنطلون', 'كارغو', 'رجالي', 'قطن'],
   },
   {
      title: 'بنطلون تشينو بيج',
      brand: 'Urban Line',
      price: 749,
      stock: 20,
      discount: 0,
      description: 'بنطلون تشينو أنيق بلون بيج سهل التنسيق للمشاوير والعمل.',
      image:
         'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',
      keywords: ['بنطلون', 'تشينو', 'بيج', 'رجالي'],
   },
   {
      title: 'بنطلون رياضي أسود',
      brand: 'Active Club',
      price: 599,
      stock: 25,
      discount: 15,
      description: 'بنطلون رياضي خفيف بخصر مرن للتمرين والراحة.',
      image:
         'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=80',
      keywords: ['بنطلون', 'رياضي', 'أسود', 'رجالي'],
   },
   {
      title: 'بنطلون جينز نسائي واسع',
      brand: 'Denim House',
      price: 949,
      stock: 14,
      discount: 8,
      description: 'جينز نسائي بقصة واسعة ولمسة عصرية، مريح طوال اليوم.',
      image:
         'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
      keywords: ['بنطلون', 'جينز', 'نسائي', 'واسع'],
   },
   {
      title: 'بنطلون جينز أزرق غامق',
      brand: 'Denim House',
      price: 829,
      stock: 16,
      discount: 0,
      description: 'بنطلون جينز بلون أزرق غامق وقصة عملية تناسب كل يوم.',
      image:
         'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=80',
      keywords: ['بنطلون', 'جينز', 'أزرق', 'ملابس'],
   },
   {
      title: 'تيشيرت قطني أبيض',
      brand: 'Basics Co',
      price: 349,
      stock: 30,
      discount: 0,
      description: 'تيشيرت قطني ناعم بقصة بسيطة، قطعة أساسية في كل خزانة.',
      image:
         'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      keywords: ['تيشيرت', 'قطن', 'أبيض', 'ملابس'],
   },
   {
      title: 'هودي رمادي بغطاء رأس',
      brand: 'Street Wear',
      price: 999,
      stock: 10,
      discount: 12,
      description: 'هودي دافئ بقماش ناعم وجيب أمامي للاستخدام اليومي.',
      image:
         'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
      keywords: ['هودي', 'رمادي', 'ملابس', 'شتوي'],
   },
]

async function main() {
   await prisma.category.upsert({
      where: { title: 'Clothing' },
      update: {},
      create: { title: 'Clothing', description: 'ملابس وأزياء' },
   })

   let added = 0
   for (const item of items) {
      const existing = await prisma.product.findFirst({
         where: { title: item.title },
         select: { id: true },
      })
      if (existing) continue

      await prisma.product.create({
         data: {
            title: item.title,
            description: item.description,
            price: item.price,
            stock: item.stock,
            discount: item.discount,
            isPhysical: true,
            isAvailable: true,
            isFeatured: false,
            images: [item.image],
            keywords: item.keywords,
            brand: {
               connectOrCreate: {
                  where: { title: item.brand },
                  create: { title: item.brand },
               },
            },
            categories: { connect: { title: 'Clothing' } },
         },
      })
      added++
   }

   console.log(`تمت إضافة ${added} منتجات ملابس تجريبية.`)
}

main()
   .catch((error) => {
      console.error('تعذر إضافة المنتجات التجريبية:', error)
      process.exitCode = 1
   })
   .finally(async () => {
      await prisma.$disconnect()
   })
