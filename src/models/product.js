import { Schema, model } from "mongoose"

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
    },
    imageUrl: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL", "ONE SIZE"],
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Product = model("Product", productSchema);
