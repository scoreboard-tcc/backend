const Joi = require('joi');

const SearchAcademiesUseCase = require('./SearchAcademiesUseCase');
const { getPagination } = require('../../../utils/pagination');
const validateSchema = require('../../../utils/validation');

class SearchAcademiesController {
  /**
   * SearchAcademiesController
   *
   * @class
   * @param {object} container - Container
   * @param {SearchAcademiesUseCase} container.searchAcademiesUseCase - SearchAcademyUseCase
   */
  constructor({ searchAcademiesUseCase }) {
    this.searchAcademiesUseCase = searchAcademiesUseCase;
  }

  validate(request) {
    const schema = Joi.object({
      query: Joi.object({
        search: Joi.string()
          .max(255)
          .min(0),
      }),
    });

    validateSchema(schema, request);
  }

  async handle(request, response) {
    // this.validate(request);

    const pagination = getPagination(request);
    const { search = '' } = request.query;

    const academies = await this.searchAcademiesUseCase.execute(search, pagination);

    return response.status(200).json(academies);
  }
}

module.exports = SearchAcademiesController;
