import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Must be a valid email.',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required.',
  }),
});
