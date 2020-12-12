const PlayerRepository = require('../../../repositories/playerRepository');
const validateSchema = require('../../../utils/validation');
const SearchPlayersValidator = require('./SearchPlayersValidator');

class SearchPlayersUseCase {
  /**
   * SearchPlayersUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {PlayerRepository} container.playerRepository - PlayerRepository
   */
  constructor({ playerRepository }) {
    this.playerRepository = playerRepository;
  }

  validate(request) {
    validateSchema(SearchPlayersValidator, request);
  }

  async execute(request, academyId, pagination) {
    this.validate(request);

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
