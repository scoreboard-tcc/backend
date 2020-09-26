const Joi = require('joi');

module.exports = Joi.object({
  academyId: Joi.number().required(),
  search: Joi.string().allow('').optional(),
});
