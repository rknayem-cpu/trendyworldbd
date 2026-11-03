import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function POST(request) {
  try {
    // 1. Database Connect
    await connectDB();

    // 2. Get Data from Frontend
    const body = await request.json();
    console.log("Received Body from Frontend:", body);

    const {
      name,
      category,
      price,
      isDiscount,
      discountPrice,
      isNewArrival,
      inStock,
      stockQuantity,
      description,
      sizes, // নতুন sizes ফিল্ড রিসিভ করা হলো
      images,
    } = body;

    // 3. Validation
    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and category are required.' },
        { status: 400 }
      );
    }

    // 4. Save to MongoDB using Mongoose
    const newProduct = await Product.create({
      name,
      category,
      price: Number(price),
      isDiscount: Boolean(isDiscount),
      discountPrice: isDiscount && discountPrice ? Number(discountPrice) : null,
      isNewArrival: Boolean(isNewArrival),
      inStock: Boolean(inStock),
      stockQuantity: Number(stockQuantity) || 0,
      description: description || '',
      sizes: sizes || ['S', 'M', 'L', 'XL', 'XXL'], // ফ্রন্টএンド থেকে আসা sizes বা ডিফল্ট সাইজ
      images: images || [],
    });

    console.log("Saved Product in MongoDB:", newProduct);

    return NextResponse.json(
      {
        success: true,
        message: 'Product saved to MongoDB successfully!',
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('MongoDB Save Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error saving product.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}