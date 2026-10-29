import Footer from '@/components/native/Footer'
import Header from '@/components/native/nav/parent'
import { AppProviders } from '@/providers/app-providers'

export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <AppProviders>
         <Header />
         <div className="px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
            {children}
         </div>
         <Footer />
      </AppProviders>
   )
}
