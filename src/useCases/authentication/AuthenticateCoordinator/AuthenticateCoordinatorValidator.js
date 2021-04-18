const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),

  academySubdomain: Joi.string()
    .max(255)
    .required(),
}).required();

class AuthenticateCoordinatorValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = AuthenticateCoordinatorValidator;
