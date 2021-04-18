const BusinessException = require('../../../exceptions/BusinessException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const EnrollmentRepository = require('../../../repositories/enrollmentRepository');
const PlayerRepository = require('../../../repositories/playerRepository');
const GetAcademyByIdUseCase = require('../../academy/GetAcademyById/GetAcademyByIdUseCase');
const LinkPlayerToAcademyValidator = require('./LinkPlayerToAcademyValidator');

class LinkPlayerToAcademyUseCase {
  /**
   * LinkPlayerToAcademyUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {PlayerRepository} container.playerRepository - PlayerRepository
   * @param {EnrollmentRepository} container.enrollmentRepository - EnrollmentRepository
   * @param {LinkPlayerToAcademyValidator} container.linkPlayerToAcademyValidator
   * @param {GetAcademyByIdUseCase} container.getAcademyByIdUseCase - GetAcademyByIdUseCase
   */
  constructor({
    playerRepository, getAcademyByIdUseCase, enrollmentRepository, linkPlayerToAcademyValidator,
  }) {
    this.playerRepository = playerRepository;
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
    this.enrollmentRepository = enrollmentRepository;
    this.linkPlayerToAcademyValidator = linkPlayerToAcademyValidator;
  }

  async execute(request) {
    this.linkPlayerToAcademyValidator.validate(request);

    await this.checkIfPlayerExists(request.playerId);
    await this.getAcademyByIdUseCase.execute(request.academyId);

    await this.checkIfPlayerIsAlreadyLinkedToAcademy(request.playerId, request.academyId);
    await this.linkPlayerToAcademy(request.playerId, request.academyId);
  }

  async checkIfPlayerExists(id) {
    const player = await this.playerRepository.findById(id);

    if (!player) throw new NotFoundException('jogador', 'id', id);
  }

  async checkIfPlayerIsAlreadyLinkedToAcademy(playerId, academyId) {
    const enrollment = await this.enrollmentRepository.findByAcademyIdAndPlayerId(academyId, playerId);

    if (enrollment) {
      throw new BusinessException('O jogador já está vinculado à academia.');
    }
  }

  async linkPlayerToAcademy(playerId, academyId) {
    return this.enrollmentRepository.create(academyId, playerId);
  }
}

module.exports = LinkPlayerToAcademyUseCase;
