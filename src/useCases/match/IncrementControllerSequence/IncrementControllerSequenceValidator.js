const Joi = require('joi');

module.exports = Joi.object({
  id: Joi.number().required(),
  topic: Joi.string().required(),
}).required();
