const Joi = require('joi');

module.exports = Joi.string()
  .min(1)
  .max(50)
  .required();
