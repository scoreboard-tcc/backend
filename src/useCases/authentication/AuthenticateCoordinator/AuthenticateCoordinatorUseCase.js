const jwt = require('jsonwebtoken');
const validateSchema = require('../../../utils/validation');
const AuthenticateCoordinatorValidator = require('./AuthenticateCoordinatorValidator');
const config = require('../../../config/secrets');
const NotFoundException = require('../../../exceptions/NotFoundException');
const CoordinatorRepository = require('../../../repositories/coordinatorRepository');

class AuthenticateCoordinatorUseCase {
  /**
   * AuthenticateCoordinatorUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AcademyRepository} container.academyRepository - AcademyRepository
   * @param {CoordinatorRepository} container.coordinatorRepository - CoordinatorRepository
   */
  constructor({ academyRepository, coordinatorRepository }) {
    this.academyRepository = academyRepository;
    this.coordinatorRepository = coordinatorRepository;
  }

  validate(request) {
    validateSchema(AuthenticateCoordinatorValidator, request);
  }

  async execute(request) {
    this.validate(request);

    const academy = await this.checkIfAcademyExists(request.academySubdomain);
    await this.checkIfCredentiaisAreValid(request, academy.id);

    const token = await this.generateToken(academy, request.email);

    return token;
  }

  async checkIfAcademyExists(subdomain) {
    const academy = await this.academyRepository.findBySubdomain(subdomain);

    if (!academy) throw new NotFoundException('academia', 'subdomínio', subdomain);

    return academy;
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
