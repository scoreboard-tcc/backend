const Joi = require('joi');

module.exports = {
  id: Joi.number().required(),

  coordinator: Joi.object({
    name: Joi.string()
      .max(255)
      .required(),

    email: Joi.string()
      .email()
      .required(),
  }).required(),
};
