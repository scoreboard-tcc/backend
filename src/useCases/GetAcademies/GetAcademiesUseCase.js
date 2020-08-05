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

  async execute(pagination) {
    return this.academyRepository.findAll(pagination);
  }
}

module.exports = GetAcademiesUseCase;
