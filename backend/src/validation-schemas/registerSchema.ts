import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Must be a valid email.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 8 characters long.',
  }),
  firstName: Joi.string().required().messages({
    'string.empty': 'First name is required.',
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Last name is required.',
  }),
});
