const jwt = require('jsonwebtoken');
const validateSchema = require('../../../utils/validation');
const AuthenticateCoordinatorValidator = require('./AuthenticateCoordinatorValidator');
const config = require('../../../config/secrets');
const CoordinatorRepository = require('../../../repositories/coordinatorRepository');
const AcademyRepository = require('../../../repositories/academyRepository');
const GetAcademyBySubdomainUseCase = require('../../academy/GetAcademyBySubdomain/GetAcademyBySubdomainUseCase');

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

    const token = await this.generateToken(academy, request.email);

    return token;
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
      },
      email,
      type: 'coordinator',
    }, config.jwtSecret);
  }
}

module.exports = AuthenticateCoordinatorUseCase;
