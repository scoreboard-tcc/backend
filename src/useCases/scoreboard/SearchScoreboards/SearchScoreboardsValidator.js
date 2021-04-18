const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.string().allow('').optional();

class SearchScoreboardsValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = SearchScoreboardsValidator;
