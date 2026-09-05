import { Joi, Segments } from "celebrate"
import { isValidObjectId } from 'mongoose';

const ALLOWED_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "ONE_SIZE"];

export const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message("Invalid id format") : value;
};

export const createOrderSchema = {
  [Segments.BODY]: Joi.object({
    userId: Joi.string().custom(objectIdValidator).optional(),
    guestId: Joi.string().optional(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().custom(objectIdValidator).required(),
          title: Joi.string().required(),
          price: Joi.number().min(0).required(),
          quantity: Joi.number().integer().min(1).required(),
          sizes: Joi.string().valid(...ALLOWED_SIZES).required(),
        })
    ).min(1).required(),
    totalAmount: Joi.number().required(),
    customerInfo: Joi.object({
      fullName: Joi.string().min(2).required(),
      phone: Joi.string().min(6).required(),
      email: Joi.string().email().required(),
      address: Joi.string().min(5).required(),
    }).required(),
  }),
};
