const ScoreRepository = require('../../../repositories/scoreRepository');

class GetLogsUseCase {
  /**
   * GetLogsUseCase
   *
   * @param {object} container - Container
   * @param {ScoreRepository} container.scoreRepository - ScoreRepository
   * @param {GetMatchByIdUseCase} container.getMatchByIdUseCase - GetMatchByIdUseCase
   */
  constructor({ scoreRepository }) {
    this.scoreRepository = scoreRepository;
  }

  async execute(matchId, pagination) {
    return await this.scoreRepository.getLogsByMatchId(matchId, pagination);
  }
}

module.exports = GetLogsUseCase;
