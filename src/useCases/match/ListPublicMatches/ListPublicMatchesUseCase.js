const MatchRepository = require('../../../repositories/matchRepository');

class ListPublicMatchesUseCase {
  /**
   * ListPublicMatchesUseCase
   *
   * @class
   * @param {object} container - Container
   * @param  {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository }) {
    this.matchRepository = matchRepository;
  }

  async execute(academyId) {
    return this.matchRepository.findListedInGameMatchesByAcademyId(academyId);
  }
}

module.exports = ListPublicMatchesUseCase;
