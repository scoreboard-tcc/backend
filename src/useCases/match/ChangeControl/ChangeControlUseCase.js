const { addMinutes } = require('date-fns');
const { v4: uuid } = require('uuid');
const NotFoundException = require('../../../exceptions/NotFoundException');
const MatchRepository = require('../../../repositories/matchRepository');
const validateSchema = require('../../../utils/validation');
const IncrementControllerSequenceUseCase = require('../IncrementControllerSequence/IncrementControllerSequenceUseCase');
const ChangeControlValidator = require('./ChangeControlValidator');

class ChangeControlUseCase {
  /**
   * ChangeControlUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {IncrementControllerSequenceUseCase} container.incrementControllerSequenceUseCase - IncrementControllerSequenceUseCase
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository, incrementControllerSequenceUseCase }) {
    this.matchRepository = matchRepository;
    this.incrementControllerSequenceUseCase = incrementControllerSequenceUseCase;
  }

  validate(refreshToken) {
    validateSchema(ChangeControlValidator, refreshToken);
  }

  async execute(refreshToken) {
    this.validate(refreshToken);

    const match = await this.matchRepository.findByRefreshToken(refreshToken);

    if (!match) {
      throw new NotFoundException('partida', 'token', refreshToken);
    }

    const tokenExpiration = addMinutes(new Date(match.startedAt), match.duration);

    return {
      ...await this.generateNewTokens(match),
      controllerSequence: await this.getControllerSequence(match),
      brokerTopic: match.brokerTopic,
      expirationDate: tokenExpiration,
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

module.exports = ChangeControlUseCase;
