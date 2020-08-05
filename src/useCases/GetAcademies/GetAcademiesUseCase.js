const AcademyRepository = require('../../repositories/academyRepository');

class GetAcademiesUseCase {
  /**
   * GetAcademiesUseCase
   *
   * @class
   * @param {AcademyRepository} academyRepository - AcademyRepository
   */
  constructor(academyRepository) {
    this.academyRepository = academyRepository;
  }

  async execute(name, pagination) {
    if (name) {
      return this.academyRepository.findByName(name, pagination);
    }

    return this.academyRepository.findAll(pagination);
  }
}

module.exports = GetAcademiesUseCase;
