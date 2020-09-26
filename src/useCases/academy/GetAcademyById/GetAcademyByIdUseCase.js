const validateSchema = require('../../../utils/validation');

const AcademyRepository = require('../../../repositories/academyRepository');
const GetAcademyByIdValidator = require('./GetAcademyByIdValidator');
const NotFoundException = require('../../../exceptions/NotFoundException');

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

  validate(request) {
    validateSchema(GetAcademyByIdValidator, request);
  }

  async execute(request) {
    this.validate(request);

    const { params: { id } } = request;

    const academy = await this.getAcademy(id);

    return academy;
  }

  async getAcademy(id) {
    const academy = await this.academyRepository.findById(id);

    if (!academy) throw new NotFoundException('Academia', 'id', id);

    return academy;
  }
}

module.exports = GetAcademyByIdUseCase;
