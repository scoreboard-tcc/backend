const SearchAcademiesUseCase = require('./SearchAcademiesUseCase');

describe('SearchAcademiesUseCase', () => {
  test('Busca academias pelo nome', async () => {
    const mockAcademyRepository = {
      findByName: jest.fn(() => [{ id: 1 }]),
    };

    const searchAcademiesUseCase = new SearchAcademiesUseCase(
      {
        academyRepository: mockAcademyRepository,
      },
    );
    const academies = await searchAcademiesUseCase.execute('name', {});

    expect(academies).toStrictEqual([{ id: 1 }]);
    expect(mockAcademyRepository.findByName).toHaveBeenCalledTimes(1);
    expect(mockAcademyRepository.findByName).toHaveBeenCalledWith('name', {});
  });
});
