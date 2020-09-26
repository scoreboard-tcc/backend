const Joi = require('joi');

module.exports = Joi.object({
  params: Joi.object({
    subdomain: Joi.string().required(),
  })
    .required(),
});
