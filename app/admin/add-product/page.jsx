'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Sparkles, Package, DollarSign, X } from 'lucide-react';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '', 
    category: 't-shirts', 
    price: '', 
    isDiscount: false,
    discountPrice: '', 
    isNewArrival: true, 
    inStock: true, 
    stockQuantity: '50',
    description: '', 
    sizes: 'S, M, L, XL, XXL', // নতুন সাইজ ইনপুট ফিল্ড
    images: [] // File অবজেক্টগুলো এখানে জমা থাকবে
  });

  const [loading, setLoading] = useState(false);

  const toggle = (field) => setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  const change = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // একাধিক ছবি সিলেক্ট করার হ্যান্ডলার
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  // নির্দিষ্ট ছবি প্রিভিউ থেকে রিমूव করার হ্যান্ডলার
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // ফর্ম সাবমিট এবং ক্লাউডিনারি আপলোড হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ১. প্রথমে সব ছবি একে একে Cloudinary-তে আপলোড করা হবে
      const uploadedImageUrls = [];
      
      for (const file of formData.images) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "gel7weha"); // আপনার দেওয়া ক্লাউডিনারি প্রিসেট নাম

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        const cloudinaryData = await cloudinaryRes.json();
        if (cloudinaryData.secure_url) {
          uploadedImageUrls.push(cloudinaryData.secure_url);
        }
      }

      // ২. সাইজগুলো কমা দিয়ে স্প্লিট বা ট্রিম করে অ্যারে বা স্ট্রিং হিসেবে সাজানো
      const formattedSizes = formData.sizes
        ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      // ৩. ফাইলের জায়গায় Cloudinary-র আসল লিংক এবং ফরম্যাটেড সাইজ বসানো হলো
      const finalPayload = {
        ...formData,
        sizes: formattedSizes,
        images: uploadedImageUrls, 
      };

      // ৪. এবার আমাদের ব্যাকএন্ড API-তে ডাটা পাঠিয়ে MongoDB-তে সেভ করা হবে
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      const result = await res.json();
      
      if (result.success) {
        alert('প্রডাক্ট এবং ছবি সফলভাবে MongoDB-তে সেভ হয়েছে!');
        // ফর্ম রিসেট করা
        setFormData({
          name: '', category: 't-shirts', price: '', isDiscount: false,
          discountPrice: '', isNewArrival: true, inStock: true, stockQuantity: '50',
          description: '', sizes: 'S, M, L, XL, XXL', images: []
        });
      } else {
        alert(result.message || 'প্রডাক্ট সেভ করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      console.error(err);
      alert('ছবি আপলোড বা প্রডাক্ট সেভ করতে ত্রুটি ঘটেছে');
    } finally {
      setLoading(false);
    }
  };

  const ToggleSwitch = ({ active, onClick }) => (
    <button type="button" onClick={onClick} className={`w-12 h-6 rounded-full p-1 transition-all ${active ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-white/10'}`}>
      <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 p-4 sm:p-8 max-w-4xl mx-auto space-y-6 mt-16">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-white">Add New Product</h1>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-lg opacity-90 hover:opacity-100 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Inputs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <h2 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2"><Package className="w-4 h-4" /> Basic Info</h2>
            
            <input type="text" name="name" required placeholder="Product Name *" value={formData.name} onChange={change} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-rose-500" />
            
            <select name="category" value={formData.category} onChange={change} className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-sm text-white focus:outline-none focus:border-rose-500">
              <option value="t-shirts">T-Shirts</option>
              <option value="shirts">Shirts</option>
              <option value="panjabi">Panjabi</option>
              <option value="pants">Pants</option>
            </select>

            <textarea name="description" rows={3} placeholder="Product Description..." value={formData.description} onChange={change} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-rose-500" />
          </div>

          {/* Sizes Input Section */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <label className="text-xs font-bold uppercase text-amber-400">Available Sizes (Comma separated)</label>
            <input 
              type="text" 
              name="sizes" 
              placeholder="e.g. S, M, L, XL or 32, 34, 36" 
              value={formData.sizes} 
              onChange={change} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-rose-500" 
            />
            <p className="text-[10px] text-gray-500">Sizes will be saved automatically separating by comma.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <h2 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Pricing & Offer</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="price" required placeholder="Price (৳) *" value={formData.price} onChange={change} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-rose-500" />
              <input type="number" name="stockQuantity" required placeholder="Stock Qty *" value={formData.stockQuantity} onChange={change} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-xs font-bold">Apply Discount Offer?</span>
              <ToggleSwitch active={formData.isDiscount} onClick={() => toggle('isDiscount')} />
            </div>

            {formData.isDiscount && (
              <input type="number" name="discountPrice" placeholder="Discount Price (৳)" value={formData.discountPrice} onChange={change} className="w-full px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm text-white focus:outline-none" />
            )}
          </div>
        </div>

        {/* Right Sidebar Controls & Image Upload Previews */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <h2 className="text-xs font-bold uppercase text-amber-400">Status</h2>
            <div className="flex items-center justify-between"><span className="text-xs">New Arrival</span><ToggleSwitch active={formData.isNewArrival} onClick={() => toggle('isNewArrival')} /></div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5"><span className="text-xs">In Stock</span><ToggleSwitch active={formData.inStock} onClick={() => toggle('inStock')} /></div>
          </div>

          {/* Image Upload & Preview Section */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <h2 className="text-xs font-bold uppercase text-amber-400">Product Images</h2>
            
            <label className="border-2 border-dashed border-white/15 rounded-2xl p-4 text-center hover:border-rose-500 transition-colors cursor-pointer block bg-white/[0.01]">
              <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
              <p className="text-xs font-semibold text-white">Click to upload images</p>
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            </label>

            {/* Selected Images Previews Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {formData.images.map((file, idx) => {
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <div key={idx} className="relative group h-20 rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
                      <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                      
                      {/* Cross Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="sm:hidden w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-sm shadow-lg disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>

      </form>
    </div>
  );
}