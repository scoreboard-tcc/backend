const NotFoundException = require('../../../exceptions/NotFoundException');
const MatchRepository = require('../../../repositories/matchRepository');
const validateSchema = require('../../../utils/validation');
const GetMatchByIdValidator = require('./GetMatchByIdValidator');

class GetMatchByIdUseCase {
  /**
   * GetMatchByIdUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository }) {
    this.matchRepository = matchRepository;
  }

  validate(request) {
    validateSchema(GetMatchByIdValidator, request);
  }

  async execute(matchId) {
    this.validate(matchId);

    const match = await this.matchRepository.findByMatchIdAndIngame(matchId);

    if (!match) {
      throw new NotFoundException('partida', 'id', matchId);
    }

    return match;
  }
}

module.exports = GetMatchByIdUseCase;
