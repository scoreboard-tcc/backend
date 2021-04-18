const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),
}).required();

class AuthenticateAdminValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = AuthenticateAdminValidator;
