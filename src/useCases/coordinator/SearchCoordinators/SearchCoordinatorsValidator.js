const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  academyId: Joi.number().required(),
  search: Joi.string().allow('').optional(),
});

class SearchCoordinatorsValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = SearchCoordinatorsValidator;
