const Joi = require('joi');

module.exports = Joi.object({
  playerId: Joi.number().required(),
  academyId: Joi.number().required(),
}).required();
