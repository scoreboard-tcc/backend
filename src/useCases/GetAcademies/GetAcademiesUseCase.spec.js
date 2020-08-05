const GetAcademiesUseCase = require('./GetAcademiesUseCase');

describe('GetAcademiesUseCase', () => {
  test('It returns academies', async () => {
    const mockAcademyRepository = {
      findAll: jest.fn(() => [{ id: 1 }]),
    };

    const getAcademiesUseCase = new GetAcademiesUseCase(mockAcademyRepository);
    const academies = await getAcademiesUseCase.execute();

    expect(academies).toStrictEqual([{ id: 1 }]);
    expect(mockAcademyRepository.findAll).toHaveBeenCalledTimes(1);
  });

  test('It returns academies searching by name', async () => {
    const mockAcademyRepository = {
      findByName: jest.fn(() => [{ id: 1 }]),
    };

    const getAcademiesUseCase = new GetAcademiesUseCase(mockAcademyRepository);
    const academies = await getAcademiesUseCase.execute('name', {});

    expect(academies).toStrictEqual([{ id: 1 }]);
    expect(mockAcademyRepository.findByName).toHaveBeenCalledTimes(1);
    expect(mockAcademyRepository.findByName).toHaveBeenCalledWith('name', {});
  });
});
