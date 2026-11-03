import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

// 1. PATCH: অর্ডারের স্ট্যাটাস (Confirmed, Shipping, Delivered) আপডেট করার জন্য
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status is required' },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // আপডেট হওয়া নতুন ডাটা রিটার্ন করবে
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Order status updated', order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update Order Error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 2. DELETE: নির্দিষ্ট কোনো অর্ডার ডাটাবেজ থেকে মুছে ফেলার জন্য
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Order deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete Order Error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}