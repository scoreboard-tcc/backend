const { getPagination } = require('../../../utils/pagination');
const SearchScoreboardsUseCase = require('./SearchScoreboardsUseCase');

class SearchScoreboardsController {
  /**
   * SearchScoreboardsController
   *
   * @class
   * @param {object} container - Container
   * @param {SearchScoreboardsUseCase} container.searchScoreboardsUseCase - SearchScoreboardsUseCase
   */
  constructor({ searchScoreboardsUseCase }) {
    this.searchScoreboardsUseCase = searchScoreboardsUseCase;
  }

  async handle(request, response) {
    const pagination = getPagination(request);
    const { id: scoreboardId } = request.params;
    const { search = '' } = request.query;

    const scoreboards = await this.searchScoreboardsUseCase.execute(
      Number(scoreboardId),
      search,
      pagination,
    );

    return response.status(200).json(scoreboards);
  }
}

module.exports = SearchScoreboardsController;
