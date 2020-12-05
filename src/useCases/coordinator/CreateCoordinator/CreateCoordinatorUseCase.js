const bcryptjs = require('bcryptjs');
const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const AcademyRepository = require('../../../repositories/academyRepository');
const CoordinatorRepository = require('../../../repositories/coordinatorRepository');
const validateSchema = require('../../../utils/validation');
const GetAcademyByIdUseCase = require('../../academy/GetAcademyById/GetAcademyByIdUseCase');
const CreateCoordinatorValidator = require('./CreateCoordinatorValidator');

class CreateCoordinatorUseCase {
  /**
   * CreateCoordinatorUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {GetAcademyByIdUseCase} container.getAcademyByIdUseCase - GetAcademyByIdUseCase
   * @param {CoordinatorRepository} container.coordinatorRepository - CoordinatorRepository
   */
  constructor({ academyRepository, coordinatorRepository, getAcademyByIdUseCase }) {
    this.academyRepository = academyRepository;
    this.coordinatorRepository = coordinatorRepository;
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
  }

  validate(coordinator) {
    validateSchema(CreateCoordinatorValidator, coordinator);
  }

  async execute(academyId, coordinatorPayload) {
    this.validate(coordinatorPayload);

    await this.getAcademyByIdUseCase.execute(academyId);
    await this.checkIfEmailIsAlreadyUsed(coordinatorPayload.email, academyId);

    await this.createCoordinator(academyId, coordinatorPayload);
  }

  async checkIfEmailIsAlreadyUsed(email, academyId) {
    const coordinator = await this.coordinatorRepository.findByEmailAndAcademyId(email, academyId);

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
