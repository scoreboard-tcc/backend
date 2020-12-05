const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const AcademyRepository = require('../../../repositories/academyRepository');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');
const validateSchema = require('../../../utils/validation');
const GetAcademyByIdUseCase = require('../../academy/GetAcademyById/GetAcademyByIdUseCase');
const CreateScoreboardValidator = require('./CreateScoreboardValidator');

class CreateScoreboardUseCase {
  /**
   * CreateScoreboardUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {GetAcademyByIdUseCase} container.getAcademyByIdUseCase - GetAcademyByIdUseCase
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   */
  constructor({ academyRepository, scoreboardRepository, getAcademyByIdUseCase }) {
    this.academyRepository = academyRepository;
    this.scoreboardRepository = scoreboardRepository;
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
  }

  validate(request) {
    validateSchema(CreateScoreboardValidator, request);
  }

  async execute(academyId, request) {
    this.validate(request);

    await this.getAcademyByIdUseCase.execute(academyId);

    const scoreboards = this.prepareScoreboardsForInsertion(academyId, request);

    const promises = scoreboards.map((scoreboard) => this.createScoreboard(scoreboard));

    return Promise.all(promises);
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

  async createScoreboard(scoreboard) {
    await this.checkIfSerialNumberIsAvailable(scoreboard.serialNumber);

    const [id] = await this.scoreboardRepository.create(scoreboard);
    return id;
  }

  async checkIfSerialNumberIsAvailable(serialNumber) {
    const scoreboard = await this.scoreboardRepository.findBySerialNumberAndActive(serialNumber);

    if (scoreboard) throw new AlreadyUsedException('Placar', 'identificador único', serialNumber);
  }
}

module.exports = CreateScoreboardUseCase;
