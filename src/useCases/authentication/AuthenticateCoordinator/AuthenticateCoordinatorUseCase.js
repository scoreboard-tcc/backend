const jwt = require('jsonwebtoken');
const config = require('../../../config/secrets');
const AcademyRepository = require('../../../repositories/academyRepository');
const CoordinatorRepository = require('../../../repositories/coordinatorRepository');
const validateSchema = require('../../../utils/validation');
const GetAcademyBySubdomainUseCase = require('../../academy/GetAcademyBySubdomain/GetAcademyBySubdomainUseCase');
const AuthenticateCoordinatorValidator = require('./AuthenticateCoordinatorValidator');

class AuthenticateCoordinatorUseCase {
  /**
   * AuthenticateCoordinatorUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {GetAcademyBySubdomainUseCase} container.getAcademyBySubdomainUseCase - GetAcademyBySubdomainUseCase
   * @param {CoordinatorRepository} container.coordinatorRepository - CoordinatorRepository
   */
  constructor({ academyRepository, coordinatorRepository, getAcademyBySubdomainUseCase }) {
    this.academyRepository = academyRepository;
    this.coordinatorRepository = coordinatorRepository;
    this.getAcademyBySubdomainUseCase = getAcademyBySubdomainUseCase;
  }

  validate(request) {
    validateSchema(AuthenticateCoordinatorValidator, request);
  }

  async execute(request) {
    this.validate(request);

    const academy = await this.getAcademyBySubdomainUseCase.execute(request.academySubdomain);

    await this.checkIfCredentiaisAreValid(request, academy.id);

    return this.generateToken(academy, request.email);
  }

  async checkIfCredentiaisAreValid(credentials, academyId) {
    await this
      .coordinatorRepository
      .findByAcademyIdAndEmailAndPassword(academyId,
        credentials.email,
        credentials.password);
  }

  async generateToken(academy, email) {
    return jwt.sign({
      academy: {
        id: academy.id,
        subdomain: academy.subdomain,
        name: academy.name,
        logoUrl: academy.logoUrl,
      },
      email,
      type: 'coordinator',
    }, config.jwtSecret);
  }
}

module.exports = AuthenticateCoordinatorUseCase;
