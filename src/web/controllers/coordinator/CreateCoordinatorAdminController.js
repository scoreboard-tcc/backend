const CreateCoordinatorUseCase = require('../../../useCases/coordinator/CreateCoordinator/CreateCoordinatorUseCase');

class CreateCoordinatorAdminController {
  /**
   * CreateCoordinatorAdminController
   *
   * @class
   * @param {object} container - Container
   * @param {CreateCoordinatorUseCase} container.createCoordinatorUseCase - CreateCoordinatorUseCase
   */
  constructor({ createCoordinatorUseCase }) {
    this.createCoordinatorUseCase = createCoordinatorUseCase;
  }

  async handle(request, response) {
    const { academyId, ...body } = request.body;
    const coordinator = await this.createCoordinatorUseCase.execute(academyId, body);

    return response.status(201).json(coordinator);
  }
}

module.exports = CreateCoordinatorAdminController;
