const Joi = require('joi');

module.exports = Joi.string()
  .allow('')
  .max(255)
  .required();
