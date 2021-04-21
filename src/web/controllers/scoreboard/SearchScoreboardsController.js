const SearchScoreboardsUseCase = require('../../../useCases/scoreboard/SearchScoreboards/SearchScoreboardsUseCase');
const { getPagination } = require('../../../utils/pagination');

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
    const { search = '', academyId } = request.query;

    const scoreboards = await this.searchScoreboardsUseCase.execute(
      Number(academyId),
      search,
      pagination,
    );

    return response.status(200).json(scoreboards);
  }
}

module.exports = SearchScoreboardsController;
