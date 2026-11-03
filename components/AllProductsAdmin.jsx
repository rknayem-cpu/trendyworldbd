'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Pencil, Sparkles, ArrowLeft, Package } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AllProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products);
        setLoading(false);
      });
  }, []);

  // Delete Handler with SweetAlert2
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#09090b',
      color: '#f3f4f6'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
          const data = await res.json();

          if (data.success) {
            // Live UI Update: Remove deleted product from state without reload
            setProducts(prev => prev.filter(p => p._id !== id));
            Swal.fire({
              title: 'Deleted!',
              text: 'Product has been deleted.',
              icon: 'success',
              background: '#09090b',
              color: '#f3f4f6',
              timer: 1500,
              showConfirmButton: false
            });
          } else {
            Swal.fire('Error!', data.message || 'Failed to delete', 'error');
          }
        } catch (err) {
          Swal.fire('Error!', 'Something went wrong', 'error');
        }
      }
    });
  };

  if (loading) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Loading Products...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 p-4 sm:p-8 max-w-5xl mx-auto space-y-6 mt-16">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/15">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10
           border border-white/10 text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-white">Manage Products</h1>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-rose-400 font-bold">
          Total: {products.length}
        </span>
      </div>

      {/* Products List Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-sm">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {products.map((product) => (
            <div 
              key={product._id} 
              className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all gap-4"
            >
              {/* Image & Title */}
              <div className="flex items-center gap-4 min-w-0">
                <img 
                  src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                  alt={product.name} 
                  className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0 bg-neutral-900"
                />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-amber-400">{product.category}</span>
                  <h3 className="text-sm font-bold text-white truncate">{product.name}</h3>
                  <p className="text-xs font-black text-rose-400">৳{product.discountPrice || product.price}</p>
                </div>
              </div>

              {/* Action Icons (Edit & Delete) */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Edit Icon Button */}
                <Link 
                  href={`/admin/edit/${product._id}`} 
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-amber-400 border border-white/10 transition-colors"
                  title="Edit Product"
                >
                  <Pencil className="w-4 h-4" />
                </Link>

                {/* Delete Icon Button */}
                <button 
                  onClick={() => handleDelete(product._id)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-400 border border-white/10 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}