const UpdateAcademyUseCase = require('./UpdateAcademyUseCase');

class CreateAcademyController {
  /**
   * CreateAcademyController
   *
   * @class
   * @param {object} container - Container
   * @param {UpdateAcademyUseCase} container.updateAcademyUseCase - CpdateAcademyUseCase
   */
  constructor({ updateAcademyUseCase }) {
    this.updateAcademyUseCase = updateAcademyUseCase;
  }

  async handle(request, response) {
    await this.updateAcademyUseCase.execute(Number(request.params.id), request.body);

    return response.status(200).send();
  }
}

module.exports = CreateAcademyController;
