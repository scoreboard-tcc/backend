const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const BusinessException = require('../../../exceptions/BusinessException');
const AcademyRepository = require('../../../repositories/academyRepository');
const ScoreboardRepository = require('../../../repositories/scoreboardRepository');
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
   * @param {CreateScoreboardValidator} container.createScoreboardValidator
   * @param {ScoreboardRepository} container.scoreboardRepository - ScoreboardRepository
   */
  constructor({
    academyRepository, scoreboardRepository, getAcademyByIdUseCase, createScoreboardValidator,
  }) {
    this.academyRepository = academyRepository;
    this.scoreboardRepository = scoreboardRepository;
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
    this.createScoreboardValidator = createScoreboardValidator;
  }

  async execute(academyId, request) {
    this.createScoreboardValidator.validate(request);

    if (request.length) {
      this.validateRepeatedSerialNumber(request);
    }

    await this.getAcademyByIdUseCase.execute(academyId);

    const scoreboards = this.prepareScoreboardsForInsertion(academyId, request);

    const promises = scoreboards.map((scoreboard) => this.createScoreboard(scoreboard));

    return Promise.all(promises);
  }

  validateRepeatedSerialNumber(request) {
    const serialNumbers = request.map((scoreboard) => scoreboard.serialNumber);

    if (new Set(serialNumbers).size !== serialNumbers.length) {
      throw new BusinessException('O identificador único não pode repetir');
    }
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
