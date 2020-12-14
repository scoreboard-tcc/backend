const Joi = require('joi');

module.exports = {
  id: Joi.number().required(),

  academy: Joi.object({
    name: Joi.string()
      .min(1)
      .max(255)
      .required(),

    subdomain: Joi.string()
      .min(1)
      .max(255)
      .required(),

    address: Joi.string()
      .min(1)
      .max(255)
      .required(),

    additionalInfo: Joi.string()
      .max(2000),

    logo: Joi.any().required(),
  }).required(),
};
