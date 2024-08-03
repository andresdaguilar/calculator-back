const Joi = require('joi');

const registerUser = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
})

const updateBalanceDTO = Joi.object({
  user_id: Joi.number().integer().required().messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
    'any.required': 'User ID is required'
  }),
  new_balance: Joi.number().required().messages({
    'number.base': 'New Balance must be a number',
    'any.required': 'New Balance is required'
  })
});

module.exports = {
  registerUser,
  updateBalanceDTO
};