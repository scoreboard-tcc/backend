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
    {
      academyId: 5,
      playerId: 3,
    },
    {
      academyId: 5,
      playerId: 4,
    },
  ]));
