/* eslint-disable sonarjs/no-duplicate-string */
const createQuery = require('../providers/database');

const tableName = 'Player';

class PlayerRepository {
  async findById(id) {
    return createQuery(tableName)
      .where('id', '=', id)
      .first();
  }

  async findByEmail(email) {
    return createQuery(tableName)
      .where('email', '=', email)
      .first();
  }

  async findByName(name, pagination) {
    return createQuery(tableName)
      .where('name', 'ilike', `%${name}%`)
      .paginate(pagination);
  }

  async findByNameAndAcademyId(name, academyId, pagination) {
    return createQuery(tableName)
      .innerJoin('Enrollment', 'Player.id', 'Enrollment.playerId')
      .where('academyId', '=', academyId)
      .andWhere('name', 'ilike', `%${name}%`)
      .paginate(pagination);
  }

  async findByNameAndNotOnAcademyById(name, academyId, pagination) {
    return createQuery(tableName)
      .leftJoin('Enrollment', function join() {
        this.on('Player.id', '=', 'Enrollment.playerId')
          .andOn('Enrollment.academyId', '=', academyId);
      })
      .whereNull('Enrollment.playerId')
      .andWhere('name', 'ilike', `%${name}%`)
      .paginate(pagination);
  }

  async create(player) {
    console.log({ player });
    return createQuery(tableName)
      .insert(player)
      .returning('id');
  }

  async delete(id) {
    return createQuery(tableName)
      .del()
      .where('id', '=', id);
  }

  async update(id, player) {
    return createQuery(tableName)
      .update(player)
      .where('id', '=', id);
  }
}

module.exports = PlayerRepository;
