import { Joi, Segments } from "celebrate"

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}
