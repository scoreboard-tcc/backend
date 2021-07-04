exports.seed = (knex) => knex('Enrollment').del()
  .then(() => knex('Enrollment').insert([
    {
      academyId: 1,
      playerId: 1,
    },
    {
      academyId: 1,
      playerId: 2,
    },
  ]));
