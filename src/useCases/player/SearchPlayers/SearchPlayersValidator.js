const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  search: Joi.string()
    .allow('')
    .max(255)
    .required(),

  onlyFromAcademy: Joi.boolean().optional(),
}).required();

class SearchPlayersValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = SearchPlayersValidator;
