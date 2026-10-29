'use client'

import { useAuthenticated } from '@/hooks/useAuthentication'
import { getLocalCart, writeLocalCart } from '@/lib/cart'
import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext<{
   cart: any
   loading: boolean
   refreshCart: () => Promise<void>
   dispatchCart: (object: any) => void
}>({
   cart: { items: [] },
   loading: true,
   refreshCart: async () => {},
   dispatchCart: () => {},
})

export const useCartContext = () => {
   return useContext(CartContext)
}

export const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
   const { authenticated } = useAuthenticated()

   const [cart, setCart] = useState<any>({ items: [] })
   const [loading, setLoading] = useState<boolean>(true)

   const dispatchCart = (newCart: any) => {
      const sanitized =
         newCart && Array.isArray(newCart.items)
            ? newCart
            : { items: [] }
      setCart(sanitized)
      writeLocalCart(sanitized)
   }

   const fetchServerCart = async () => {
      try {
         setLoading(true)
         const res = await fetch('/api/cart', { cache: 'no-store' })
         if (res.ok) {
            const data = await res.json()
            const sanitized =
               data && Array.isArray(data.items)
                  ? data
                  : { items: [] }
            setCart(sanitized)
            writeLocalCart(sanitized)
         } else {
            const local = getLocalCart() as any
            const sanitized =
               local && Array.isArray(local.items)
                  ? local
                  : { items: [] }
            setCart(sanitized)
         }
      } catch (err) {
         console.error('[CART_FETCH_ERROR]', err)
         const local = getLocalCart() as any
         setCart(local && Array.isArray(local.items) ? local : { items: [] })
      } finally {
         setLoading(false)
      }
   }

   const refreshCart = async () => {
      if (authenticated) {
         await fetchServerCart()
      } else {
         const local = getLocalCart() as any
         setCart(local && Array.isArray(local.items) ? local : { items: [] })
         setLoading(false)
      }
   }

   useEffect(() => {
      if (authenticated === true) {
         fetchServerCart()
      } else if (authenticated === false) {
         const local = getLocalCart() as any
         setCart(local && Array.isArray(local.items) ? local : { items: [] })
         setLoading(false)
      }
   }, [authenticated])

   return (
      <CartContext.Provider
         value={{ cart, loading, refreshCart, dispatchCart }}
      >
         {children}
      </CartContext.Provider>
   )
}
