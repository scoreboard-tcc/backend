const SearchCoordinatorsUseCase = require('./SearchCoordinatorsUseCase');
const { getPagination } = require('../../../utils/pagination');

class SearchCoordinatorsController {
  /**
   * SearchCoordinatorsController
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
    const { id: coordinatorId } = request.params;
    const { search = '' } = request.query;

    const academies = await this.searchCoordinatorsUseCase.execute(
      Number(coordinatorId),
      search,
      pagination,
    );

    return response.status(200).json(academies);
  }
}

module.exports = SearchCoordinatorsController;
