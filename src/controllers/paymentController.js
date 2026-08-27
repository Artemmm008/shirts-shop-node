import { createCheckoutSession, processStripeWebhook, refundOrder } from "../services/paymentService.js"

export const createPaymentSessionController = async (req, res) => {
  const { orderId } = req.body;
  const userId = req.user?._id || null;
  const guestId = req.cookies?.guestId || null;

  const paymentUrl = await createCheckoutSession(orderId, userId, guestId);

  res.status(200).json({ url: paymentUrl });
};

export const handlePaymentWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  await processStripeWebhook(signature, req.body);

  res.status(200).json({ received: true });
};

export const refundOrderController = async (req, res) => {
  const { orderId } = req.params

  const refund = await refundOrder(orderId);

  res.status(200).json(refund)
}
