const AcademyRepository = require('../../../repositories/academyRepository');
const CheckIfSubdomainIsAvailableValidator = require('./CheckIfSubdomainIsAvailableValidator');

class CheckIfSubdomainIsAvailableUseCase {
  /**
   * CheckIfSubdomainIsAvailableUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {CheckIfSubdomainIsAvailableValidator} container.checkIfSubdomainIsAvailableValidator
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   */
  constructor({ academyRepository, checkIfSubdomainIsAvailableValidator }) {
    this.academyRepository = academyRepository;
    this.checkIfSubdomainIsAvailableValidator = checkIfSubdomainIsAvailableValidator;
  }

  async execute(subdomain) {
    this.checkIfSubdomainIsAvailableValidator.validate(subdomain);

    const academy = await this.academyRepository.findBySubdomain(subdomain);

    return academy === undefined;
  }
}

module.exports = CheckIfSubdomainIsAvailableUseCase;
