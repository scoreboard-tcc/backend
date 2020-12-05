const Joi = require('joi');

module.exports = {
  academyId: Joi.number().required(),
  search: Joi.string().allow('').optional(),
};
