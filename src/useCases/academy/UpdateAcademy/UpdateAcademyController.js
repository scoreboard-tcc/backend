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

    const data = {
      ...request.body,
      logo: request.file,
    };

    await this.updateAcademyUseCase.execute(academyId, data);

    return response.status(200).send();
  }
}

module.exports = UpdateAcademyController;
