const PlayerRepository = require('../../../repositories/playerRepository');
const SearchPlayersValidator = require('./SearchPlayersValidator');

class SearchPlayersUseCase {
  /**
   * SearchPlayersUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {SearchPlayersValidator} container.searchPlayersValidator
   * @param {PlayerRepository} container.playerRepository - PlayerRepository
   */
  constructor({ playerRepository, searchPlayersValidator }) {
    this.playerRepository = playerRepository;
    this.searchPlayersValidator = searchPlayersValidator;
  }

  async execute(request, academyId, pagination) {
    this.searchPlayersValidator.validate(request);

    if (request.onlyFromAcademy) {
      return this.searchPlayersOnAcademy(academyId, request.search, pagination);
    }
    return this.searchPlayersNotOnAcademy(academyId, request.search, pagination);
  }

  async searchPlayersOnAcademy(academyId, search, pagination) {
    return this.playerRepository.findByNameAndAcademyId(search, academyId, pagination);
  }

  async searchPlayersNotOnAcademy(academyId, search, pagination) {
    return this.playerRepository.findByNameAndNotOnAcademyById(search, academyId, pagination);
  }
}

module.exports = SearchPlayersUseCase;
