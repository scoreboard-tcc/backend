exports.seed = (knex) => knex('Scoreboard').del()
  .then(() => knex('Scoreboard').insert([
    {
      id: 777,
      serialNumber: 'mt_001',
      academyId: 5,
      description: 'Placar quadra 1',
      staticToken: '1',
    },
    {
      id: 888,
      serialNumber: 'mt_002',
      academyId: 5,
      description: 'Placar quadra 2',
      staticToken: '1',
    }, {
      id: 999,
      serialNumber: 'mt_003',
      academyId: 5,
      description: 'Placar quadra 3',
      staticToken: '1',
    },
  ]));
