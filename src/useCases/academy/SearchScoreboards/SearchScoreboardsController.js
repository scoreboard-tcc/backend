const SearchScoreboardsUseCase = require('./SearchScoreboardsUseCase');
const { getPagination } = require('../../../utils/pagination');

class SearchScoreboardsController {
  /**
   * SearchScoreboardsController
   *
   * @class
   * @param {object} container - Container
   * @param {SearchScoreboardsUseCase} container.searchScoreboardsUseCase - SearchAcademyUseCase
   */
  constructor({ searchScoreboardsUseCase }) {
    this.searchScoreboardsUseCase = searchScoreboardsUseCase;
  }

  async handle(request, response) {
    const pagination = getPagination(request);
    const { id } = request.params;
    const { search = '' } = request.query;

    const academies = await this.searchScoreboardsUseCase.execute(Number(id), search, pagination);

    return response.status(200).json(academies);
  }
}

module.exports = SearchScoreboardsController;
