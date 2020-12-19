const Joi = require('joi');

module.exports = Joi.object({
  scoreboardId: Joi.number(),

  duration: Joi.number()
    .min(15)
    .max(60 * 5)
    .required(),

  player1Id: Joi.number(),

  player2Id: Joi.number(),

  player1Name: Joi.string(),

  player2Name: Joi.string(),

  listed: Joi.boolean()
    .required(),

  pin: Joi.string(),
}).required();
