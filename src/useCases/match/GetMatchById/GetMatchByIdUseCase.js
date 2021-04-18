const NotFoundException = require('../../../exceptions/NotFoundException');
const MatchRepository = require('../../../repositories/matchRepository');
const ScoreRepository = require('../../../repositories/scoreRepository');
const GetMatchByIdValidator = require('./GetMatchByIdValidator');

class GetMatchByIdUseCase {
  /**
   * GetMatchByIdUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {ScoreRepository} container.scoreRepository - ScoreRepository
   * @param {GetMatchByIdValidator} container.getMatchByIdValidator
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository, scoreRepository, getMatchByIdValidator }) {
    this.matchRepository = matchRepository;
    this.scoreRepository = scoreRepository;
    this.getMatchByIdValidator = getMatchByIdValidator;
  }

  async execute(matchId, academyId) {
    this.getMatchByIdValidator.validate(matchId);

    const isCoordinator = await this.checkIfIsCoordinator(matchId, academyId);

    const match = await this.matchRepository.findByMatchIdAndIngame(matchId, isCoordinator);

    if (!match) {
      throw new NotFoundException('partida', 'id', matchId);
    }

    const matchLog = await this.scoreRepository.findMatchLogByMatchId(match.id);

    if (!matchLog) {
      throw new NotFoundException('estatísticas', 'id', matchId);
    }

    return {
      ...match,
      canUndo: matchLog.remainingUndos > 0,
      canRedo: matchLog.remainingRedos > 0,
    };
  }

  async checkIfIsCoordinator(matchId, academyId) {
    if (!academyId) {
      return false;
    }

    return await this.matchRepository.findByAcademyIdAndMatchIdAndIngame(academyId, matchId) !== null;
  }
}

module.exports = GetMatchByIdUseCase;
