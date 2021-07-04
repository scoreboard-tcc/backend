exports.seed = (knex) => knex('Academy').del()
  .then(() => knex('Academy').insert([
    {
      id: 5,
      subdomain: 'mouraotennis',
      name: 'Mourão Tennis',
      address: 'Rua 123',
      logoUrl: 'https://firebasestorage.googleapis.com/v0/b/scoreboard-31923.appspot.com/o/logos%2Fmourao_tennis.png?alt=media&token=6cde6e2e-7842-4739-b066-8f6df3b5995f',
    },
  ]));
