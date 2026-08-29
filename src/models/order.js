import { Schema, model } from "mongoose"

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    guestId: {
      type: String,
      default: null,
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    customerInfo: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
      type: String,
      required: true,
      trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      }
    },
    status: {
      type: String,
      enum: ["new", "paid", "processing", "completed", "canceled"],
      default: "new",
    },
    paymentIntentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Order = model("Order", orderSchema);
