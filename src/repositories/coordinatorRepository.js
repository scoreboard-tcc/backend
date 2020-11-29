const bcryptjs = require('bcryptjs');

const BusinessException = require('../exceptions/BusinessException');
const NotFoundException = require('../exceptions/NotFoundException');

const createQuery = require('../providers/database');

const tableName = 'Coordinator';

class CoordinatorRepository {
  async findById(id) {
    return createQuery(tableName)
      .where('id', '=', id)
      .first();
  }

  async findByEmailAndAcademyId(email, academyId) {
    return createQuery(tableName)
      .where('email', '=', email)
      .andWhere('academyId', '=', academyId)
      .first();
  }

  async findByAcademyAndName(academyId, name, pagination) {
    return createQuery(tableName)
      .where('name', 'ilike', `%${name}%`)
      .andWhere('academyId', '=', academyId)
      .paginate(pagination);
  }

  async create(coordinator) {
    return createQuery(tableName)
      .insert(coordinator)
      .returning('id');
  }

  async delete(id) {
    return createQuery(tableName)
      .del()
      .where('id', '=', id);
  }

  async update(id, coordinator) {
    return createQuery(tableName)
      .update(coordinator)
      .where('id', '=', id);
  }

  async findByAcademyIdAndEmailAndPassword(academyId, email, password) {
    const coordinator = await createQuery(tableName)
      .where('email', '=', email)
      .andWhere('academyId', '=', academyId)
      .first();

    if (!coordinator) {
      throw new NotFoundException('coordenador', 'email', email);
    }

    const isPasswordCorrect = await bcryptjs.compare(password, coordinator.password);

    if (!isPasswordCorrect) {
      throw new BusinessException('As credenciais informadas estão incorretas.');
    }

    return coordinator;
  }
}

module.exports = CoordinatorRepository;
