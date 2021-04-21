const SearchAcademiesUseCase = require('../../../useCases/academy/SearchAcademies/SearchAcademiesUseCase');
const { getPagination } = require('../../../utils/pagination');

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

  async handle(request, response) {
    const pagination = getPagination(request);
    const { search = '' } = request.query;

    const academies = await this.searchAcademiesUseCase.execute(search, pagination);

    return response.status(200).json(academies);
  }
}

module.exports = SearchAcademiesController;
