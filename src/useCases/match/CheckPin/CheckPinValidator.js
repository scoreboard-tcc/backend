const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  matchId: Joi.number().required(),
  pin: Joi.string().required(),
}).required();

class CheckPinValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = CheckPinValidator;
