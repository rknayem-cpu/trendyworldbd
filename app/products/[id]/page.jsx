'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SingleProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState('');
  const [size, setSize] = useState('M');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.product) {
          const p = data.product;
          setProduct(p);
          setImg(p.images?.[0] || '');
          if (p.sizes?.length > 0) setSize(p.sizes[0]);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;

    // Fly to cart animation
    const imgElement = document.querySelector('.product-main-image');
    if (imgElement) {
      const rect = imgElement.getBoundingClientRect();
      const cartIcon = document.getElementById('cart-icon');
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        const flyingImg = imgElement.cloneNode(true);
        Object.assign(flyingImg.style, {
          position: 'fixed', zIndex: '9999', left: `${rect.left}px`, top: `${rect.top}px`,
          width: `${rect.width}px`, height: `${rect.height}px`, borderRadius: '16px', objectFit: 'cover',
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

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.isDiscount && product.discountPrice ? product.discountPrice : product.price,
      image: img,
      size,
      quantity: 1,
    };

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(i => i.productId === cartItem.productId && i.size === size);
    index > -1 ? cart[index].quantity += 1 : cart.push(cartItem);

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdate'));

    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Added to Cart!', text: `${product.name} (Size: ${size})`, showConfirmButton: false, timer: 1500, background: '#09090b', color: '#fff' });
  };

  if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-xs text-gray-400"><Sparkles className="w-4 h-4 animate-spin text-rose-500 mr-2" /> Loading...</div>;
  if (!product) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-xs text-white">Product not found!</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 py-8 px-4 max-w-5xl mx-auto space-y-6 mt-14">
      <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/10">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Images Gallery */}
        <div className="space-y-3">
          <div className="h-80 sm:h-[450px] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-xl">
            <img src={img} alt={product.name} className="product-main-image w-full h-full object-fit" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((i, idx) => (
                <button key={idx} onClick={() => setImg(i)} className={`h-16 w-16 rounded-xl overflow-hidden border shrink-0 ${img === i ? 'border-rose-500 scale-95' : 'border-white/10 opacity-60'}`}>
                  <img src={i} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">{product.category}</span>
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${product.inStock ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
              {product.inStock ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {product.inStock ? `In Stock (${product.stockQuantity} left)` : 'Stock Out'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white">{product.name}</h1>
          
          <div className="flex items-center gap-3">
            {product.isDiscount && product.discountPrice ? (
              <>
                <span className="text-2xl font-black text-rose-400">৳{product.discountPrice}</span>
                <span className="text-xs text-gray-500 line-through">৳{product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-black text-white">৳{product.price}</span>
            )}
          </div>

          <p className="text-xs text-gray-400 leading-relaxed border-t border-b border-white/5 py-3">
            {product.description || 'Premium quality fabric crafted for ultimate comfort and style.'}
          </p>

          {/* Dynamic Sizes */}
          {product.sizes?.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-gray-300">Select Size:</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${size === s ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-transparent shadow-md' : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button 
            onClick={handleAddToCart} 
            disabled={!product.inStock} 
            className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all ${
              product.inStock 
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:opacity-95 shadow-rose-500/20' 
                : 'bg-neutral-800 text-gray-500 cursor-not-allowed border border-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> {product.inStock ? 'Add To Cart' : 'Stock Out'}
          </button>
        </div>
      </div>
    </div>
  );
}