import Stripe from "stripe";
import { Order } from "../models/order.js";
import createHttpError from "http-errors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (orderId, userId = null, guestId = null) => {
  if (!userId && !guestId) {
    throw createHttpError(403, "Access denied");
  }

  const query = {
    _id: orderId,
    ...(userId ? { userId } : { guestId }),
  };

  const order = await Order.findOne(query);

  if (!order) {
    throw createHttpError(404, "Order not found");
  };

   if (order.status === "paid") {
    throw createHttpError(400, "Order already paid");
  };

  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.title,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    metadata: {
      orderId: order._id.toString(),
      userId: userId ? userId.toString() : "",
      guestId: guestId || "",
    },
    success_url: `${process.env.CLIENT_URL}/order/success?orderId=${order._id}`,
    cancel_url: `${process.env.CLIENT_URL}/order/cancel`,
  })

  return session.url
}

export const processStripeWebhook = async (signature, rawBody) => {
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await Order.findByIdAndUpdate(session.metadata.orderId, {
      status: "paid",
      paymentIntentId: session.payment_intent,
    });
  }
};

export const refundOrder = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw createHttpError(404, "Order not found");
  }

  if (order.status !== "paid" || !order.paymentIntentId) {
    throw createHttpError(400, "Order cannot be refunded");
  }

  const refund = await stripe.refunds.create({
    payment_intent: order.paymentIntentId,
  });

  order.status = "canceled";
  await order.save();

  return refund;
};
