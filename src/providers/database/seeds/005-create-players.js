exports.seed = (knex) => knex('Player').del()
  .then(() => knex('Player').insert([
    {
      id: 1,
      email: 'jose@gmail.com',
      name: 'José',
    },
    {
      id: 2,
      email: 'ana@gmail.com',
      name: 'Ana',
    },
  ]));
