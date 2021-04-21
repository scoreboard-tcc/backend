const UnlinkPlayerFromAcademyUseCase = require('../../../useCases/player/UnlinkPlayerFromAcademy/UnlinkPlayerFromAcademyUseCase');

class UnlinkPlayerFromAcademyController {
  /**
   * UnlinkPlayerFromAcademyController
   *
   * @class
   * @param {object} container - Container
   * @param {UnlinkPlayerFromAcademyUseCase} container.unlinkPlayerFromAcademyUseCase - UnlinkPlayerFromAcademyUseCase
   */
  constructor({ unlinkPlayerFromAcademyUseCase }) {
    this.unlinkPlayerFromAcademyUseCase = unlinkPlayerFromAcademyUseCase;
  }

  async handle(request, response) {
    const { id: academyId } = response.locals.user.academy;
    const { playerId } = request.params;

    await this.unlinkPlayerFromAcademyUseCase.execute({
      academyId,
      playerId,
    });

    return response.status(200).send();
  }
}

module.exports = UnlinkPlayerFromAcademyController;
