const Joi = require('joi');

const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .required(),

  subdomain: Joi.string()
    .min(1)
    .max(255)
    .required(),

  address: Joi.string()
    .min(1)
    .max(255)
    .required(),

  additionalInfo: Joi.string()
    .max(2000),
}).required();

class UpdateAcademyValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = UpdateAcademyValidator;
