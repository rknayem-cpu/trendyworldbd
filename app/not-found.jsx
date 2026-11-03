import Link from 'next/link';
import { Home, ArrowLeft, ShoppingBag, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center
     px-4 sm:px-6 lg:px-8 relative overflow-hidden mt-12">
      
      {/* Background Neon Glowing Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl w-full text-center relative z-10 space-y-8">
        
        {/* Glowing 404 Typography */}
        <div className="relative">
          <h1 className="text-8xl sm:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-400 to-rose-600 animate-pulse select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-9xl font-black text-white/5 select-none blur-sm">404</span>
          </div>
        </div>

        {/* Message Section */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Oops! Look like you got lost in fashion.
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable in TrendyWorld.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          
          {/* Go Back Home */}
          <Link 
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Explore Collections */}
          <Link 
            href="/t-shirts"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-semibold text-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            Explore Collections
          </Link>

        </div>

        {/* Quick Suggestion Links */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
          <span className="text-gray-500 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> Popular Categories:
          </span>
          <Link href="/t-shirts" className="hover:text-white transition-colors">T-Shirts</Link>
          <span>•</span>
          <Link href="/shirts" className="hover:text-white transition-colors">Shirts</Link>
          <span>•</span>
          <Link href="/panjabi" className="hover:text-white transition-colors">Panjabi</Link>
          <span>•</span>
          <Link href="/offers" className="text-amber-400 hover:underline">Offers</Link>
        </div>

      </div>
    </main>
  );
}