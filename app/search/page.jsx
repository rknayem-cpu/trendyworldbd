'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ArrowLeft, Sparkles, ShoppingBag, Tag, Eye, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ফেচ সার্চ রেজাল্ট
  useEffect(() => {
    async function fetchSearchResults(searchQuery) {
      if (!searchQuery.trim()) {
        setProducts([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults(initialQuery);
  }, [initialQuery]);

  // সার্চ সাবমিট হ্যান্ডলার
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // কুইক অ্যাড টু কার্ট (ফ্লাই অ্যানিমেশনসহ)
  const handleQuickAddToCart = (e, product) => {
    e.stopPropagation();
    const cardElement = e.currentTarget.closest('.product-card');
    const imgElement = cardElement?.querySelector('.product-img');

    if (imgElement) {
      const rect = imgElement.getBoundingClientRect();
      const cartIcon = document.getElementById('cart-icon');

      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        const flyingImg = imgElement.cloneNode(true);
        Object.assign(flyingImg.style, {
          position: 'fixed', zIndex: '9999', left: `${rect.left}px`, top: `${rect.top}px`,
          width: `${rect.width}px`, height: `${rect.height}px`, borderRadius: '12px', objectFit: 'cover',
          transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
        });
        document.body.appendChild(flyingImg);

        setTimeout(() => {
          Object.assign(flyingImg.style, {
            left: `${cartRect.left + cartRect.width / 2}px`, top: `${cartRect.top + cartRect.height / 2}px`,
            width: '20px', height: '20px', opacity: '0.5', borderRadius: '50%'
          });
        }, 50);

        setTimeout(() => flyingImg.remove(), 850);
      }
    }

    const defaultSize = product.sizes?.[0] || 'M';
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.isDiscount && product.discountPrice ? product.discountPrice : product.price,
      image: product.images?.[0] || '',
      size: defaultSize,
      quantity: 1,
    };

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = existingCart.findIndex(i => i.productId === cartItem.productId && i.size === cartItem.size);
    index > -1 ? existingCart[index].quantity += 1 : existingCart.push(cartItem);

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdate'));

    Swal.fire({
      toast: true, position: 'top-end', icon: 'success', title: 'Added to Cart!',
      showConfirmButton: false, timer: 1200, background: '#09090b', color: '#fff'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 mt-14">
      
      {/* Top Bar: Back & Search Input Form */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search t-shirts, shirts, panjabi, pants..."
            className="w-full pl-12 pr-28 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity"
          >
            Search
          </button>
        </form>
      </div>

      {/* Result Stats */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" /> Search Results for "{initialQuery}"
        </h1>
        <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-rose-400 font-semibold">
          {products.length} {products.length === 1 ? 'Item Found' : 'Items Found'}
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-24 text-gray-400 text-xs gap-2">
          <Sparkles className="w-5 h-5 animate-spin text-rose-500" /> Searching collection...
        </div>
      )}

      {/* Empty State */}
      {!loading && initialQuery && products.length === 0 && (
        <div className="text-center py-24 bg-white/[0.02] border border-white/10 rounded-3xl max-w-lg mx-auto space-y-3">
          <ShoppingBag className="w-10 h-10 mx-auto text-gray-600" />
          <p className="text-sm font-bold text-white">No products found!</p>
          <p className="text-xs text-gray-500">Try searching with other keywords or check spelling.</p>
        </div>
      )}

      {!loading && !initialQuery && (
        <div className="text-center py-24 text-gray-500 text-xs">
          Type something above and hit search to explore products.
        </div>
      )}

      {/* Products Grid (Mobile: 2 cols | Desktop: 4 cols) */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <div 
              key={product._id} 
              onClick={() => router.push(`/products/${product._id}`)}
              className="product-card group relative rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-rose-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl cursor-pointer"
            >
              {/* Image & Badges */}
              <div className="relative h-44 sm:h-72 w-full overflow-hidden bg-neutral-900">
                <img 
                  src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                  alt={product.name} 
                  className="product-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isDiscount && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase shadow-md flex items-center gap-1">
                      <Tag className="w-2 h-2" /> Sale
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-md ${
                    product.inStock ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out'}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-3 sm:p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-amber-400 font-bold mb-0.5 truncate">
                    {product.category}
                  </p>
                  <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
                    {product.name}
                  </h3>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <div>
                    {product.isDiscount && product.discountPrice ? (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                        <span className="text-xs sm:text-sm font-black text-rose-400">৳{product.discountPrice}</span>
                        <span className="text-[10px] text-gray-500 line-through">৳{product.price}</span>
                      </div>
                    ) : (
                      <span className="text-xs sm:text-sm font-black text-white">৳{product.price}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs border border-white/10"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => handleQuickAddToCart(e, product)}
                      className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-md hover:opacity-95"
                    >
                      <Plus className="w-3 h-3" /> Cart
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}