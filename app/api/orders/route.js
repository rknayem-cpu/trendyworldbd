import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const newOrder = await Order.create(body);

    return NextResponse.json(
      { success: true, message: 'Order created successfully!', order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to place order.' },
      { status: 500 }
    );
  }
}




export async function GET() {
  try {
    await connectDB();
    
    // createdAt অনুযায়ী Descending (-1) সাজানো যাতে নতুন অর্ডারগুলো আগে আসে
    const orders = await Order.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, count: orders.length, orders },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders', error: error.message },
      { status: 500 }
    );
  }
}