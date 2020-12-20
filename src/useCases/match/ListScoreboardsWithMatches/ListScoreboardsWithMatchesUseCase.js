const ScoreboardRepository = require('../../../repositories/scoreboardRepository');

class ListScoreboardWithMatchesUseCase {
  /**
   * ListScoreboardWithMatchesUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   */
  constructor({ scoreboardRepository }) {
    this.scoreboardRepository = scoreboardRepository;
  }

  async execute(academyId) {
    return this.scoreboardRepository.findByAcademyIdWithMatches(academyId);
  }
}

module.exports = ListScoreboardWithMatchesUseCase;
