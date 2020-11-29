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

  validate(id) {
    validateSchema(AuthenticateCoordinatorValidator, id);
  }

  async execute(credentials) {
    this.validate(credentials);

    await this.checkIfAcademyExists(credentials.academyId);
    await this.checkIfCredentiaisAreValid(credentials);

    const token = await this.generateToken(credentials.academyId, credentials.email);

    return token;
  }

  async checkIfAcademyExists(id) {
    const academy = await this.academyRepository.findById(id);

    if (!academy) throw new NotFoundException('academia', 'id', id);
  }

  async checkIfCredentiaisAreValid(credentials) {
    await this
      .coordinatorRepository
      .findByAcademyIdAndEmailAndPassword(credentials.academyId,
        credentials.email,
        credentials.password);
  }

  async generateToken(academyId, email) {
    return jwt.sign({ academyId, email, type: 'coordinator' }, config.jwtSecret);
  }
}

module.exports = AuthenticateCoordinatorUseCase;
