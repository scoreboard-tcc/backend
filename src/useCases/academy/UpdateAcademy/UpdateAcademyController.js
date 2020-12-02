const UpdateAcademyUseCase = require('./UpdateAcademyUseCase');

class UpdateAcademyController {
  /**
   * UpdateAcademyController
   *
   * @class
   * @param {object} container - Container
   * @param {UpdateAcademyUseCase} container.updateAcademyUseCase - UpdateAcademyUseCase
   */
  constructor({ updateAcademyUseCase }) {
    this.updateAcademyUseCase = updateAcademyUseCase;
  }

  async handle(request, response) {
    const academyId = Number(request.params.id);

    await this.updateAcademyUseCase.execute(academyId, request.body);

    return response.status(200).send();
  }
}

module.exports = UpdateAcademyController;
