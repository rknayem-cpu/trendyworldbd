'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

export default function Carticon() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // ১. লোকালস্টোরেজ থেকে টোটাল কোয়ান্টিটি ক্যালকুলেট করার ফাংশন
    const updateCartCount = () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        // কার্টে থাকা সব প্রডাক্টের quantity যোগ করে মোট সংখ্যা বের করা
        const totalCount = storedCart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
        setCartCount(totalCount);
      } catch (err) {
        console.error('Failed to parse cart from localStorage:', err);
        setCartCount(0);
      }
    };

    // পেজ লোড হওয়ার সাথে সাথে একবার কল হবে
    updateCartCount();

    // ২. কাস্টম `cartUpdate` ইভেন্ট শোনা (EventListener)
    window.addEventListener('cartUpdate', updateCartCount);

    // ক্লিনআপ ফাংশন (কম্পোনেন্ট আনমাউন্ট হলে ইভেন্ট লিসেনার রিমूव হবে)
    return () => {
      window.removeEventListener('cartUpdate', updateCartCount);
    };
  }, []);

  return (
    <div className="relative inline-flex items-center cursor-pointer" id='cart-icon'>
      <ShoppingBag className="w-5 h-5 text-gray-200" />
      
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
          {cartCount}
        </span>
      )}
    </div>
  );
}