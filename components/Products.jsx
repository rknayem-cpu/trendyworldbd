'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Tag, Eye, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

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
        flyingImg.style.position = 'fixed';
        flyingImg.style.zIndex = '9999';
        flyingImg.style.left = `${rect.left}px`;
        flyingImg.style.top = `${rect.top}px`;
        flyingImg.style.width = `${rect.width}px`;
        flyingImg.style.height = `${rect.height}px`;
        flyingImg.style.borderRadius = '12px';
        flyingImg.style.objectFit = 'cover';
        flyingImg.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        document.body.appendChild(flyingImg);

        setTimeout(() => {
          flyingImg.style.left = `${cartRect.left + cartRect.width / 2}px`;
          flyingImg.style.top = `${cartRect.top + cartRect.height / 2}px`;
          flyingImg.style.width = '20px';
          flyingImg.style.height = '20px';
          flyingImg.style.opacity = '0.5';
          flyingImg.style.borderRadius = '50%';
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
    const existingIndex = existingCart.findIndex(
      item => item.productId === cartItem.productId && item.size === cartItem.size
    );

    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-400 text-xs">
        <Sparkles className="w-4 h-4 animate-spin text-rose-500 mr-2" /> Loading Trendy Products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white/[0.02] border border-white/10 rounded-2xl max-w-lg mx-auto my-6 px-4">
        <ShoppingBag className="w-8 h-8 mx-auto text-gray-600 mb-2" />
        <p className="text-xs font-bold text-gray-300">No products found in inventory.</p>
      </div>
    );
  }

  const displayedProducts = products.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6">
      
      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="text-base sm:text-2xl font-black text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> Latest Collection
          </h2>
          <p className="text-[10px] sm:text-xs text-gray-400">Explore our high-end streetwear & apparel</p>
        </div>
        <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-rose-400 font-semibold">
          {products.length} Items
        </span>
      </div>

      {/* Products Grid (Mobile: 2 cols | Desktop: 4 cols) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {displayedProducts.map((product) => (
          <div 
            key={product._id} 
            onClick={() => router.push(`/products/${product._id}`)}
            className="product-card group relative rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-rose-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl cursor-pointer"
          >
            {/* Image & Badges Container */}
            <div className="relative h-44 sm:h-72 w-full overflow-hidden bg-neutral-900">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="product-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px]">
                  No Image
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
                {product.isNewArrival && (
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-md">
                    New
                  </span>
                )}
                {product.isDiscount && (
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-rose-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Tag className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> Sale
                  </span>
                )}
              </div>

              {/* Stock Status Badge */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                <span className={`px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold backdrop-blur-md ${
                  product.inStock ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out'}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-3 sm:p-5 space-y-2 sm:space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-0.5 sm:mb-1 truncate">
                  {product.category}
                </p>
                <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-1 sm:line-clamp-2 mt-0.5">
                  {product.description || 'Premium quality fabric designed for comfort.'}
                </p>
              </div>

              {/* Price & Actions */}
              <div className="pt-2 sm:pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  {product.isDiscount && product.discountPrice ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                      <span className="text-xs sm:text-sm font-black text-rose-400">৳{product.discountPrice}</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 line-through">৳{product.price}</span>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm font-black text-white">৳{product.price}</span>
                  )}
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button 
                    className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all border border-white/10"
                    title="View"
                  >
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => handleQuickAddToCart(e, product)}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 shadow-md hover:opacity-95"
                    title="Add to Cart"
                  >
                    <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Cart
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < products.length && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs shadow-lg transition-all hover:border-rose-500/50"
          >
            Load More ({products.length - visibleCount} remaining)
          </button>
        </div>
      )}

    </div>
  );
}