const NotFoundException = require('../../../exceptions/NotFoundException');
const CoordinatorRepository = require('../../../repositories/coordinatorRepository');
const validateSchema = require('../../../utils/validation');
const DeleteCoordinatorValidator = require('./DeleteCoordinatorValidator');

class DeleteCoordinatorUseCase {
  /**
   * DeleteCoordinatorUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {CoordinatorRepository} container.coordinatorRepository - CoordinatorRepository
   */
  constructor({ coordinatorRepository }) {
    this.coordinatorRepository = coordinatorRepository;
  }

  validate(id) {
    validateSchema(DeleteCoordinatorValidator, id);
  }

  async execute(id, academyId) {
    this.validate(id);

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
