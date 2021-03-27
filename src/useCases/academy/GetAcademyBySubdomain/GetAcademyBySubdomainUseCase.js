const firebaseConfig = require('../../../config/firebase');
const NotFoundException = require('../../../exceptions/NotFoundException');
const AcademyRepository = require('../../../repositories/academyRepository');
const validateSchema = require('../../../utils/validation');
const GetAcademyBySubdomainValidator = require('./GetAcademyBySubdomainValidator');

class GetAcademyPublicDataBySubdomainUseCase {
  /**
   * GetAcademyPublicDataBySubdomainUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   */
  constructor({ academyRepository }) {
    this.academyRepository = academyRepository;
  }

  validate(id) {
    validateSchema(GetAcademyBySubdomainValidator, id);
  }

  async execute(subdomain) {
    this.validate(subdomain);

    const academy = await this.academyRepository.findBySubdomain(subdomain);

    if (!academy) {
      throw new NotFoundException('academia', 'subdomínio', subdomain);
    }

    return { ...academy, logoUrl: firebaseConfig.uploadPath + academy.logoUrl };
  }
}

module.exports = GetAcademyPublicDataBySubdomainUseCase;
