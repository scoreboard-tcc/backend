const CreateCoordinatorUseCase = require('./CreateCoordinatorUseCase');

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
    const { id: academyId } = request.params;
    const coordinator = await this.createCoordinatorUseCase.execute(academyId, request.body);

    return response.status(201).json(coordinator);
  }
}

module.exports = CreateCoordinatorAdminController;
