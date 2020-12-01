const Joi = require('joi');
const CreateScoreboardValidator = require('../../scoreboard/CreateScoreboard/CreateScoreboardValidator');
const CreateCoordinatorValidator = require('../../coordinator/CreateCoordinator/CreateCoordinatorValidator');

module.exports = Joi.object({
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
    .items(CreateScoreboardValidator)
    .max(20),

  coordinator: CreateCoordinatorValidator
    .required(),
});
