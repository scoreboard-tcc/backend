const Joi = require('joi');

module.exports = {
  player: Joi.object({
    name: Joi.string()
      .max(255)
      .required(),

    email: Joi.string()
      .email()
      .required(),
  }),

  academyId: Joi.number().optional(),
};
