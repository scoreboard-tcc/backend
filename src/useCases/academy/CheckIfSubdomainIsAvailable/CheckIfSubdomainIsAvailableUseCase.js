const AcademyRepository = require('../../../repositories/academyRepository');
const validateSchema = require('../../../utils/validation');
const CheckIfSubdomainIsAvailableValidator = require('./CheckIfSubdomainIsAvailableValidator');

class CheckIfSubdomainIsAvailableUseCase {
  /**
   * CheckIfSubdomainIsAvailableUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   */
  constructor({ academyRepository }) {
    this.academyRepository = academyRepository;
  }

  validate(subdomain) {
    validateSchema(CheckIfSubdomainIsAvailableValidator, subdomain);
  }

  async execute(subdomain) {
    this.validate(subdomain);

    const academy = await this.academyRepository.findBySubdomain(subdomain);

    return academy === undefined;
  }
}

module.exports = CheckIfSubdomainIsAvailableUseCase;
