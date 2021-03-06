const Joi = require('joi');

module.exports = Joi.object({
  scoreboardId: Joi.number().allow(null),

  player1Id: Joi.number().allow(null),

  player2Id: Joi.number().allow(null),

  player1Name: Joi.string().allow(null),

  player2Name: Joi.string().allow(null),

  listed: Joi.boolean()
    .required(),

  pin: Joi.string().allow(''),

  tieBreakType: Joi.valid('REGULAR', 'TEN_POINTS').required(),

  scoringType: Joi.valid('BASIC', 'ADVANCED').required(),

  hasAdvantage: Joi.boolean().required(),

}).required();
