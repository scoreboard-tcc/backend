const Joi = require('joi');

module.exports = Joi.object({
  matchId: Joi.number().required(),
  pin: Joi.string().required(),
}).required();
