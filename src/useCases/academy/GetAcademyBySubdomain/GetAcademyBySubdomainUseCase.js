const firebaseConfig = require('../../../config/firebase');
const NotFoundException = require('../../../exceptions/NotFoundException');
const AcademyRepository = require('../../../repositories/academyRepository');
const GetAcademyBySubdomainValidator = require('./GetAcademyBySubdomainValidator');

class GetAcademyPublicDataBySubdomainUseCase {
  /**
   * GetAcademyPublicDataBySubdomainUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {GetAcademyBySubdomainValidator} container.getAcademyBySubdomainValidator
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   */
  constructor({ academyRepository, getAcademyBySubdomainValidator }) {
    this.academyRepository = academyRepository;
    this.getAcademyBySubdomainValidator = getAcademyBySubdomainValidator;
  }

  async execute(subdomain) {
    this.getAcademyBySubdomainValidator.validate(subdomain);

    const academy = await this.academyRepository.findBySubdomain(subdomain);

    if (!academy) {
      throw new NotFoundException('academia', 'subdomínio', subdomain);
    }

    return { ...academy, logoUrl: firebaseConfig.uploadPath + academy.logoUrl };
  }
}

module.exports = GetAcademyPublicDataBySubdomainUseCase;
