'use client'

import { useEffect, useState } from 'react'

export function useAuthenticated() {
   const [authenticated, setAuthenticated] = useState<boolean>(false)

   useEffect(() => {
      try {
         if (typeof window !== 'undefined') {
            const hasCookie = document.cookie
               .split(';')
               .some((cookie) => cookie.trim().startsWith('logged-in=true'))

            setAuthenticated(hasCookie)
         }
      } catch (error) {
         console.error({ error })
         setAuthenticated(false)
      }
   }, [])

   return { authenticated }
}
