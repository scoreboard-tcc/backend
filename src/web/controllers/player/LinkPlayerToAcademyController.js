const LinkPlayerToAcademyUseCase = require('../../../useCases/player/LinkPlayerToAcademy/LinkPlayerToAcademyUseCase');

class LinkPlayerToAcademyController {
  /**
   * LinkPlayerToAcademyController
   *
   * @class
   * @param {object} container - Container
   * @param {LinkPlayerToAcademyUseCase} container.linkPlayerToAcademyUseCase - LinkPlayerToAcademyUseCase
   */
  constructor({ linkPlayerToAcademyUseCase }) {
    this.linkPlayerToAcademyUseCase = linkPlayerToAcademyUseCase;
  }

  async handle(request, response) {
    const { id: academyId } = response.locals.user.academy;
    const { playerId } = request.params;

    await this.linkPlayerToAcademyUseCase.execute({
      academyId,
      playerId,
    });

    return response.status(200).send();
  }
}

module.exports = LinkPlayerToAcademyController;
