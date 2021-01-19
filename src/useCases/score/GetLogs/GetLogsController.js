const GetLogsUseCase = require('./GetLogsUseCase');

class GetLogsController {
  /**
   * GetLogsController
   *
   * @param {object} container - Container
   * @param {GetLogsUseCase} container.getLogsUseCase - GetLogsUseCase
   */
  constructor({ getLogsUseCase }) {
    this.getLogsUseCase = getLogsUseCase;
  }

  async handle(request, response) {
    const { match } = response.locals;
    const { page = 1, limit = 10 } = request.query;

    const logs = await this.getLogsUseCase.execute(match.id, {
      page: Number(page),
      limit: Number(limit),
    });

    return response.status(200).json(logs);
  }
}

module.exports = GetLogsController;
