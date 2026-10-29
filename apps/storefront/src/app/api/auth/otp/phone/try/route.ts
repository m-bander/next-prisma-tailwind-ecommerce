import prisma from '@/lib/prisma'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { isIranianPhoneNumberValid } from '@persepolis/regex'
import { sendTransactionalSMS } from '@persepolis/sms'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
   try {
      const OTP = generateSerial({})

      const { phone } = await req.json()

      if (phone && phone.trim().length >= 8) {
         const cleanPhone = phone.toString().trim()
         await prisma.user.upsert({
            where: { phone: cleanPhone },
            update: {
               OTP,
            },
            create: {
               phone: cleanPhone,
               OTP,
            },
         })

         try {
            await sendTransactionalSMS({
               Mobile: cleanPhone,
               TemplateId: 100000,
               Parameters: [
                  {
                     name: 'Code',
                     value: OTP,
                  },
               ],
            })
         } catch (smsError) {
            console.warn('[SMS_SEND_ERROR] SMS not configured or failed:', smsError)
         }

         return new NextResponse(
            JSON.stringify({
               status: 'success',
               phone: cleanPhone,
               devOtp: OTP,
            }),
            {
               status: 200,
               headers: { 'Content-Type': 'application/json' },
            }
         )
      }

      return getErrorResponse(400, 'Invalid Phone Number')
   } catch (error) {
      console.error(error)
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
