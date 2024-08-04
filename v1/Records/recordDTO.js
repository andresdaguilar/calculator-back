const Joi = require('joi');

const idSchema = Joi.number().integer().min(1).required().messages({
  'number.base': 'ID must be a number',
  'number.integer': 'ID must be an integer',
  'number.min': 'ID must be greater than 1',
  'any.required': 'ID is required'
});

const createRecordSchema = Joi.object({
  operation_id: Joi.number().integer().required().messages({
    'number.base': 'Operation ID must be a number',
    'number.integer': 'Operation ID must be an integer',
    'any.required': 'Operation ID is required'
  }),
  amount: Joi.number().required().messages({
    'number.base': 'Amount must be a number',
    'any.required': 'Amount is required'
  }),
  amount2: Joi.number().required().messages({
    'number.base': 'Amount2 must be a number',
    'any.required': 'Amount2 is required'
  })
})

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1'
  }),
  size: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Size must be a number',
    'number.integer': 'Size must be an integer',
    'number.min': 'Size must be at least 1',
    'number.max': 'Size cannot be more than 100'
  }),
  search: Joi.string().optional().messages({
    'string.base': 'Search must be a string'
  }),
  filter: Joi.string().optional().messages({
    'string.base': 'Filter must be a string'
  }),
  sortField: Joi.string().optional().valid('operation_id', 'amount', 'amount2', 'user_id', 'user_balance', 'operation_response', 'date').default('date').messages({
    'string.base': 'SortField must be a string',
    'any.only': 'SortField must be one of "operation_id", "amount", "amount2", "user_id", "user_balance", "operation_response", or "date"'
  }),
  sortOrder: Joi.string().valid('asc', 'desc').optional().default('asc').messages({
    'string.base': 'SortOrder must be a string',
    'any.only': 'SortOrder must be either "asc" or "desc"'
  })
});

module.exports = {
  idSchema,
  createRecordSchema,
  querySchema
};