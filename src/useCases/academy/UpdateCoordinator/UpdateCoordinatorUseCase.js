const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const CoordinatorRepository = require('../../../repositories/coordinatorRepository');
const validateSchema = require('../../../utils/validation');
const UpdateCoordinatorValidator = require('./UpdateCoordinatorValidator');

class UodateCoordinatorUseCase {
  /**
   * UodateCoordinatorUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {CoordinatorRepository} container.coordinatorRepository - CoordinatorRepository
   */
  constructor({ coordinatorRepository }) {
    this.coordinatorRepository = coordinatorRepository;
  }

  validate(id) {
    validateSchema(UpdateCoordinatorValidator, id);
  }

  async execute(id, coordinator) {
    this.validate({ id, coordinator });

    await this.checkIfCoordinatorExists(id);
    await this.checkIfEmailIsAlreadyUsed(coordinator.email, id);

    await this.coordinatorRepository.update(id, {
      email: coordinator.email,
      name: coordinator.name,
    });
  }

  async checkIfCoordinatorExists(id) {
    const coordinator = await this.coordinatorRepository.findById(id);

    if (!coordinator) throw new NotFoundException('coordenador', 'id', id);
  }

  async checkIfEmailIsAlreadyUsed(email, coordinatorId) {
    const coordinator = await this.coordinatorRepository.findByEmail(email);

    if (coordinator && coordinatorId !== coordinator.id) throw new AlreadyUsedException('coordenador', 'email', email);
  }
}

module.exports = UodateCoordinatorUseCase;
