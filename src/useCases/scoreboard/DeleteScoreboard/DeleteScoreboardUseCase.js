const NotFoundException = require('../../../exceptions/NotFoundException');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');
const DeleteScoreboardValidator = require('./DeleteScoreboardValidator');

class DeleteScoreboardUseCase {
  /**
   * DeleteScoreboardUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {DeleteScoreboardValidator}  container.deleteScoreboardValidator
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   */
  constructor({ scoreboardRepository, deleteScoreboardValidator }) {
    this.scoreboardRepository = scoreboardRepository;
    this.deleteScoreboardValidator = deleteScoreboardValidator;
  }

  async execute(id) {
    this.deleteScoreboardValidator.validate(id);

    await this.checkIfScoreboardExists(id);

    await this.scoreboardRepository.delete(id);
  }

  async checkIfScoreboardExists(id) {
    const scoreboard = await this.scoreboardRepository.findByIdAndActive(id);

    if (!scoreboard) throw new NotFoundException('placar', 'id', id);
  }
}

module.exports = DeleteScoreboardUseCase;
