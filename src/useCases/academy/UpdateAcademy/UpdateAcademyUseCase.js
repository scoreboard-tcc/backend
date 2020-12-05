const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const AcademyRepository = require('../../../repositories/academyRepository');
const validateSchema = require('../../../utils/validation');
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
   */
  constructor({ academyRepository, getAcademyByIdUseCase }) {
    this.academyRepository = academyRepository;
    this.getAcademyByIdUseCase = getAcademyByIdUseCase;
  }

  validate(id, academy) {
    validateSchema(UpdateAcademyValidator.id, id);
    validateSchema(UpdateAcademyValidator.academy, academy);
  }

  async execute(id, academy) {
    this.validate(id, academy);

    await this.checkIfAcademyExists(id);
    await this.checkIfSubdomainIsAlreadyUsed(academy.subdomain, id);

    const payload = {
      name: academy.name,
      subdomain: academy.subdomain,
      address: academy.address,
      logoUrl: 'https://uilogos.co/img/logomark/hexa.png',
      additionalInfo: academy.additionalInfo,
    };

    await this.academyRepository.update(id, payload);
  }

  async checkIfAcademyExists(id) {
    await this.getAcademyByIdUseCase.execute(id);
  }

  async checkIfSubdomainIsAlreadyUsed(subdomain, academyId) {
    const academy = await this.academyRepository.findBySubdomain(subdomain);

    if (academy && academyId !== academy.id) throw new AlreadyUsedException('academia', 'subdomínio', subdomain);
  }
}

module.exports = UpdateAcademyUseCase;
