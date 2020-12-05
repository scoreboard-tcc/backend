const Joi = require('joi');

const scoreboardSchema = Joi.object({
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

module.exports = Joi.alternatives().try(
  scoreboardSchema,
  Joi.array().items(scoreboardSchema),
);
