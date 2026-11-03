import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ success: true, products: [] }, { status: 200 });
    }

    // কেস-ইনসেন্সিটিভ রেগুলার এক্সপ্রেশন দিয়ে নাম, ক্যাটাগরি বা ডেসক্রিপশনে সার্চ করা
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).limit(10); // সর্বোচ্চ ১০টি রেজাল্ট দেখাবে

    return NextResponse.json(
      { success: true, count: products.length, products },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Search failed', error: error.message },
      { status: 500 }
    );
  }
}