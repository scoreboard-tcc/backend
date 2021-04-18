const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.string()
  .min(1)
  .max(255)
  .required();

class GetAcademyBySubdomainValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = GetAcademyBySubdomainValidator;
