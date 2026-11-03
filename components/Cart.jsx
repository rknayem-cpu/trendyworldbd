'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function CartPage() {
  const { closeCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = () => {
      setItems(JSON.parse(localStorage.getItem('cart')) || []);
      setLoading(false);
    };
    loadCart();
    window.addEventListener('cartUpdate', loadCart);
    return () => window.removeEventListener('cartUpdate', loadCart);
  }, []);

  const saveCart = (updated) => {
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const updateQty = (i, delta) => {
    const updated = [...items];
    updated[i].quantity += delta;
    if (updated[i].quantity <= 0) updated.splice(i, 1);
    saveCart(updated);
  };

  const removeItem = (i) => {
    const updated = items.filter((_, idx) => idx !== i);
    saveCart(updated);
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Removed', showConfirmButton: false, timer: 1000, background: '#09090b', color: '#fff' });
  };

  const subtotal = items.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0);
  
  // Free Delivery Logic (2000 BDT)
  const isFreeDelivery = subtotal >= 2000;
  const progressPercent = Math.min((subtotal / 2000) * 100, 100);
  const remainingForFree = 2000 - subtotal;

  if (loading) return <div className="text-white text-center py-10 text-xs">Loading...</div>;

  return (
    <div className="text-gray-200 flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <h1 className="text-sm font-black text-white flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-rose-500" /> Cart ({items.length})</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-2 my-auto">
          <ShoppingBag className="w-10 h-10 mx-auto text-gray-600" />
          <h2 className="text-xs font-bold text-white">Your cart is empty!</h2>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden pt-3 space-y-3">
          
          {/* Free Delivery Progress Bar */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 shrink-0">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1 text-gray-300">
                <Truck className="w-3.5 h-3.5 text-amber-400" /> 
                {isFreeDelivery ? <span className="text-emerald-400">🎉 Free Delivery Unlocked!</span> : `Add ৳${remainingForFree} more for Free Delivery`}
              </span>
              <span className="text-amber-400">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {items.map((item, i) => (
              <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 gap-2">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-white/10 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-white truncate">{item.name}</h3>
                    <p className="text-[10px] text-gray-400">Size: {item.size} | <span className="text-rose-400 font-bold">৳{item.price}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center border border-white/10 rounded-lg bg-white/5">
                    <button onClick={() => updateQty(i, -1)} className="px-1.5 py-1 text-gray-300 hover:bg-white/15 text-[10px]"><Minus className="w-3 h-3" /></button>
                    <span className="px-2 text-[11px] font-bold text-white">{item.quantity}</span>
                    <button onClick={() => updateQty(i, 1)} className="px-1.5 py-1 text-gray-300 hover:bg-white/15 text-[10px]"><Plus className="w-3 h-3" /></button>
                  </div>
                  <span className="text-xs font-black text-white w-10 text-right">৳{item.price * item.quantity}</span>
                  <button onClick={() => removeItem(i)} className="p-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 shrink-0 mt-auto">
            <div className="flex justify-between items-center text-xs font-black text-white pt-1 border-t border-white/10">
              <span>Subtotal</span>
              <span className="text-rose-400 text-sm">৳{subtotal}</span>
            </div>

            <Link href="/checkout"
           onClick={() => window.dispatchEvent(new Event('closeCart'))}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}