import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['t-shirts', 'shirts', 'panjabi', 'pants'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    isDiscount: {
      type: Boolean,
      default: false,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    // নতুন যুক্ত করা sizes ফিল্ড (অ্যারে অব স্ট্রিং হিসেবে সেভ হবে)
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // CreatedAt and UpdatedAt automatic add korbe
  }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);