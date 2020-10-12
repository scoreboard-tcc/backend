const jwt = require('jsonwebtoken');
const AdminRepository = require('../../../repositories/adminRepository');
const validateSchema = require('../../../utils/validation');
const AuthenticateAdminValidator = require('./AuthenticateAdminValidator');
const config = require('../../../config/secrets');

class AuthenticateAdminUseCase {
  /**
   * AuthenticateAdminUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {AdminRepository} container.adminRepository - AdminRepository
   */
  constructor({ adminRepository }) {
    this.adminRepository = adminRepository;
  }

  validate(id) {
    validateSchema(AuthenticateAdminValidator, id);
  }

  async execute(credentials) {
    this.validate(credentials);

    await this.checkIfCredentiaisAreValid(credentials);

    const token = await this.generateToken(credentials.email);

    return token;
  }

  async checkIfCredentiaisAreValid(credentials) {
    await this.adminRepository.findByEmailAndPassword(credentials.email, credentials.password);
  }

  async generateToken(email) {
    return jwt.sign({ email }, config.jwtSecret);
  }
}

module.exports = AuthenticateAdminUseCase;
