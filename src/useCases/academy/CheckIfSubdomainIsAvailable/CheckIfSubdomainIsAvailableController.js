const CheckIfSubdomainIsAvailableUseCase = require('./CheckIfSubdomainIsAvailableUseCase');

class CheckIfSubdomainIsAvailableController {
  /**
   * CreateAcademyController
   *
   * @class
   * @param {object} container - Container
   * @param {CheckIfSubdomainIsAvailableUseCase} container.checkIfSubdomainIsAvailableUseCase - CheckIfSubdomainIsAvailableUseCase
   */
  constructor({ checkIfSubdomainIsAvailableUseCase }) {
    this.checkIfSubdomainIsAvailableUseCase = checkIfSubdomainIsAvailableUseCase;
  }

  async handle(request, response) {
    const isAvailable = await this.checkIfSubdomainIsAvailableUseCase.execute(request);

    return response.status(200).json({ isAvailable });
  }
}

module.exports = CheckIfSubdomainIsAvailableController;
