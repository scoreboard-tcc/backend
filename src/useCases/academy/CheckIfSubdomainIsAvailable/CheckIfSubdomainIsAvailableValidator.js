const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.string()
  .min(1)
  .max(50)
  .required();

class CheckIfSubdomainIsAvailableValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = CheckIfSubdomainIsAvailableValidator;
