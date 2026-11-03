'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, Menu, X, Flame, ChevronRight } from 'lucide-react';
import Carticon from '@/components/Carticon';
import CartPage from '@/components/Cart';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'T-Shirts', href: '/category/t-shirts' },
  { name: 'Shirts', href: '/category/shirts' },
  { name: 'Panjabi', href: '/category/panjabi' },
  { name: 'Pants', href: '/category/pants' },
  { name: 'Offers', href: '/offers', featured: true },
];


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
const router = useRouter();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // গ্লোবাল ইভেন্ট লিসেনার: পুরো প্রজেক্টের যেকোনো জায়গা থেকে কার্ট ওপেন/ক্লোজ করার জন্য
  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    const handleCloseCart = () => setIsCartOpen(false);

    window.addEventListener('openCart', handleOpenCart);
    window.addEventListener('closeCart', handleCloseCart);

    return () => {
      window.removeEventListener('openCart', handleOpenCart);
      window.removeEventListener('closeCart', handleCloseCart);
    };
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-black/40 backdrop-blur-sm py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-black text-white uppercase tracking-wider">
            Trendy<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">World</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${pathname === link.href ? 'text-white bg-white/10 shadow-inner' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                {link.featured && <Flame className="w-4 h-4 text-amber-400 animate-pulse" />}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 text-gray-300 hover:text-white transition-colors" onClick={() => router.push('/search')}>
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden sm:block p-2 text-gray-300 hover:text-white transition-colors"><User className="w-5 h-5" /></button>

            {/* Cart Sidebar Trigger Button */}
            <button id="cart-icon" onClick={() => setIsCartOpen(true)} className="p-2 text-gray-300 hover:text-white relative transition-colors">
              <Carticon />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button onClick={() => setIsOpen(true)} className="p-2 text-gray-300 hover:text-white md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar Drawer */}
      <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsOpen(false)} />

        <div className={`fixed top-0 right-0 w-4/5 max-w-xs bg-neutral-950 border-l border-white/10 h-full p-6 shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <span className="text-lg font-black text-white uppercase tracking-wider">Menu</span>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="mt-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/30 text-white' 
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.featured && <Flame className="w-4 h-4 text-amber-400 animate-pulse" />}
                      {link.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <Link href="/account" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all">
              <User className="w-4 h-4 text-amber-400" /> Account Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Cart Slide-Over Sidebar Drawer */}
      <div className={`fixed inset-0 z-[100] transition-all duration-300 ${isCartOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsCartOpen(false)} />

        <div className={`fixed top-0 right-0 w-full max-w-md bg-neutral-950 border-l border-white/10 h-full overflow-y-auto p-4 sm:p-6 shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <button onClick={() => setIsCartOpen(false)} className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          
          <div className="mt-6">
            <CartPage />
          </div>
        </div>
      </div>
    </>
  );
}