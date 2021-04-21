const ValidationException = require('../../../exceptions/ValidationException');
const ListPublicMatchesUseCase = require('../../../useCases/match/ListPublicMatches/ListPublicMatchesUseCase');

class ListPublicMatchesController {
  /**
   * ListPublicMatchesController
   *
   * @class
   * @param {object} container - Container
   * @param {ListPublicMatchesUseCase} container.listPublicMatchesUseCase - ListPublicMatchesUseCase
   */
  constructor({ listPublicMatchesUseCase }) {
    this.listPublicMatchesUseCase = listPublicMatchesUseCase;
  }

  async handle(request, response) {
    const { academyId } = request.params;

    if (!academyId) {
      throw new ValidationException('Necessário informar o id da academia');
    }

    const scoreboards = await this.listPublicMatchesUseCase.execute(Number(academyId));

    return response.status(200).json(scoreboards);
  }
}

module.exports = ListPublicMatchesController;
