const Joi = require('joi');
const validateSchema = require('../../../utils/validation');

const schema = Joi.object({
  playerId: Joi.number().required(),
  academyId: Joi.number().required(),
}).required();

class UnlinkPlayerFromAcademyValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = UnlinkPlayerFromAcademyValidator;
