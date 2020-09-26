const Joi = require('joi');

module.exports = Joi.object({
  params: Joi.object({
    id: Joi.number().required(),
  })
    .required(),
});
