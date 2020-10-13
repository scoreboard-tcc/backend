const Joi = require('joi');
const CreateCoordinatorValidator = require('../CreateCoordinator/CreateCoordinatorValidator');
const CreateScoreboardValidator = require('../CreateScoreboard/CreateScoreboardValidator');

module.exports = Joi.object({
  name: Joi.string()
    .max(255)
    .required(),

  subdomain: Joi.string()
    .max(255)
    .required(),

  address: Joi.string()
    .max(255),

  scoreboards: Joi.array().optional().items(CreateScoreboardValidator)
    .max(20),

  coordinator: CreateCoordinatorValidator
    .required(),
});
