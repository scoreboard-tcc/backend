const NotFoundException = require('../../../exceptions/NotFoundException');
const CoordinatorRepository = require('../../../repositories/coordinatorRepository');
const DeleteCoordinatorValidator = require('./DeleteCoordinatorValidator');

class DeleteCoordinatorUseCase {
  /**
   * DeleteCoordinatorUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {DeleteCoordinatorValidator} container.deleteCoordinatorValidator
   * @param {CoordinatorRepository} container.coordinatorRepository - CoordinatorRepository
   */
  constructor({ coordinatorRepository, deleteCoordinatorValidator }) {
    this.coordinatorRepository = coordinatorRepository;
    this.deleteCoordinatorValidator = deleteCoordinatorValidator;
  }

  async execute(id, academyId) {
    this.deleteCoordinatorValidator.validate(id);

    const coordinator = await this.checkIfCoordinatorExists(id);

    if (academyId) {
      this.checkIfCoordinatorIsFromAcademy(coordinator, academyId);
    }

    await this.coordinatorRepository.delete(id);
  }

  async checkIfCoordinatorExists(id) {
    const coordinator = await this.coordinatorRepository.findById(id);

    if (!coordinator) throw new NotFoundException('coordenador', 'id', id);

    return coordinator;
  }

  checkIfCoordinatorIsFromAcademy(coordinator, acadeymId) {
    return coordinator.academyId === acadeymId;
  }
}

module.exports = DeleteCoordinatorUseCase;
