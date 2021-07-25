const NotFoundException = require('../../../exceptions/NotFoundException');
const AcademyRepository = require('../../../repositories/academyRepository');

const GetAcademyByIdValidator = require('./GetAcademyByIdValidator');

class GetAcademyByIdUseCase {
  /**
   * GetAcademyByIdUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {GetAcademyByIdValidator} container.getAcademyByIdValidator
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   */
  constructor({ academyRepository, getAcademyByIdValidator }) {
    this.academyRepository = academyRepository;
    this.getAcademyByIdValidator = getAcademyByIdValidator;
  }

  async execute(id) {
    this.getAcademyByIdValidator.validate(id);

    return this.getAcademy(id);
  }

  async getAcademy(id) {
    const academy = await this.academyRepository.findById(id);

    if (!academy) throw new NotFoundException('Academia', 'id', id);

    return academy
  }
}

module.exports = GetAcademyByIdUseCase;
