const NotFoundException = require('../../../exceptions/NotFoundException');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');
const validateSchema = require('../../../utils/validation');
const DeleteScoreboardValidator = require('./DeleteScoreboardValidator');

class DeleteScoreboardUseCase {
  /**
   * DeleteScoreboardUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   */
  constructor({ scoreboardRepository }) {
    this.scoreboardRepository = scoreboardRepository;
  }

  validate(id) {
    validateSchema(DeleteScoreboardValidator, id);
  }

  async execute(id) {
    this.validate(id);

    await this.checkIfScoreboardExists(id);

    await this.scoreboardRepository.delete(id);
  }

  async checkIfScoreboardExists(id) {
    const scoreboard = await this.scoreboardRepository.findByIdAndActive(id);

    if (!scoreboard) throw new NotFoundException('placar', 'id', id);
  }
}

module.exports = DeleteScoreboardUseCase;
