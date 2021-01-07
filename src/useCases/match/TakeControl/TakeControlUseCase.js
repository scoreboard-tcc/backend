const { v4: uuid } = require('uuid');
const NotFoundException = require('../../../exceptions/NotFoundException');
const MatchRepository = require('../../../repositories/matchRepository');
const validateSchema = require('../../../utils/validation');
const IncrementControllerSequenceUseCase = require('../IncrementControllerSequence/IncrementControllerSequenceUseCase');
const TakeControlValidator = require('./TakeControlValidator');

class TakeControlUseCase {
  /**
   * TakeControlUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {IncrementControllerSequenceUseCase} container.incrementControllerSequenceUseCase - IncrementControllerSequenceUseCase
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({
    matchRepository, incrementControllerSequenceUseCase,
  }) {
    this.matchRepository = matchRepository;
    this.incrementControllerSequenceUseCase = incrementControllerSequenceUseCase;
  }

  validate(matchId) {
    validateSchema(TakeControlValidator, { matchId });
  }

  async execute(academyId, matchId) {
    this.validate(matchId);

    const match = await this.matchRepository.findByAcademyIdAndMatchId(academyId, matchId);

    if (!match) {
      throw new NotFoundException('partida', 'id', matchId);
    }

    return {
      ...await this.generateNewTokens(match),
      controllerSequence: await this.getControllerSequence(match),
    };
  }

  async generateNewTokens(match) {
    const publishToken = uuid();
    const refreshToken = uuid();

    await this.matchRepository.updateTokens(match.id, { publishToken, refreshToken });

    return {
      publishToken,
      refreshToken,
    };
  }

  async getControllerSequence(match) {
    return this.incrementControllerSequenceUseCase.execute({
      id: match.id,
      topic: match.brokerTopic,
    });
  }
}

module.exports = TakeControlUseCase;
