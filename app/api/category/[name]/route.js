import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product'; // তোমার প্রোডাক্ট মডেল পাথ অনুযায়ী ঠিক করে নিও

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { name } = await params;
    const decodedCategory = decodeURIComponent(name).trim();

    // কেস-ইনসেন্সিটিভ রেগুলার এক্সপ্রেশন যাতে 't-shirts', 'T-Shirts', 'tshirts' সব ম্যাচ করে
    const products = await Product.find({
      category: { $regex: new RegExp(`^${decodedCategory}$`, 'i') }
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, count: products.length, products },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch Category Products Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch category products', error: error.message },
      { status: 500 }
    );
  }
}