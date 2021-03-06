const GetAcademyByIdUseCase = require('../../../useCases/academy/GetAcademyById/GetAcademyByIdUseCase');

class GetAcademyByIdController {
  /**
   * GetAcademyByIdController
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

module.exports = GetAcademyByIdController;
