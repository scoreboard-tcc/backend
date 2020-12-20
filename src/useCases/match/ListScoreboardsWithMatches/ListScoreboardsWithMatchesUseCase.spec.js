const ListScoreboardWithMatchesUseCase = require('./ListScoreboardsWithMatchesUseCase');

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
          },
        },
        {
          id: 3,
          description: 'Placar quadra 3',
          match: {
            id: 2,
            listed: true,
            pin: true,
          },
        },
      ]),
    };

    const useCase = new ListScoreboardWithMatchesUseCase({
      scoreboardRepository: mockScoreboardRepository,
    });

    const scoreboards = await useCase.execute(1);

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
      },
    });

    expect(scoreboards[2]).toStrictEqual({
      id: 3,
      description: 'Placar quadra 3',
      match: {
        id: 2,
        listed: true,
        pin: true,
      },
    });

    expect(mockScoreboardRepository.findByAcademyIdWithMatches).toHaveBeenCalledTimes(1);
    expect(mockScoreboardRepository.findByAcademyIdWithMatches).toHaveBeenCalledWith(1);
  });
});
