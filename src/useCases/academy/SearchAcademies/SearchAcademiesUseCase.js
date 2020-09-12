const AcademyRepository = require('../../../repositories/academyRepository');

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

  async execute(name, pagination) {
    return this.academyRepository.findByName(name, pagination);
  }
}

module.exports = SearchAcademiesUseCase;
