const Joi = require('joi');

const validateSchema = require('../../../utils/validation');

const schema = Joi.string()
  .allow('')
  .max(255)
  .required();

class SearchAcademiesValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = SearchAcademiesValidator;
