const { getPagination } = require('../../../utils/pagination');
const SearchPlayersUseCase = require('./SearchPlayersUseCase');

class SearchPlayersController {
  /**
   * SearchPlayersController
   *
   * @class
   * @param {object} container - Container
   * @param {SearchPlayersUseCase} container.searchPlayersUseCase - searchPlayersUseCase
   */
  constructor({ searchPlayersUseCase }) {
    this.searchPlayersUseCase = searchPlayersUseCase;
  }

  async handle(request, response) {
    const pagination = getPagination(request);
    const { search = '' } = request.query;

    const players = await this.searchPlayersUseCase.execute(search, pagination);

    return response.status(200).json(players);
  }
}

module.exports = SearchPlayersController;
