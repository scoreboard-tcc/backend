const GetDashboardUseCase = require('./GetDashboardUseCase');

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
    const data = await this.getDashboardUseCase.execute();

    return response.status(200).json(data);
  }
}

module.exports = GetDashboardController;
