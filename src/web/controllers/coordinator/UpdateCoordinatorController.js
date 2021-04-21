const ValidationException = require('../../../exceptions/ValidationException');
const UpdateCoordinatorUseCase = require('../../../useCases/coordinator/UpdateCoordinator/UpdateCoordinatorUseCase');

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

    const { id: academyId } = response.locals.user.academy;

    if (!academyId) {
      throw new ValidationException('Necessário informar o id da academia');
    }

    await this.updateCoordinatorUseCase.execute(Number(id), request.body, academyId);

    return response.status(200).send();
  }
}

module.exports = UpdateCoordinatorController;
