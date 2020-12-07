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

  validate(name) {
    validateSchema(SearchPlayersValidator, name);
  }

  async execute(name, pagination) {
    this.validate(name);

    return this.playerRepository.findByName(name, pagination);
  }
}

module.exports = SearchPlayersUseCase;
