const BusinessException = require('../../../exceptions/BusinessException');
const EnrollmentRepository = require('../../../repositories/enrollmentRepository');
const validateSchema = require('../../../utils/validation');
const UnlinkPlayerFromAcademyValidator = require('./UnlinkPlayerFromAcademyValidator');

class UnlinkPlayerFromAcademyUseCase {
  /**
   * UnlinkPlayerFromAcademyUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {EnrollmentRepository} container.enrollmentRepository - EnrollmentRepository
   */
  constructor({
    enrollmentRepository,
  }) {
    this.enrollmentRepository = enrollmentRepository;
  }

  validate(request) {
    validateSchema(UnlinkPlayerFromAcademyValidator, request);
  }

  async execute(request) {
    this.validate(request);

    await this.checkIfPlayerIsLinkedToAcademy(request.playerId, request.academyId);
    await this.unlinkPlayerFromAcademy(request.playerId, request.academyId);
  }

  async checkIfPlayerIsLinkedToAcademy(playerId, academyId) {
    const enrollment = await this.enrollmentRepository.findByAcademyIdAndPlayerId(academyId, playerId);

    if (!enrollment) {
      throw new BusinessException('O jogador não está vinculado à academia.');
    }
  }

  async unlinkPlayerFromAcademy(playerId, academyId) {
    return this.enrollmentRepository.delete(academyId, playerId);
  }
}

module.exports = UnlinkPlayerFromAcademyUseCase;
