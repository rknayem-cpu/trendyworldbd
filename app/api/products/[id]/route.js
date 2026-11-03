import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // ১. প্রডাক্টটি ডাটাবেজ থেকে খুঁজে বের করা (যাতে ছবিগুলোর URL পাওয়া যায়)
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // ২. Cloudinary থেকে ছবিগুলো ডিলিট করা
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        try {
          // Cloudinary URL থেকে 'public_id' বের করার নিয়ম:
          // উদাহরণ URL: https://res.cloudinary.com/demo/image/upload/v12345678/folder/sample.jpg
          const parts = imgUrl.split('/');
          const filenameWithExtension = parts[parts.length - 1]; // sample.jpg
          const publicId = filenameWithExtension.split('.')[0]; // sample
          
          // যদি ফোল্ডারের ভেতর থাকে, ফোল্ডার নামসহ পাথ দিতে হয়। 
          // সাধারণ আনসাইনড আপলোডের ক্ষেত্রে শুধু public_id দিলেই কাজ করে।
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudErr) {
          console.error("Cloudinary image delete error:", cloudErr);
        }
      }
    }

    // ৩. এবার MongoDB থেকে প্রডাক্ট ডিলিট করা
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      message: 'Product and Cloudinary images deleted successfully' 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();

    // sizes যদি স্ট্রিং আকারে আসে তবে অ্যারে বানিয়ে নেওয়া
    if (typeof body.sizes === 'string') {
      body.sizes = body.sizes.split(',').map(s => s.trim()).filter(Boolean);
    }

    const updatedProduct = await Product.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!updatedProduct) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}