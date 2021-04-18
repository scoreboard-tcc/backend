const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  id: Joi.number().required(),
}).required();

class FinishMatchValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = FinishMatchValidator;
