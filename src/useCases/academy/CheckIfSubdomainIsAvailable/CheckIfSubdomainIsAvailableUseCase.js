const validateSchema = require('../../../utils/validation');
const CheckIfSubdomainIsAvailableValidator = require('./CheckIfSubdomainIsAvailableValidator');

const AcademyRepository = require('../../../repositories/academyRepository');

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

  validate(request) {
    validateSchema(CheckIfSubdomainIsAvailableValidator, request);
  }

  async execute(request) {
    this.validate(request);

    const { params: { subdomain } } = request;

    const academy = await this.academyRepository.findBySubdomain(subdomain);

    return academy === undefined;
  }
}

module.exports = CheckIfSubdomainIsAvailableUseCase;
