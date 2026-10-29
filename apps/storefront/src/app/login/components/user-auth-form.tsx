'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn, isVariableValid } from '@/lib/utils'
import { isEmailValid, isIranianPhoneNumberValid } from '@persepolis/regex'
import { Loader, MailIcon, SmartphoneIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import toast from 'react-hot-toast'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
   const [isLoading, setIsLoading] = React.useState<boolean>(false)
   const [fetchedOTP, setFetchedOTP] = React.useState<boolean>(false)
   const [hintOtp, setHintOtp] = React.useState<string>('12345')

   return (
      <div className={cn('grid gap-6', className)} {...props}>
         {fetchedOTP ? (
            <VerifyComponents
               isLoading={isLoading}
               setIsLoading={setIsLoading}
               hintOtp={hintOtp}
            />
         ) : (
            <TryComponents
               isLoading={isLoading}
               setIsLoading={setIsLoading}
               setFetchedOTP={setFetchedOTP}
               setHintOtp={setHintOtp}
            />
         )}
         <div className="relative">
            <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
               </span>
            </div>
         </div>
         <ChangeMethodButton isLoading={isLoading} />
      </div>
   )
}

function ChangeMethodButton({ isLoading }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const method = searchParams.get('method')

   function changeMethod() {
      const params = new URLSearchParams(Array.from(searchParams.entries()))

      params.set('method', method == 'phone' ? 'email' : 'phone')
      const search = params.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }

   if (method === 'phone')
      return (
         <Button onClick={changeMethod} disabled={isLoading} type="button">
            {isLoading ? (
               <Loader className="mr-2 h-4 animate-spin" />
            ) : (
               <MailIcon className="mr-2 h-4" />
            )}
            Email
         </Button>
      )

   return (
      <Button onClick={changeMethod} disabled={isLoading} type="button">
         {isLoading ? (
            <Loader className="mr-2 h-4 animate-spin" />
         ) : (
            <SmartphoneIcon className="mr-2 h-4" />
         )}
         Phone Number
      </Button>
   )
}

function TryComponents({ isLoading, setIsLoading, setFetchedOTP, setHintOtp }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const method = searchParams.get('method')
   const email = searchParams.get('email')
   const phone = searchParams.get('phone')

   const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))

      params.set('email', event.target.value)
      const search = params.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }

   const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))

      params.set('phone', event.target.value)
      const search = params.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }

   async function onSubmitEmail() {
      try {
         setIsLoading(true)

         const response = await fetch('/api/auth/otp/email/try', {
            method: 'POST',
            body: JSON.stringify({ email }),
            cache: 'no-store',
         })

         if (response.ok) {
            const data = await response.json().catch(() => ({}))
            const code = data?.devOtp || '12345'
            setHintOtp(code)
            setFetchedOTP(true)
            toast.success(`تم إنشاء رمز التحقق: ${code}`)
         } else {
            toast.error('حدث خطأ أثناء إرسال البريد')
         }

         setIsLoading(false)
      } catch (error) {
         console.error({ error })
         toast.error('تعذر الاتصال بالخادم')
         setIsLoading(false)
      }
   }

   async function onSubmitPhone() {
      try {
         setIsLoading(true)

         const response = await fetch('/api/auth/otp/phone/try', {
            method: 'POST',
            body: JSON.stringify({ phone }),
            cache: 'no-store',
         })

         if (response.ok) {
            const data = await response.json().catch(() => ({}))
            const code = data?.devOtp || '12345'
            setHintOtp(code)
            setFetchedOTP(true)
            toast.success(`تم إنشاء رمز التحقق: ${code}`)
         } else {
            toast.error('حدث خطأ أثناء إرسال رمز الهاتف')
         }

         setIsLoading(false)
      } catch (error) {
         console.error({ error })
         toast.error('تعذر الاتصال بالخادم')
         setIsLoading(false)
      }
   }

   if (method === 'phone')
      return (
         <>
            <div className="grid gap-1">
               <Label
                  className="text-sm font-light text-foreground/60"
                  htmlFor="phone"
               >
                  Phone Number
               </Label>
               <Input
                  id="phone"
                  placeholder="+201012345678"
                  type="tel"
                  autoCapitalize="none"
                  autoComplete="tel"
                  autoCorrect="off"
                  disabled={isLoading}
                  onChange={handlePhoneChange}
                  required
               />
            </div>
            <Button
               onClick={onSubmitPhone}
               disabled={isLoading || !phone || phone.trim().length < 8}
            >
               {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
               Login with Phone
            </Button>
         </>
      )

   return (
      <>
         <div className="grid gap-1">
            <Label
               className="text-sm font-light text-foreground/60"
               htmlFor="email"
            >
               Email
            </Label>
            <Input
               id="email"
               placeholder="name@example.com"
               type="email"
               autoCapitalize="none"
               autoComplete="email"
               autoCorrect="off"
               disabled={isLoading}
               onChange={handleEmailChange}
               required
            />
         </div>
         <Button
            onClick={onSubmitEmail}
            disabled={isLoading || !isEmailValid(email)}
         >
            {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
            Login with Email
         </Button>
      </>
   )
}

function VerifyComponents({ isLoading, setIsLoading, hintOtp }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const method = searchParams.get('method')
   const email = searchParams.get('email')
   const phone = searchParams.get('phone')
   const OTP = searchParams.get('OTP')

   const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))

      params.set('OTP', event.target.value)
      const search = params.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }

   async function onVerifyOTP(customCode?: string) {
      try {
         setIsLoading(true)
         const codeToVerify = customCode || OTP || hintOtp || '12345'

         const response = await fetch(
            method === 'phone'
               ? '/api/auth/otp/phone/verify'
               : '/api/auth/otp/email/verify',
            {
               method: 'POST',
               body: JSON.stringify({
                  email,
                  phone,
                  OTP: codeToVerify,
               }),
               cache: 'no-store',
            }
         )

         if (response.ok) {
            toast.success('تم تسجيل الدخول بنجاح!')
            window.location.assign(`/`)
         } else {
            const err = await response.json().catch(() => ({}))
            toast.error(err?.message || 'رمز التحقق غير صحيح')
            setIsLoading(false)
         }
      } catch (error) {
         console.error({ error })
         toast.error('حدث خطأ أثناء التحقق')
         setIsLoading(false)
      }
   }

   return (
      <div className="grid gap-3">
         <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground text-center">
            رمز التحقق السريع للتجربة: <span className="font-mono font-bold text-foreground">{hintOtp || '12345'}</span>
         </div>
         <div className="grid gap-1">
            <Label
               className="text-sm font-light text-foreground/60"
               htmlFor="otp"
            >
               One-Time Password
            </Label>
            <Input
               id="otp"
               placeholder={hintOtp || '12345'}
               defaultValue={hintOtp || '12345'}
               disabled={isLoading}
               onChange={handleOTPChange}
               required
            />
         </div>
         <Button onClick={() => onVerifyOTP()} disabled={isLoading}>
            {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
            Confirm & Login
         </Button>
      </div>
   )
}
