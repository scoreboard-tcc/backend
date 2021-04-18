const { v4: uuid } = require('uuid');
const NotFoundException = require('../../../exceptions/NotFoundException');
const MatchRepository = require('../../../repositories/matchRepository');
const IncrementControllerSequenceUseCase = require('../IncrementControllerSequence/IncrementControllerSequenceUseCase');
const TakeControlValidator = require('./TakeControlValidator');

class TakeControlUseCase {
  /**
   * TakeControlUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {IncrementControllerSequenceUseCase} container.incrementControllerSequenceUseCase - IncrementControllerSequenceUseCase
   * @param {TakeControlValidator} container.takeControlValidator
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({
    matchRepository, incrementControllerSequenceUseCase, takeControlValidator,
  }) {
    this.matchRepository = matchRepository;
    this.incrementControllerSequenceUseCase = incrementControllerSequenceUseCase;
    this.takeControlValidator = takeControlValidator;
  }

  async execute(academyId, matchId) {
    this.takeControlValidator.validate(matchId);

    const match = await this.matchRepository.findByAcademyIdAndMatchIdAndIngame(academyId, matchId);

    if (!match) {
      throw new NotFoundException('partida', 'id', matchId);
    }

    return {
      ...await this.generateNewTokens(match),
      controllerSequence: await this.getControllerSequence(match),
      brokerTopic: match.brokerTopic,
      matchId: match.id,
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
