import './globals.css'
import { Inter } from 'next/font/google'
import { AlchemyProvider } from "@/app/hooks/useAlchemy";
import { ServicesProvider } from "@/app/hooks/useServices";
import { ControllersProvider } from "@/app/hooks/useControllers";
import { Suspense } from "react";

const inter = Inter({subsets: ['latin']})

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <AlchemyProvider>
      <ServicesProvider>
        <ControllersProvider>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </ControllersProvider>
      </ServicesProvider>
    </AlchemyProvider>
    </body>
    </html>
  )
}
