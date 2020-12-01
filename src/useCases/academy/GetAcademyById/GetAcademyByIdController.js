const GetAcademyByIdUseCase = require('./GetAcademyByIdUseCase');

class CheckIfSubdomainIsAvailableController {
  /**
   * CheckIfSubdomainIsAvailableController
   *
   * @class
   * @param {object} container - Container
   * @param {GetAcademyByIdUseCase} container.getAcademyByIdUseCase - GetAcademyByIdUseCase
   */
  constructor({ getAcademyByIdUseCase }) {
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
  }

  async handle(request, response) {
    const { params: { id } } = request;

    const academy = await this.getAcademyByIdUseCase.execute(id);

    return response.status(200).json(academy);
  }
}

module.exports = CheckIfSubdomainIsAvailableController;
