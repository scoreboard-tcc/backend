/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const AcademyRepository = require('../../../repositories/academyRepository');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');
const validateSchema = require('../../../utils/validation');
const CreateScoreboardValidator = require('./CreateScoreboardValidator');

class CreateScoreboardUseCase {
  /**
   * CreateAcademyController
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   */
  constructor({ academyRepository, scoreboardRepository }) {
    this.academyRepository = academyRepository;
    this.scoreboardRepository = scoreboardRepository;
  }

  validate(scoreboard) {
    validateSchema(CreateScoreboardValidator, scoreboard);
  }

  async execute(academyId, scoreboardPayload) {
    this.validate(scoreboardPayload);

    await this.checkIfAcademyExists(academyId);

    const scoreboards = this.prepareScoreboardsForInsertion(academyId, scoreboardPayload);

    for (const scoreboard of scoreboards) { await this.createScoreboard(scoreboard); }
  }

  prepareScoreboardsForInsertion(academyId, scoreboardPayload) {
    const scoreboards = Array.isArray(scoreboardPayload) ? scoreboardPayload : [scoreboardPayload];

    return scoreboards
      .map((scoreboard) => ({
        serialNumber: scoreboard.serialNumber,
        description: scoreboard.description,
        staticToken: scoreboard.staticToken,
        academyId,
      }));
  }

  async checkIfAcademyExists(id) {
    const academy = await this.academyRepository.findById(id);

    if (!academy) throw new NotFoundException('Academia', 'id', id);
  }

  async createScoreboard(scoreboard) {
    await this.checkIfSerialNumberIsAvailable(scoreboard.serialNumber);

    await this.scoreboardRepository.create(scoreboard);
  }

  async checkIfSerialNumberIsAvailable(serialNumber) {
    const scoreboard = await this.scoreboardRepository.findBySerialNumberAndActive(serialNumber);

    if (scoreboard) throw new AlreadyUsedException('Placar', 'Identificador único', serialNumber);
  }
}

module.exports = CreateScoreboardUseCase;
