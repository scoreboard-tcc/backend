const UpdateCoordinatorUseCase = require('./UpdateCoordinatorUseCase');

class UpdateCoordinatorController {
  /**
   * UpdateCoordinatorController
   *
   * @class
   * @param {object} container - Container
   * @param {UpdateCoordinatorUseCase} container.updateCoordinatorUseCase - UpdateCoordinatorUseCase
   */
  constructor({ updateCoordinatorUseCase }) {
    this.updateCoordinatorUseCase = updateCoordinatorUseCase;
  }

  async handle(request, response) {
    const { id } = request.params;

    await this.updateCoordinatorUseCase.execute(Number(id), request.body);

    return response.status(200).send();
  }
}

module.exports = UpdateCoordinatorController;
