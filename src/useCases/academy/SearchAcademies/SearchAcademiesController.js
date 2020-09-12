const Joi = require('joi');

const SearchAcademiesUseCase = require('./SearchAcademiesUseCase');
const { getPagination } = require('../../../utils/pagination');
const validate = require('../../../utils/validation');

class SearchAcademiesController {
  /**
   * SearchAcademiesController
   *
   * @class
   * @param {SearchAcademiesUseCase} searchAcademiesUseCase - searchAcademiesUseCase
   */
  constructor(searchAcademiesUseCase) {
    this.searchAcademiesUseCase = searchAcademiesUseCase;
  }

  validate(request) {
    const schema = Joi.object({
      query: Joi.object({
        search: Joi.string()
          .max(255),
      }),
    });

    validate(schema, request);
  }

  async handle(request, response) {
    this.validate(request);

    const pagination = getPagination(request);
    const { search = '' } = request.query;

    const academies = await this.searchAcademiesUseCase.execute(search, pagination);

    return response.status(200).json(academies);
  }
}

module.exports = SearchAcademiesController;
