const Joi = require('joi');

module.exports = Joi.object({
  search: Joi.string()
    .allow('')
    .max(255)
    .required(),

  onlyFromAcademy: Joi.boolean().optional(),
}).required();
