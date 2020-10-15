const AcademyRepository = require('../../../repositories/academyRepository');
const validateSchema = require('../../../utils/validation');
const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const UpdateAcademyValidator = require('./UpdateAcademyValidator');
const NotFoundException = require('../../../exceptions/NotFoundException');

class UpdateAcademyUseCase {
  /**
   * UpdateAcademyUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   */
  constructor({ academyRepository }) {
    this.academyRepository = academyRepository;
  }

  validate(academy) {
    validateSchema(UpdateAcademyValidator, academy);
  }

  async execute(id, academy) {
    this.validate({ id, academy });

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
    const academy = await this.academyRepository.findById(id);

    if (!academy) throw new NotFoundException('Academia', 'id', id);
  }

  async checkIfSubdomainIsAlreadyUsed(subdomain, academyId) {
    const academy = await this.academyRepository.findBySubdomain(subdomain);

    if (academy && academyId !== academy.id) throw new AlreadyUsedException('academia', 'subdomínio', subdomain);
  }
}

module.exports = UpdateAcademyUseCase;
