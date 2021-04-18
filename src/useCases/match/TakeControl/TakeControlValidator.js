const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  matchId: Joi.number().required(),
}).required();

class TakeControlValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = TakeControlValidator;
