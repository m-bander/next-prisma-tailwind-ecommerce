import config from '@/config/site'
import Mail from '@/emails/order_notification_owner'
import prisma from '@/lib/prisma'
import { sendMail } from '@persepolis/mail'
import { render } from '@react-email/render'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const orders = await prisma.order.findMany({
         where: {
            userId,
         },
         include: {
            address: true,
            payments: true,
            refund: true,
            orderItems: {
               include: {
                  product: true,
               },
            },
         },
         orderBy: {
            createdAt: 'desc',
         },
      })

      return NextResponse.json(orders)
   } catch (error) {
      console.error('[ORDERS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json().catch(() => ({}))
      const { discountCode } = body
      let addressId = body.addressId

      if (discountCode) {
         await prisma.discountCode.findUnique({
            where: {
               code: discountCode,
               stock: {
                  gte: 1,
               },
            },
         })
      }

      const cart = await prisma.cart.findUnique({
         where: {
            userId,
         },
         include: {
            items: {
               include: {
                  product: true,
               },
            },
         },
      })

      if (!cart || !cart.items || cart.items.length === 0) {
         return new NextResponse('Cart is empty', { status: 400 })
      }

      // If no addressId provided, check if user has existing address or create one
      if (!addressId) {
         const existingAddress = await prisma.address.findFirst({
            where: { userId },
         })
         if (existingAddress) {
            addressId = existingAddress.id
         } else {
            const newAddress = await prisma.address.create({
               data: {
                  userId,
                  city: body.city || 'القاهرة',
                  address: body.address || 'عنوان العميل الافتراضي',
                  phone: body.phone || '+201000000000',
                  postalCode: body.postalCode || '11511',
               },
            })
            addressId = newAddress.id
         }
      }

      const { tax, total, discount, payable } = calculateCosts({ cart })

      const order = await prisma.order.create({
         data: {
            user: {
               connect: {
                  id: userId,
               },
            },
            status: 'Processing',
            total,
            tax,
            payable,
            discount,
            shipping: 0,
            isPaid: false,
            address: {
               connect: { id: addressId },
            },
            orderItems: {
               create: cart?.items.map((orderItem) => ({
                  count: orderItem.count,
                  price: orderItem.product.price,
                  discount: orderItem.product.discount,
                  product: {
                     connect: {
                        id: orderItem.productId,
                     },
                  },
               })),
            },
         },
         include: {
            orderItems: {
               include: {
                  product: true,
               },
            },
            address: true,
         },
      })

      // Empty cart items after placing the order
      await prisma.cartItem.deleteMany({
         where: { cartId: userId },
      })

      // Try notifying owners safely without breaking order flow
      try {
         const owners = await prisma.owner.findMany()
         if (owners.length > 0) {
            await prisma.notification.createMany({
               data: owners.map((owner) => ({
                  userId: owner.id,
                  content: `Order #${order.number} was created with a value of $${payable}.`,
               })),
            })

            for (const owner of owners) {
               try {
                  await sendMail({
                     name: config.name,
                     to: owner.email,
                     subject: 'An order was created.',
                     html: await render(
                        Mail({
                           id: order.id,
                           payable: payable.toFixed(2),
                           orderNum: order.number.toString(),
                        })
                     ),
                  })
               } catch (mailErr) {
                  console.warn('[MAIL_ERROR] Could not send email to owner:', mailErr)
               }
            }
         }
      } catch (err) {
         console.warn('[NOTIFY_ERROR]', err)
      }

      return NextResponse.json(order)
   } catch (error) {
      console.error('[ORDER_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

function calculateCosts({ cart }) {
   let total = 0,
      discount = 0

   for (const item of cart?.items || []) {
      total += (item?.count || 1) * (item?.product?.price || 0)
      discount += (item?.count || 1) * (item?.product?.discount || 0)
   }

   const afterDiscount = total - discount
   const tax = afterDiscount * 0.09
   const payable = afterDiscount + tax

   return {
      total: parseFloat(total.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      afterDiscount: parseFloat(afterDiscount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      payable: parseFloat(payable.toFixed(2)),
   }
}
