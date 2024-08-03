const Joi = require('joi');

const createRecordSchema = Joi.object({
  operation_id: Joi.number().integer().required(),
  amount: Joi.number().required(),
  amount2: Joi.number().required(),
})

module.exports = {
  createRecordSchema,
};