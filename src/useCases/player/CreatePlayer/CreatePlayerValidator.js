const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  name: Joi.string()
    .max(255)
    .required(),

  email: Joi.string()
    .email()
    .required(),
});
class CreatePlayerValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = CreatePlayerValidator;
