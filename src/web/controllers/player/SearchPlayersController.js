const SearchPlayersUseCase = require('../../../useCases/player/SearchPlayers/SearchPlayersUseCase');
const { getPagination } = require('../../../utils/pagination');

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
    const { id: academyId } = response.locals.user.academy;
    const pagination = getPagination(request);

    const payload = {
      search: request.query.search,
      onlyFromAcademy: request.query.onlyFromAcademy === 'true',
    };

    const players = await this.searchPlayersUseCase.execute(payload, academyId, pagination);

    return response.status(200).json(players);
  }
}

module.exports = SearchPlayersController;
