const Joi = require('joi');

module.exports = Joi.object({
  id: Joi.number().required(),

  academy: Joi.object({
    name: Joi.string()
      .max(255)
      .required(),

    subdomain: Joi.string()
      .max(255)
      .required(),

    address: Joi.string()
      .max(255)
      .required(),
  }).required(),

});
