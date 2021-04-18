const jwt = require('jsonwebtoken');
const config = require('../../../config/secrets');
const AdminRepository = require('../../../repositories/adminRepository');
const AuthenticateAdminValidator = require('./AuthenticateAdminValidator');

class AuthenticateAdminUseCase {
  /**
   * AuthenticateAdminUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AuthenticateAdminValidator} container.authenticateAdminValidator
   * @param {AdminRepository} container.adminRepository - AdminRepository
   */
  constructor({ adminRepository, authenticateAdminValidator }) {
    this.adminRepository = adminRepository;
    this.authenticateAdminValidator = authenticateAdminValidator;
  }

  async execute(credentials) {
    this.authenticateAdminValidator.validate(credentials);

    await this.checkIfCredentiaisAreValid(credentials);

    return this.generateToken(credentials.email);
  }

  async checkIfCredentiaisAreValid(credentials) {
    await this.adminRepository.findByEmailAndPassword(credentials.email, credentials.password);
  }

  async generateToken(email) {
    return jwt.sign({ email, type: 'administrator' }, config.jwtSecret);
  }
}

module.exports = AuthenticateAdminUseCase;
