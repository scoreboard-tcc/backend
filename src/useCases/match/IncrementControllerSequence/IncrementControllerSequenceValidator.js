const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  id: Joi.number().required(),
  topic: Joi.string().required(),
}).required();

class IncrementControllerSequenceValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = IncrementControllerSequenceValidator;
