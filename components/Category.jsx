'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, RefreshCw, Headset, ArrowUpRight, Sparkles } from 'lucide-react';

const trustItems = [
  { icon: Truck, title: 'Fast Delivery', sub: 'Islandwide' },
  { icon: ShieldCheck, title: 'Cash on Delivery', sub: '100% Safe' },
  { icon: RefreshCw, title: '7 Days Return', sub: 'Easy exchange' },
  { icon: Headset, title: '24/7 Support', sub: 'Instant assistance' },
];

// ক্যাটাগরি লিস্ট ও তাদের Unsplash ছবি (T-Shirts, Shirts, Panjabi, Pants)
const categoryConfigs = [
  { name: 'T-Shirts', href: '/t-shirts', img: 'https://img.drz.lazcdn.com/static/bd/p/dc534eb7bbf7ac558d13d6b69df2f3e3.jpg_720x720q80.jpg', wide: true },
  { name: 'Shirts', href: '/shirts', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop' },
  { name: 'Panjabi', href: '/panjabi', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQin5F_K6oPdQ4R5yW4EvfrCyy1Wl6LRuHZi3RE8H3WSsGemOrNc03OluF&s=10' },
  { name: 'Pants', href: '/pants', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop', wide: true },
];

export default function Category() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ডাটাবেজ থেকে সব প্রোডাক্ট ফেচ করা যাতে লাইভ কাউন্ট দেখানো যায়
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products for count:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // ডাটাবেজ থেকে প্রতিটি ক্যাটাগরির প্রোডাক্ট সংখ্যা বের করার ফাংশন
  const getCategoryCount = (categoryName) => {
    return products.filter(
      p => p.category?.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  return (
    <section className="bg-neutral-950 text-white py-8 sm:py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Trust Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
        {trustItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 text-rose-400 border border-rose-500/20 shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold truncate">{item.title}</h4>
                <p className="text-[10px] text-gray-400 truncate">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Categories Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Collections</span>
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight">Shop By Category</h2>
          </div>
          <Link href="/categories" className="text-xs font-semibold text-rose-400 hover:text-amber-400 flex items-center gap-1 transition-colors">
            All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {categoryConfigs.map((cat, i) => {
            const count = getCategoryCount(cat.name);

            return (
              <Link
                key={i}
                href={`/category/${cat.href}`}
                className={`group relative h-40 sm:h-56 rounded-2xl overflow-hidden border border-white/10 ${
                  cat.wide ? 'md:col-span-2' : 'md:col-span-1'
                }`}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between">
                  {/* Live Item Count Badge */}
                  <span className="self-end px-2.5 py-0.5 text-[9px] font-bold rounded-full bg-black/60 text-amber-400 border border-amber-400/30 backdrop-blur-md flex items-center gap-1">
                    {loading ? '...' : `${count} Items`}
                  </span>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs sm:text-lg font-black uppercase text-white group-hover:text-rose-400 transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/10 group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-amber-500 flex items-center justify-center text-white transition-all transform group-hover:scale-110">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </section>
  );
}