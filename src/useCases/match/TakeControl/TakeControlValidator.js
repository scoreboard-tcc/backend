const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.number().required();

class TakeControlValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = TakeControlValidator;
