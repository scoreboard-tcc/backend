const BusinessException = require('../../../exceptions/BusinessException');
const MatchRepository = require('../../../repositories/matchRepository');
const CheckPinValidator = require('./CheckPinValidator');

class CheckPinUseCase {
  /**
   * CheckPinUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {CheckPinValidator} container.checkPinValidator
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository, checkPinValidator }) {
    this.matchRepository = matchRepository;
    this.checkPinValidator = checkPinValidator;
  }

  async execute(request) {
    this.checkPinValidator.validate(request);

    const match = await this.matchRepository.findByMatchIdAndPinAndIngame(request.matchId, request.pin);

    if (!match) {
      throw new BusinessException('Id da partida ou PIN incorreto(s)');
    }

    return {
      id: match.id,
      brokerTopic: match.brokerTopic,
    };
  }
}

module.exports = CheckPinUseCase;
