const bcryptjs = require('bcryptjs');
const BusinessException = require('../exceptions/BusinessException');
const NotFoundException = require('../exceptions/NotFoundException');
const createQuery = require('../providers/database');

const tableName = 'Admin';

class AdminRepository {
  async findByEmailAndPassword(email, password) {
    const admin = await createQuery(tableName)
      .where('email', '=', email)
      .first();

    if (!admin) {
      throw new NotFoundException('administrador', 'email', email);
    }

    const isPasswordCorrect = await bcryptjs.compare(password, admin.password);

    if (!isPasswordCorrect) {
      throw new BusinessException('As credenciais informadas estão incorretas.');
    }

    return admin;
  }
}

module.exports = AdminRepository;
