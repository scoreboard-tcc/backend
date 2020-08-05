const GetAcademiesUseCase = require('./GetAcademiesUseCase');
const { getPagination } = require('../../utils/pagination');

class GetAcademiesController {
  /**
   * GetAcademiesController
   *
   * @class
   * @param {GetAcademiesUseCase} getAcademiesUseCase - getAcademiesUseCase
   */
  constructor(getAcademiesUseCase) {
    this.getAcademiesUseCase = getAcademiesUseCase;
  }

  async handle(request, response) {
    const pagination = getPagination(request);

    const academies = await this.getAcademiesUseCase.execute(pagination);

    return response.status(200).json(academies);
  }
}

module.exports = GetAcademiesController;
