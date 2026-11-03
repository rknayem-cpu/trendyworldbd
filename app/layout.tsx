import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from '@/context/CartContext';
import { Providers } from '@/components/Providers';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrendyWorldBD',
  description: 'Best choice for your fashion needs. Explore our collection of trendy clothing, accessories, and more. Shop now and stay stylish with TrendyWorldBD!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
         
       
        <CartProvider> 
        <Navbar/>
        {children}
        <Footer/>
         </CartProvider>
          </Providers>
        </body>
    </html>
  )
}
