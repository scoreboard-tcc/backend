const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');
const UpdateScoreboardValidator = require('./UpdateScoreboardValidator');

class UpdateScoreboardUseCase {
  /**
   * UpdateScoreboardUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {UpdateScoreboardValidator} container.updateScoreboardValidator
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   */
  constructor({ scoreboardRepository, updateScoreboardValidator }) {
    this.scoreboardRepository = scoreboardRepository;
    this.updateScoreboardValidator = updateScoreboardValidator;
  }

  async execute(id, request) {
    this.updateScoreboardValidator.validate(request);

    await this.checkIfScoreboardExists(id);
    await this.checkIfSerialNumberIsAvailable(request.serialNumber, id);

    await this.scoreboardRepository.update(id, {
      serialNumber: request.serialNumber,
      description: request.description,
      staticToken: request.staticToken,
    });
  }

  async checkIfScoreboardExists(id) {
    const scoreboard = await this.scoreboardRepository.findByIdAndActive(id);

    if (!scoreboard) throw new NotFoundException('placar', 'id', id);
  }

  async checkIfSerialNumberIsAvailable(serialNumber, scoreboardId) {
    const scoreboard = await this.scoreboardRepository.findBySerialNumberAndActive(serialNumber);

    if (scoreboard && scoreboardId !== scoreboard.id) throw new AlreadyUsedException('placar', 'identificador único', serialNumber);
  }
}

module.exports = UpdateScoreboardUseCase;
