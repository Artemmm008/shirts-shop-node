import { Joi, Segments } from "celebrate"
import { isValidObjectId } from 'mongoose';

export const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message("Invalid id format") : value;
};

export const createCheckoutSessionSchema = {
  [Segments.BODY]: Joi.object({
    orderId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const refundOrderSchema = {
  [Segments.PARAMS]: Joi.object({
    orderId: Joi.string().custom(objectIdValidator).required(),
  }),
};
