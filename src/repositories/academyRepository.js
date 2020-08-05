const knex = require('../providers/database');

class AcademyRepository {
  async findAll(pagination) {
    return knex('Academy')
      .paginate(pagination);
  }

  async findByName(name, pagination) {
    return knex('Academy')
      .where('name', 'ilike', `%${name}%`)
      .paginate(pagination);
  }
}

module.exports = AcademyRepository;
