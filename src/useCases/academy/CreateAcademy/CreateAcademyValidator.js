const Joi = require('joi');
const validateSchema = require('../../../utils/validation');
const CreateCoordinatorValidatorSchema = require('../../coordinator/CreateCoordinator/CreateCoordinatorValidatorSchema');
const CreateScoreboardValidatorSchema = require('../../scoreboard/CreateScoreboard/CreateScoreboardValidatorSchema');

const schema = Joi.object({
  name: Joi.string()
    .max(255)
    .required(),

  subdomain: Joi.string()
    .max(255)
    .required(),

  address: Joi.string()
    .max(255),

  scoreboards: Joi.array()
    .optional()
    .items(CreateScoreboardValidatorSchema)
    .max(20),

  coordinator: CreateCoordinatorValidatorSchema
    .required(),

  logo: Joi.any().required(),
});

class CreateAcademyValidator {
  validate(data) {
    return validateSchema(schema, data);
  }
}

module.exports = CreateAcademyValidator;
