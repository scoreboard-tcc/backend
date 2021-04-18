const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  serialNumber: Joi.string()
    .max(255)
    .required(),

  description: Joi.string()
    .max(255)
    .required(),

  staticToken: Joi.string()
    .max(255)
    .required(),
}).required();

class UpdateScoreboardValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = UpdateScoreboardValidator;
