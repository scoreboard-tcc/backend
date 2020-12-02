const AcademyRepository = require('../../../repositories/academyRepository');
const validateSchema = require('../../../utils/validation');
const SearchAcademiesValidator = require('./SearchAcademiesValidator');

class SearchAcademiesUseCase {
  /**
   * SearchAcademiesUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   */
  constructor({ academyRepository }) {
    this.academyRepository = academyRepository;
  }

  validate(name) {
    validateSchema(SearchAcademiesValidator, name);
  }

  async execute(name, pagination) {
    this.validate(name);

    return this.academyRepository.findByName(name, pagination);
  }
}

module.exports = SearchAcademiesUseCase;
