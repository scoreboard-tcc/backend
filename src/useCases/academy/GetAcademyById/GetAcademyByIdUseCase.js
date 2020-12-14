const firebaseConfig = require('../../../config/firebase');
const NotFoundException = require('../../../exceptions/NotFoundException');
const AcademyRepository = require('../../../repositories/academyRepository');
const validateSchema = require('../../../utils/validation');

const GetAcademyByIdValidator = require('./GetAcademyByIdValidator');

class GetAcademyByIdUseCase {
  /**
   * GetAcademyByIdUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   */
  constructor({ academyRepository }) {
    this.academyRepository = academyRepository;
  }

  validate(id) {
    validateSchema(GetAcademyByIdValidator, id);
  }

  async execute(id) {
    this.validate(id);

    return this.getAcademy(id);
  }

  async getAcademy(id) {
    const academy = await this.academyRepository.findById(id);

    if (!academy) throw new NotFoundException('Academia', 'id', id);

    return { ...academy, logoUrl: firebaseConfig.uploadPath + academy.logoUrl };
  }
}

module.exports = GetAcademyByIdUseCase;
