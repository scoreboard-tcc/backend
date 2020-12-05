const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const CoordinatorRepository = require('../../../repositories/coordinatorRepository');
const validateSchema = require('../../../utils/validation');
const UpdateCoordinatorValidator = require('./UpdateCoordinatorValidator');

class UpdateCoordinatorUseCase {
  /**
   * UpdateCoordinatorUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {CoordinatorRepository} container.coordinatorRepository - CoordinatorRepository
   */
  constructor({ coordinatorRepository }) {
    this.coordinatorRepository = coordinatorRepository;
  }

  validate(id, coordinator) {
    validateSchema(UpdateCoordinatorValidator.id, id);
    validateSchema(UpdateCoordinatorValidator.coordinator, coordinator);
  }

  async execute(id, coordinatorRequest, academyId) {
    this.validate(id, coordinatorRequest);

    const coordinator = await this.checkIfCoordinatorExists(id);

    if (academyId) {
      this.checkIfCoordinatorIsFromAcademy(coordinator, academyId);
    }

    await this.checkIfEmailIsAlreadyUsed(coordinatorRequest.email, id, coordinator.academyId);

    await this.coordinatorRepository.update(id, {
      email: coordinatorRequest.email,
      name: coordinatorRequest.name,
    });
  }

  async checkIfCoordinatorExists(id) {
    const coordinator = await this.coordinatorRepository.findById(id);

    if (!coordinator) throw new NotFoundException('coordenador', 'id', id);

    return coordinator;
  }

  async checkIfEmailIsAlreadyUsed(email, coordinatorId, academyId) {
    const coordinator = await this.coordinatorRepository.findByEmailAndAcademyId(email, academyId);

    if (coordinator && coordinatorId !== coordinator.id) throw new AlreadyUsedException('coordenador', 'email', email);
  }

  checkIfCoordinatorIsFromAcademy(coordinator, acadeymId) {
    return coordinator.academyId === acadeymId;
  }
}

module.exports = UpdateCoordinatorUseCase;
