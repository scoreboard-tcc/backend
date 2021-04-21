const GetDashboardUseCase = require('../../../useCases/service/GetDashboard/GetDashboardUseCase');

class GetDashboardController {
  /**
   * GetDashboardController
   *
   * @class
   * @param {object} container - Container
   * @param {GetDashboardUseCase} container.getDashboardUseCase - GetDashboardUseCase
   */
  constructor({ getDashboardUseCase }) {
    this.getDashboardUseCase = getDashboardUseCase;
  }

  async handle(request, response) {
    const dashboard = await this.getDashboardUseCase.execute();

    return response.status(200).json(dashboard);
  }
}

module.exports = GetDashboardController;
