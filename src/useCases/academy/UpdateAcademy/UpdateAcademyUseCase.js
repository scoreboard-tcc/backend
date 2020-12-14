const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const AcademyRepository = require('../../../repositories/academyRepository');
const validateSchema = require('../../../utils/validation');
const UploadFileUseCase = require('../../utils/UploadFile/UploadFileUseCase');
const GetAcademyByIdUseCase = require('../GetAcademyById/GetAcademyByIdUseCase');
const UpdateAcademyValidator = require('./UpdateAcademyValidator');

class UpdateAcademyUseCase {
  /**
   * UpdateAcademyUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {GetAcademyByIdUseCase} container.getAcademyByIdUseCase - GetAcademyByIdUseCase
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {UploadFileUseCase} container.uploadFileUseCase - UploadFileUseCase
   */
  constructor({ academyRepository, getAcademyByIdUseCase, uploadFileUseCase }) {
    this.academyRepository = academyRepository;
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
    this.uploadFileUseCase = uploadFileUseCase;
  }

  validate(id, request) {
    validateSchema(UpdateAcademyValidator.id, id);
    validateSchema(UpdateAcademyValidator.academy, request);
  }

  async execute(id, request) {
    this.validate(id, request);

    await this.checkIfAcademyExists(id);
    await this.checkIfSubdomainIsAlreadyUsed(request.subdomain, id);

    const logoUrl = await this.uploadFileUseCase.execute(request.logo);

    const payload = {
      name: request.name,
      subdomain: request.subdomain,
      address: request.address,
      logoUrl,
      additionalInfo: request.additionalInfo,
    };

    await this.academyRepository.update(id, payload);
  }

  async checkIfAcademyExists(id) {
    return this.getAcademyByIdUseCase.execute(id);
  }

  async checkIfSubdomainIsAlreadyUsed(subdomain, academyId) {
    const academy = await this.academyRepository.findBySubdomain(subdomain);

    if (academy && academyId !== academy.id) throw new AlreadyUsedException('academia', 'subdomínio', subdomain);
  }
}

module.exports = UpdateAcademyUseCase;
