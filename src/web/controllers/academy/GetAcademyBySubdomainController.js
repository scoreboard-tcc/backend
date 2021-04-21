const GetAcademyBySubdomainUseCase = require('../../../useCases/academy/GetAcademyBySubdomain/GetAcademyBySubdomainUseCase');

class GetAcademyBySubdomainController {
  /**
   * GetAcademyBySubdomainController
   *
   * @class
   * @param {object} container - Container
   * @param {GetAcademyBySubdomainUseCase} container.getAcademyBySubdomainUseCase - GetAcademyBySubdomainUseCase
   */
  constructor({ getAcademyBySubdomainUseCase }) {
    this.getAcademyBySubdomainUseCase = getAcademyBySubdomainUseCase;
  }

  async handle(request, response) {
    const { subdomain } = request.params;

    const academy = await this.getAcademyBySubdomainUseCase.execute(subdomain);

    return response.status(200).json(academy);
  }
}

module.exports = GetAcademyBySubdomainController;
