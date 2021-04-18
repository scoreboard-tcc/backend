const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  name: Joi.string()
    .max(255)
    .required(),

  email: Joi.string()
    .email()
    .required(),
}).required();

class UpdateCoordinatorValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = UpdateCoordinatorValidator;
