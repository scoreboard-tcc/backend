const ListScoreboardWithMatchesUseCase = require('./ListScoreboardsWithMatchesUseCase');
const crypto = require('crypto');

describe('ListScoreboardsWithMatchesUseCase', () => {
  test('Retorna placares e informações da partida', async () => {
    const mockScoreboardRepository = {
      findByAcademyIdWithMatches: jest.fn(() => [
        {
          id: 1,
          description: 'Placar quadra 1',
          match: null,
        },
        {
          id: 2,
          description: 'Placar quadra 2',
          match: {
            id: 1,
            listed: true,
            pin: true,
            publishToken: 'secret',
          },
        },
        {
          id: 3,
          description: 'Placar quadra 3',
          match: {
            id: 2,
            listed: true,
            pin: true,
            publishToken: 'secret2',
          },
        },
      ]),
    };

    const useCase = new ListScoreboardWithMatchesUseCase({
      scoreboardRepository: mockScoreboardRepository,
    });

    const publishTokenHashes = [
      crypto.createHash('sha1').update('secret').digest('hex'),
      crypto.createHash('sha1').update('secrets2').digest('hex'),
    ];

    const scoreboards = await useCase.execute(1, publishTokenHashes);

    expect(scoreboards).toHaveLength(3);
    expect(scoreboards[0]).toStrictEqual({
      id: 1,
      description: 'Placar quadra 1',
      match: null,
    });

    expect(scoreboards[1]).toStrictEqual({
      id: 2,
      description: 'Placar quadra 2',
      match: {
        id: 1,
        listed: true,
        pin: true,
        controlledByCurrentUser: true,
      },
    });

    expect(scoreboards[2]).toStrictEqual({
      id: 3,
      description: 'Placar quadra 3',
      match: {
        id: 2,
        listed: true,
        pin: true,
        controlledByCurrentUser: false,
      },
    });
  });
});
