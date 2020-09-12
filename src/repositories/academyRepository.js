const knex = require('../providers/database');

class AcademyRepository {
  async findByName(name, pagination) {
    return knex('Academy')
      .where('name', 'ilike', `%${name}%`)
      .paginate(pagination);
  }
}

module.exports = AcademyRepository;
module.exports.instance = new AcademyRepository();
