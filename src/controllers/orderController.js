import { Order } from "../models/order.js"
import createHttpError from "http-errors"
import { setGuestCookie } from "../services/auth.js";

export const createOrder = async (req, res) => {
  const orderData = {
    ...req.body,
    userId: req.user ? req.user._id : null,
    guestId: req.user ? null : setGuestCookie(req, res)
  };

  const order = await Order.create(orderData);
  res.status(201).json(order);
};

export const getAllOrders = async (req, res) => {
  const filter = req.user?.role === "admin"
    ? {}
    : req.user
      ? { userId: req.user._id }
      : req.cookies?.guestId
        ? { guestId: req.cookies.guestId }
        : null;

  if (!filter) {
    return res.status(200).json([]);
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.status(200).json(orders)
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) {
    throw createHttpError(404, "Order not found");
  };

  const isOwner =
    req.user?.role === "admin" ||
    (order.userId && String(order.userId) === String(req.user?._id)) ||
    (order.guestId && order.guestId === req.cookies?.guestId);

  if (!isOwner) {
    throw createHttpError(403, "Access denied");
  }

  res.status(200).json(order);
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after", runValidators: true }
  );

  if (!order) {
    throw createHttpError(404, "Order not found");
  };

  res.status(200).json(order)
};
