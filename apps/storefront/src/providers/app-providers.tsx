'use client'

import { CartContextProvider } from '@/state/Cart'
import { UserContextProvider } from '@/state/User'
import React from 'react'

export function AppProviders({ children }: { children: React.ReactNode }) {
   return (
      <UserContextProvider>
         <CartContextProvider>
            {children}
         </CartContextProvider>
      </UserContextProvider>
   )
}
