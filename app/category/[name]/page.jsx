'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sparkles, ShoppingBag, ArrowLeft, Tag, Eye, Plus } from 'lucide-react';

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryName = params?.name ? decodeURIComponent(params.name) : '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ক্যাটাগরির নাম দিয়ে ব্যাকএন্ড থেকে প্রোডাক্ট ফেচ করা
  useEffect(() => {
    if (!categoryName) return;

    async function fetchCategoryProducts() {
      try {
        const res = await fetch(`/api/category/${encodeURIComponent(categoryName)}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch category products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [categoryName]);

  // Quick Add to Cart (Fly Animation সহ)
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
        flyingImg.style.borderRadius = '16px';
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
      <div className="min-h-screen bg-neutral-950 flex justify-center items-center text-gray-400 text-sm">
        <Sparkles className="w-5 h-5 animate-spin text-rose-500 mr-2" /> Loading {categoryName} Collection...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 mt-16 min-h-screen text-gray-200">
      
      {/* Back & Title Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> {categoryName}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Explore our exclusive {categoryName} collection</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-rose-400 font-semibold">
          {products.length} {products.length === 1 ? 'Item' : 'Items'} Found
        </span>
      </div>

      {/* Products Grid or Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-24 bg-white/[0.02] border border-white/10 rounded-3xl max-w-xl mx-auto space-y-3">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-600" />
          <h2 className="text-base font-bold text-white">No products found in {categoryName}!</h2>
          <p className="text-xs text-gray-500">Check back later or explore other categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product._id} 
              onClick={() => router.push(`/products/${product._id}`)}
              className="product-card group relative rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-rose-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl cursor-pointer"
            >
              {/* Image & Badges */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-900">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="product-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                    No Image Available
                  </div>
                )}

                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.isNewArrival && (
                    <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      New
                    </span>
                  )}
                  {product.isDiscount && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" /> Sale
                    </span>
                  )}
                </div>
              </div>

              {/* Content Details */}
              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                    {product.description || 'Premium quality fabric designed for ultimate comfort & style.'}
                  </p>
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    {product.isDiscount && product.discountPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-rose-400">৳{product.discountPrice}</span>
                        <span className="text-xs text-gray-500 line-through">৳{product.price}</span>
                      </div>
                    ) : (
                      <span className="text-sm font-black text-white">৳{product.price}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all border border-white/10">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => handleQuickAddToCart(e, product)}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md hover:opacity-95"
                    >
                      <Plus className="w-3.5 h-3.5" /> Cart
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