const GetAcademyPublicDataBySubdomainUseCase = require('./GetAcademyPublicDataBySubdomainUseCase');

class GetAcademyPublicDataBySubdomainController {
  /**
   * GetAcademyPublicDataBySubdomainController
   *
   * @class
   * @param {object} container - Container
   * @param {GetAcademyPublicDataBySubdomainUseCase} container.getAcademyPublicDataBySubdomainUseCase - GetAcademyPublicDataBySubdomainUseCase
   */
  constructor({ getAcademyPublicDataBySubdomainUseCase }) {
    this.getAcademyPublicDataBySubdomainUseCase = getAcademyPublicDataBySubdomainUseCase;
  }

  async handle(request, response) {
    const { subdomain } = request.params;

    const data = await this.getAcademyPublicDataBySubdomainUseCase.execute(subdomain);

    return response.status(200).json(data);
  }
}

module.exports = GetAcademyPublicDataBySubdomainController;
