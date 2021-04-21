const CheckIfSubdomainIsAvailableUseCase = require('../../../useCases/academy/CheckIfSubdomainIsAvailable/CheckIfSubdomainIsAvailableUseCase');

class CheckIfSubdomainIsAvailableController {
  /**
   * CheckIfSubdomainIsAvailableController
   *
   * @class
   * @param {object} container - Container
   * @param {CheckIfSubdomainIsAvailableUseCase} container.checkIfSubdomainIsAvailableUseCase - CheckIfSubdomainIsAvailableUseCase
   */
  constructor({ checkIfSubdomainIsAvailableUseCase }) {
    this.checkIfSubdomainIsAvailableUseCase = checkIfSubdomainIsAvailableUseCase;
  }

  async handle(request, response) {
    const { params: { subdomain } } = request;

    const isAvailable = await this.checkIfSubdomainIsAvailableUseCase.execute(subdomain);

    return response.status(200).json({ isAvailable });
  }
}

module.exports = CheckIfSubdomainIsAvailableController;
