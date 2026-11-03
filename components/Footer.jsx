import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-gray-400 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info & Custom Image Area */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Custom Image Section */}
            <div className="w-full max-w-[80px] h-auto overflow-hidden rounded-lg mb-4">
              <img 
                src="/tlogo.png" 
                alt="TrendyWorld Banner/Logo" 
                className="w-full h-full object-cover"
              />
            </div>

            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-wider text-white uppercase">
                Trendy<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">World</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Your ultimate destination for modern premium fashion. Elevate your daily lifestyle with our trendy T-Shirts, Shirts, Panjabis, and Innerwear collections.
            </p>

            {/* Social Links using clean inline SVGs (No Lucide Social Icon Issues) */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Facebook" className="p-2.5 rounded-full bg-white/5 hover:bg-rose-500 hover:text-white transition-all text-gray-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="p-2.5 rounded-full bg-white/5 hover:bg-rose-500 hover:text-white transition-all text-gray-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" aria-label="X / Twitter" className="p-2.5 rounded-full bg-white/5 hover:bg-rose-500 hover:text-white transition-all text-gray-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop Collections</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/t-shirts" className="hover:text-white transition-colors">T-Shirts</Link></li>
              <li><Link href="/shirts" className="hover:text-white transition-colors">Casual & Formal Shirts</Link></li>
              <li><Link href="/panjabi" className="hover:text-white transition-colors">Premium Panjabi</Link></li>
              <li><Link href="/innerwear" className="hover:text-white transition-colors">Ganji / Innerwear</Link></li>
              <li><Link href="/offers" className="hover:text-amber-400 transition-colors font-medium">Hot Offers & Sale</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Customer Care</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Return & Exchange</Link></li>
              <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Newsletter / Stay Connected Section */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Join The Club</h3>
            <p className="text-xs text-gray-400 mb-4">
              Subscribe to get special discount offers, free giveaways, and updates.
            </p>
            
            <div className="space-y-2">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all pr-10"
                  readOnly
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-rose-500 to-amber-500 rounded-lg text-white">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-xs text-gray-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-500" /> +880 1234-567890
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-500" /> support@trendyworld.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Dhaka, Bangladesh
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TrendyWorld. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-gray-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}