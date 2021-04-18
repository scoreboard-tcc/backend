const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.number().required();

class DeleteScoreboardValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = DeleteScoreboardValidator;
