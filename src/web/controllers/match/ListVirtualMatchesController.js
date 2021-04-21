const ValidationException = require('../../../exceptions/ValidationException');
const ListVirtualMatchesUseCase = require('../../../useCases/match/ListVirtualMatches/ListVirtualMatchesUseCase');

class ListVirtualMatchesController {
  /**
   * ListVirtualMatchesController
   *
   * @class
   * @param {object} container - Container
   * @param {ListVirtualMatchesUseCase} container.listVirtualMatchesUseCase - ListVirtualMatchesUseCase
   */
  constructor({ listVirtualMatchesUseCase }) {
    this.listVirtualMatchesUseCase = listVirtualMatchesUseCase;
  }

  async handle(request, response) {
    const { id: academyId } = response.locals.user.academy;

    if (!academyId) {
      throw new ValidationException('Necessário informar o id da academia');
    }

    const scoreboards = await this.listVirtualMatchesUseCase.execute(academyId);

    return response.status(200).json(scoreboards);
  }
}

module.exports = ListVirtualMatchesController;
