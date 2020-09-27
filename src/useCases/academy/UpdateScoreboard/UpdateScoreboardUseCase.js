const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');
const validateSchema = require('../../../utils/validation');
const UpdateScoreboardValidator = require('./UpdateScoreboardValidator');

class UpdateScoreboardUseCase {
  /**
   * UpdateScoreboardUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   */
  constructor({ scoreboardRepository }) {
    this.scoreboardRepository = scoreboardRepository;
  }

  validate(id) {
    validateSchema(UpdateScoreboardValidator, id);
  }

  async execute(id, scoreboard) {
    this.validate({ id, scoreboard });

    await this.checkIfScoreboardExists(id);
    await this.checkIfSerialNumberIsAvailable(scoreboard.serialNumber, id);

    await this.scoreboardRepository.update(id, scoreboard);
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
