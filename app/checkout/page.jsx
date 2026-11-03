'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

const locationData = {
  "Dhaka": {
    "Faridpur": ["Madhukhali", "Faridpur Sadar", "Boalmari", "Bhanga", "Nagarkanda", "Saltha", "Charbhadrasan", "Sadarpur", "Alfadanga"],
    "Dhaka": ["Gulshan", "Dhanmondi", "Mirpur", "Uttara", "Tejgaon", "Banani"],
    "Gazipur": ["Gazipur Sadar", "Kaliakair", "Kapasia", "Sreepur"],
    "Narayanganj": ["Narayanganj Sadar", "Rupganj", "Sonargaon"]
  },
  "Chittagong": { 
    "Chittagong": ["Pahartali", "Kotwali", "Khulshi"], 
    "Cox's Bazar": ["Sadar", "Teknaf", "Ukhia"] 
  },
  "Rajshahi": { 
    "Rajshahi": ["Boalia", "Motihar"], 
    "Bogra": ["Sadar", "Sherpur"] 
  },
  "Khulna": { 
    "Khulna": ["Sonadanga", "Daulatpur"], 
    "Jessore": ["Sadar", "Abhaynagar"] 
  }
};

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', phone: '', email: '', division: '', district: '', upazila: '', address: ''
  });

  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem('cart')) || []);
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      
      // বিভাগ পাল্টালে জেলা ও উপজেলা রিক্লিয়ার হবে
      if (name === 'division') {
        updated.district = '';
        updated.upazila = '';
      }
      // জেলা পাল্টালে উপজেলা রিক্লিয়ার হবে
      if (name === 'district') {
        updated.upazila = '';
      }
      return updated;
    });
  };

  const subtotal = cartItems.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0);
  
  // জেলা সিলেক্টের ওপর ভিত্তি করে ডায়নামিক ডেলিভারি চার্জ
  const deliveryFee = form.district ? (form.district === 'Faridpur' ? 60 : 100) : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.division || !form.district || !form.upazila) {
      Swal.fire({ title: 'Location Required', text: 'Please select Division, District, and Upazila.', icon: 'warning', background: '#09090b', color: '#fff' });
      return;
    }

    setLoading(true);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: form, items: cartItems, subtotal, deliveryFee, total })
      });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdate'));
      Swal.fire({ title: 'Order Confirmed!', text: 'Thank you for shopping.', icon: 'success', confirmButtonColor: '#f43f5e', background: '#09090b', color: '#fff' });
      router.push('/');
    }
  };

  if (cartItems.length === 0) return <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">Cart is Empty! <Link href="/" className="mt-2 text-rose-500 font-bold">Shop Now</Link></div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 p-4 sm:p-8 max-w-5xl mx-auto mt-20 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white"><ArrowLeft className="w-4 h-4" /> Back</Link>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Box */}
        <div className="lg:col-span-2 space-y-4 bg-white/[0.03] p-5 rounded-2xl border border-white/10">
          <h2 className="text-xs font-bold uppercase text-amber-400">Shipping Details</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <input type="text" name="name" required placeholder="Full Name *" value={form.name} onChange={change} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none" />
            <input type="tel" name="phone" required placeholder="Phone *" value={form.phone} onChange={change} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none" />
          </div>
          
          <input type="email" name="email" placeholder="Email (Optional)" value={form.email} onChange={change} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none" />

          {/* Dynamic Location Selectors */}
          <div className="grid grid-cols-3 gap-3">
            {/* Division Select */}
            <select name="division" required value={form.division} onChange={change} className="p-3 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white">
              <option value="">Select Division *</option>
              {Object.keys(locationData).map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* District Select */}
            <select name="district" required value={form.district} onChange={change} disabled={!form.division} className="p-3 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white disabled:opacity-40">
              <option value="">Select District *</option>
              {form.division && Object.keys(locationData[form.division] || {}).map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Upazila Select */}
            <select name="upazila" required value={form.upazila} onChange={change} disabled={!form.district} className="p-3 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white disabled:opacity-40">
              <option value="">Select Upazila *</option>
              {form.district && (locationData[form.division]?.[form.district] || []).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <textarea name="address" rows={2} required placeholder="Full Address Details (House, Village, Road) *" value={form.address} onChange={change} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none" />
        </div>

        {/* Right Order Summary Box */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 h-fit">
          <h2 className="text-xs font-bold uppercase text-amber-400">Order Summary</h2>
          
          <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-gray-300">
                <span className="truncate w-32">{item.name} ({item.size})</span>
                <span>৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-3 space-y-1 text-xs">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>৳{subtotal}</span></div>
            <div className="flex justify-between text-gray-400">
              <span>Delivery Fee</span>
              <span className="text-rose-400">{form.district ? `৳${deliveryFee}` : 'Select District'}</span>
            </div>
            <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-white/10"><span>Total</span><span className="text-rose-400">৳{total}</span></div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-lg disabled:opacity-50">
            {loading ? 'Processing...' : 'Confirm Order (COD)'} <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}