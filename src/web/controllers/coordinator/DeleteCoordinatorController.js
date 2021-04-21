const ValidationException = require('../../../exceptions/ValidationException');
const DeleteCoordinatorUseCase = require('../../../useCases/coordinator/DeleteCoordinator/DeleteCoordinatorUseCase');

class DeleteCoordinatorController {
  /**
   * DeleteCoordinatorController
   *
   * @class
   * @param {object} container - Container
   * @param {DeleteCoordinatorUseCase} container.deleteCoordinatorUseCase - DeleteCoordinatorUseCase
   */
  constructor({ deleteCoordinatorUseCase }) {
    this.deleteCoordinatorUseCase = deleteCoordinatorUseCase;
  }

  async handle(request, response) {
    const { id } = request.params;
    const { id: academyId } = response.locals.user.academy;

    if (!academyId) {
      throw new ValidationException('Necessário informar o id da academia');
    }

    await this.deleteCoordinatorUseCase.execute(id, academyId);

    return response.status(200).send();
  }
}

module.exports = DeleteCoordinatorController;
