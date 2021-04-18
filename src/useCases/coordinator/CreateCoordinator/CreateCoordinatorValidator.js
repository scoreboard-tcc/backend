const validateSchema = require('../../../utils/validation');

const schema = require('./CreateCoordinatorValidatorSchema');

class CreateCoordinatorValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = CreateCoordinatorValidator;
