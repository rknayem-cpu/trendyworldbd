'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const p = data.product;
          setForm({
            ...p,
            sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes || ''
          });
        }
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Updated!', showConfirmButton: false, timer: 1200, background: '#09090b', color: '#fff' });
      router.push('/admin/panel');
    } else {
      Swal.fire({ icon: 'error', title: 'Failed', text: data.error, background: '#09090b', color: '#fff' });
    }
  };

  if (!form) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center text-xs">Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 py-10 px-4 max-w-2xl mx-auto space-y-6 mt-14">
      <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white/[0.02] border border-white/10 p-6 rounded-2xl shadow-xl">
        <h1 className="text-base font-black text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> Edit Product</h1>

        <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Product Name" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />
        
        <div className="grid grid-cols-2 gap-3">
          <select name="category" value={form.category} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white">
            <option value="t-shirts">T-Shirts</option>
            <option value="shirts">Shirts</option>
            <option value="panjabi">Panjabi</option>
            <option value="pants">Pants</option>
          </select>
          <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} required placeholder="Stock Qty" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input type="number" name="price" value={form.price} onChange={handleChange} required placeholder="Price" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />
          <input type="number" name="discountPrice" value={form.discountPrice || ''} onChange={handleChange} placeholder="Discount Price" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />
        </div>

        <input type="text" name="sizes" value={form.sizes} onChange={handleChange} placeholder="Sizes (e.g. S, M, L, XL)" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />
        
        <textarea name="description" rows="3" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />

        <div className="flex gap-4 pt-2">
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} className="accent-rose-500" /> In Stock
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input type="checkbox" name="isDiscount" checked={form.isDiscount} onChange={handleChange} className="accent-rose-500" /> Discount
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}