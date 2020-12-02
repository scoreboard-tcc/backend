const Joi = require('joi');

module.exports = Joi.string()
  .max(255)
  .required();
