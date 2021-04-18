const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.number().required();

class DeleteCoordinatorValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = DeleteCoordinatorValidator;
