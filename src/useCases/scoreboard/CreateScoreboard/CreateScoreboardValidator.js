const Joi = require('joi');

const validateSchema = require('../../../utils/validation');
const schema = require('./CreateScoreboardValidatorSchema');

class CreateScoreboardValidator {
  validate(data) {
    return validateSchema(Joi.alternatives().try(
      schema,
      Joi.array().items(schema),
    ), data);
  }
}

module.exports = CreateScoreboardValidator;
