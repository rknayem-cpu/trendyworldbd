'use client';

import { useState } from 'react';
import { Sparkles, ShoppingBag, Heart, ShieldCheck, RefreshCw, Truck, Check, Star } from 'lucide-react';

export default function SingleProduct({ product }) {
  // প্রডাক্টের ডিফল্ট ডাটা বা প্রপস থেকে ডাটা রিসিভ করা
  const item = product || {
    _id: '1',
    name: 'Over-Sized Premium Streetwear Tee',
    category: 't-shirts',
    price: 950,
    isDiscount: true,
    discountPrice: 750,
    isNewArrival: true,
    inStock: true,
    stockQuantity: 25,
    description: 'Crafted from 100% heavy-weight combed cotton, this oversized streetwear tee offers supreme comfort and durability. Designed for modern lifestyle and effortless styling.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=60'
    ]
  };

  const [selectedImage, setSelectedImage] = useState(item.images[0] || '');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    alert(`Added ${quantity} item(s) of size [${selectedSize}] to Cart!`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 py-10 px-4 sm:px-6 ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Side: Image Gallery */}
        <div className="space-y-4">
          {/* Main Big Image */}
          <div className="relative h-[380px] sm:h-[480px] rounded-3xl 
          overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
            <img 
              src={selectedImage} 
              alt={item.name} 
              className="w-full h-full object-cover transition-all duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {item.isNewArrival && (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-black uppercase tracking-wider shadow-lg">
                  New Arrival
                </span>
              )}
              {item.isDiscount && (
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-lg">
                  Sale Offer
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-4 right-4 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-rose-500 transition-colors shadow-lg"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            </button>
          </div>

          {/* Thumbnail Selector Grid */}
          {item.images && item.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-20 rounded-2xl overflow-hidden border transition-all ${
                    selectedImage === img ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Info & Actions */}
        <div className="space-y-6">
          
          {/* Category & Title */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest 
            text-amber-400 font-extrabold px-3 py-1 
            rounded-full bg-amber-400/10 border border-amber-400/20">
              {item.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {item.name}
            </h1>
          </div>

          {/* Price & Stock */}
          <div className="flex items-center justify-between border-y border-white/10 py-4">
            <div className="flex items-center gap-3">
              {item.isDiscount && item.discountPrice ? (
                <>
                  <span className="text-2xl sm:text-3xl font-black text-rose-400">৳{item.discountPrice}</span>
                  <span className="text-sm text-gray-500 line-through">৳{item.price}</span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-black text-white">৳{item.price}</span>
              )}
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              item.inStock ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {item.inStock ? `In Stock (${item.stockQuantity})` : 'Stock Out'}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed font-['kalpurush']">
            {item.description}
          </p>

          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-300">Select Size</span>
              <span className="text-rose-400 cursor-pointer hover:underline">Size Guide</span>
            </div>
            <div className="flex gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl text-xs font-bold transition-all border ${
                    selectedSize === size 
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-transparent shadow-lg shadow-rose-500/20' 
                      : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart Button */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-white/10 rounded-xl bg-white/5 overflow-hidden">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-4 py-3 text-white hover:bg-white/10 transition-colors font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-4 py-3 text-white hover:bg-white/10 transition-colors font-bold text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!item.inStock}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-sm shadow-xl hover:opacity-90 transition-all disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
            </div>
          </div>

          {/* Extra Perks / Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <Truck className="w-5 h-5 mx-auto text-amber-400" />
              <p className="text-[10px] font-bold text-gray-300">Fast Delivery</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <RefreshCw className="w-5 h-5 mx-auto text-amber-400" />
              <p className="text-[10px] font-bold text-gray-300">Easy Return</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <ShieldCheck className="w-5 h-5 mx-auto text-amber-400" />
              <p className="text-[10px] font-bold text-gray-300">100% Original</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}