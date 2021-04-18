const AcademyRepository = require('../../../repositories/academyRepository');
const SearchAcademiesValidator = require('./SearchAcademiesValidator');

class SearchAcademiesUseCase {
  /**
   * SearchAcademiesUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {SearchAcademiesValidator} container.searchAcademiesValidator
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   */
  constructor({ academyRepository, searchAcademiesValidator }) {
    this.academyRepository = academyRepository;
    this.searchAcademiesValidator = searchAcademiesValidator;
  }

  async execute(name, pagination) {
    this.searchAcademiesValidator.validate(name);

    return this.academyRepository.findByName(name, pagination);
  }
}

module.exports = SearchAcademiesUseCase;
