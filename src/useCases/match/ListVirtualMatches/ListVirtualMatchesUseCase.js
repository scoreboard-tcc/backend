const MatchRepository = require('../../../repositories/matchRepository');

class ListVirtualMatchesUseCase {
  /**
   * ListVirtualMatchesUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository }) {
    this.matchRepository = matchRepository;
  }

  async execute(academyId) {
    return this.matchRepository.findIngameVirtualMatchesByAcademyId(academyId);
  }
}

module.exports = ListVirtualMatchesUseCase;
