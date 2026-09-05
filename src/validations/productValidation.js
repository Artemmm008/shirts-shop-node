import { Joi, Segments } from "celebrate"
import { isValidObjectId } from 'mongoose';

const ALLOWED_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "ONE SIZE"];

export const getAllProductsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(100).default(9),
    sortBy: Joi.string().valid("price", "createdAt", "title").default("createdAt"),
    order: Joi.string().valid("asc", "desc").default("desc"),
    search: Joi.string().trim().allow('').optional(),
    sizes: Joi.string().valid(...ALLOWED_SIZES).optional(),
    category: Joi.string().trim().optional(),
  }),
};

export const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message("Invalid id format") : value;
};

export const createProductSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().required().min(1),
    description: Joi.string().optional(),
    price: Joi.number().required().min(0),
    category: Joi.string().optional(),
    sizes: Joi.array().items(Joi.string().valid(...ALLOWED_SIZES)).required(),
    inStock: Joi.boolean().default(true),
  }),
};

export const productIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const updateProductSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().optional().min(1),
    price: Joi.number().optional().min(0),
    category: Joi.string().optional(),
    sizes: Joi.array().items(Joi.string().valid(...ALLOWED_SIZES)).optional(),
    inStock: Joi.boolean().default(true).optional(),
  }).min(1),
}
