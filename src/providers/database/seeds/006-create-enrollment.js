exports.seed = (knex) => knex('Enrollment').del()
  .then(() => knex('Enrollment').insert([
    {
      academyId: 5,
      playerId: 1,
    },
    {
      academyId: 5,
      playerId: 2,
    },
  ]));
