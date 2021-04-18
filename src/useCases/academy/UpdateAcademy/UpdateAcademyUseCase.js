const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const AcademyRepository = require('../../../repositories/academyRepository');
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
   * @param {UpdateAcademyValidator} container.updateAcademyValidator
   * @param {UploadFileUseCase} container.uploadFileUseCase - UploadFileUseCase
   */
  constructor({
    academyRepository, getAcademyByIdUseCase, uploadFileUseCase, updateAcademyValidator,
  }) {
    this.academyRepository = academyRepository;
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
    this.uploadFileUseCase = uploadFileUseCase;
    this.updateAcademyValidator = updateAcademyValidator;
  }

  async execute(id, request) {
    this.updateAcademyValidator.validate(request);

    await this.checkIfAcademyExists(id);
    await this.checkIfSubdomainIsAlreadyUsed(request.subdomain, id);

    const logoUrl = request.logo
      ? await this.uploadFileUseCase.execute(request.logo) : '';

    const payload = {
      name: request.name,
      subdomain: request.subdomain,
      address: request.address,
      additionalInfo: request.additionalInfo,
    };

    if (logoUrl) {
      payload.logoUrl = logoUrl;
    }

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
