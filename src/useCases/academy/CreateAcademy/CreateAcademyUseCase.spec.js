const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const ValidationException = require('../../../exceptions/ValidationException');
const CreateAcademyUseCase = require('./CreateAcademyUseCase');

describe('CreateAcademyUseCase', () => {
  test('Gera exceção se ocorrer erro na validação', async () => {
    const useCase = new CreateAcademyUseCase({
      academyRepository: null,
      createScoreboardUseCase: null,
      createCoordinatorUseCase: null,
    });

    try {
      await useCase.execute({});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationException);
    }
  });

  test('Gera exceção se o subdomínio já está sendo utilizado', async () => {
    const mockCheckIfSubdomainIsAvailableUseCase = {
      execute: jest.fn(() => false),
    };

    const useCase = new CreateAcademyUseCase({
      academyRepository: null,
      createScoreboardUseCase: null,
      createCoordinatorUseCase: null,
      checkIfSubdomainIsAvailableUseCase: mockCheckIfSubdomainIsAvailableUseCase,
    });

    const academy = {
      subdomain: 'club',
      name: 'Club',
      address: 'address',
    };

    const scoreboards = [];

    const coordinator = {
      name: 'John',
      email: 'john@doe.com',
      password: '123456',
    };

    try {
      await useCase.execute({
        ...academy,
        scoreboards,
        coordinator,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AlreadyUsedException);
    }
  });

  test('Cria academia se o subdomínio estiver disponível', async () => {
    const mockCheckIfSubdomainIsAvailableUseCase = {
      execute: jest.fn(() => true),
    };

    const mockAcademyRepository = {
      create: jest.fn(() => [1]),
    };

    const mockCreateScoreboardUseCase = {
      execute: jest.fn(() => {}),
    };

    const mockCreateCoordinatorUseCase = {
      execute: jest.fn(() => {}),
    };

    const useCase = new CreateAcademyUseCase({
      academyRepository: mockAcademyRepository,
      createScoreboardUseCase: mockCreateScoreboardUseCase,
      createCoordinatorUseCase: mockCreateCoordinatorUseCase,
      checkIfSubdomainIsAvailableUseCase: mockCheckIfSubdomainIsAvailableUseCase,
    });

    const academy = {
      subdomain: 'club',
      name: 'Club',
      address: 'address',
    };

    const scoreboards = [];

    const coordinator = {
      name: 'John',
      email: 'john@doe.com',
      password: '123456',
    };

    await useCase.execute({
      ...academy,
      scoreboards,
      coordinator,
    });

    expect(mockCheckIfSubdomainIsAvailableUseCase.execute.mock.calls.length).toBe(1);
    expect(mockCheckIfSubdomainIsAvailableUseCase.execute.mock.calls[0][0]).toBe('club');

    expect(mockAcademyRepository.create.mock.calls.length).toBe(1);
    expect(mockAcademyRepository.create.mock.calls[0][0]).toStrictEqual({ ...academy, logoUrl: 'https://uilogos.co/img/logomark/hexa.png' });

    expect(mockCreateScoreboardUseCase.execute.mock.calls.length).toBe(1);
    expect(mockCreateScoreboardUseCase.execute.mock.calls[0][0]).toBe(1);
    expect(mockCreateScoreboardUseCase.execute.mock.calls[0][1]).toStrictEqual(scoreboards);

    expect(mockCreateCoordinatorUseCase.execute.mock.calls.length).toBe(1);
    expect(mockCreateCoordinatorUseCase.execute.mock.calls[0][0]).toBe(1);
    expect(mockCreateCoordinatorUseCase.execute.mock.calls[0][1]).toStrictEqual(coordinator);
  });
});
