const bcryptjs = require('bcryptjs');
const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const AcademyRepository = require('../../../repositories/academyRepository');
const CoordinatorRepository = require('../../../repositories/coordinatorRepository');
const validateSchema = require('../../../utils/validation');
const CreateCoordinatorValidator = require('./CreateCoordinatorValidator');

class CreateCoordinatorUseCase {
  /**
   * CreateCoordinatorUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {CoordinatorRepository} container.coordinatorRepository - CoordinatorRepository
   */
  constructor({ academyRepository, coordinatorRepository }) {
    this.academyRepository = academyRepository;
    this.coordinatorRepository = coordinatorRepository;
  }

  validate(coordinator) {
    validateSchema(CreateCoordinatorValidator, coordinator);
  }

  async execute(academyId, coordinatorPayload) {
    this.validate(coordinatorPayload);

    await this.checkIfAcademyExists(academyId);
    await this.checkIfEmailIsAlreadyUsed(coordinatorPayload.email);

    await this.createCoordinator(academyId, coordinatorPayload);
  }

  async checkIfAcademyExists(id) {
    const academy = await this.academyRepository.findById(id);

    if (!academy) throw new NotFoundException('academia', 'id', id);
  }

  async checkIfEmailIsAlreadyUsed(email) {
    const coordinator = await this.coordinatorRepository.findByEmail(email);

    if (coordinator) throw new AlreadyUsedException('coordenador', 'email', email);
  }

  async createCoordinator(academyId, coordinator) {
    await this.coordinatorRepository.create({
      email: coordinator.email,
      name: coordinator.name,
      academyId,
      password: await bcryptjs.hash(coordinator.password, 10),
    });
  }
}

module.exports = CreateCoordinatorUseCase;
