import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'ecommerce-secret-key-super-secure-2026-production-ready'

export const signJWT = async (
   payload: { sub: string },
   options: { exp: string }
) => {
   try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      const alg = 'HS256'
      return new SignJWT(payload)
         .setProtectedHeader({ alg })
         .setExpirationTime(options.exp)
         .setIssuedAt()
         .setSubject(payload.sub)
         .sign(secret)
   } catch (error) {
      throw error
   }
}

export const verifyJWT = async <T>(token: string): Promise<T> => {
   try {
      return (
         await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
         )
      ).payload as T
   } catch (error) {
      console.error({ error })
      throw error
   }
}
