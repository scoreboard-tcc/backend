const Joi = require('joi');

module.exports = Joi.object({
  serialNumber: Joi.string()
    .max(255)
    .required(),

  description: Joi.string()
    .max(255)
    .required(),

  staticToken: Joi.string()
    .max(255)
    .required(),
});
