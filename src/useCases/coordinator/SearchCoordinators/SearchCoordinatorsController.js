const { getPagination } = require('../../../utils/pagination');
const SearchCoordinatorsUseCase = require('./SearchCoordinatorsUseCase');

class SearchCoordinatorsAdminController {
  /**
   * SearchCoordinatorsAdminController
   *
   * @class
   * @param {object} container - Container
   * @param {SearchCoordinatorsUseCase} container.searchCoordinatorsUseCase - SearchCoordinatorsUseCase
   */
  constructor({ searchCoordinatorsUseCase }) {
    this.searchCoordinatorsUseCase = searchCoordinatorsUseCase;
  }

  async handle(request, response) {
    const pagination = getPagination(request);

    const { id: academyId } = response.locals.user.academy;
    const { search = '' } = request.query;

    const coordinators = await this.searchCoordinatorsUseCase.execute(
      Number(academyId),
      search,
      pagination,
    );

    return response.status(200).json(coordinators);
  }
}

module.exports = SearchCoordinatorsAdminController;
