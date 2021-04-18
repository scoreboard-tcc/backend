const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.string().required();

class ChangeControlValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = ChangeControlValidator;
