const { addMinutes } = require('date-fns');
const BusinessException = require('../../../exceptions/BusinessException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const ValidationException = require('../../../exceptions/ValidationException');
const CreateMatchUseCase = require('./CreateMatchUseCase');

describe('CreateMatchUseCase', () => {
  test('Gera exceção se ocorrer erro na validação', async () => {
    const useCase = new CreateMatchUseCase({});

    await expect(useCase.execute(1, {}))
      .rejects
      .toThrow(ValidationException);
  });

  test('Gera exceção se não encontrar a academia', async () => {
    const mockGetAcademyByIdUseCase = {
      execute: jest.fn(() => {
        throw new NotFoundException();
      }),
    };

    const useCase = new CreateMatchUseCase({
      getAcademyByIdUseCase: mockGetAcademyByIdUseCase,
    });

    await expect(useCase.execute(1, {
      scoreboardId: 1,
      duration: 30,
      player1Id: 1,
      player2Id: 2,
      listed: true,
    }))
      .rejects
      .toThrow(NotFoundException);

    expect(mockGetAcademyByIdUseCase.execute).toBeCalledTimes(1);
    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledWith(1);
  });

  test('Gera exceção se não encontrar o placar', async () => {
    const mockGetAcademyByIdUseCase = {
      execute: jest.fn(() => ({ id: 1 })),
    };

    const mockScoreboardRepository = {
      findByIdAndAcademyIdAndActive: jest.fn(() => undefined),
    };

    const useCase = new CreateMatchUseCase({
      getAcademyByIdUseCase: mockGetAcademyByIdUseCase,
      scoreboardRepository: mockScoreboardRepository,
    });

    await expect(useCase.execute(1, {
      scoreboardId: 1,
      duration: 30,
      player1Id: 1,
      player2Id: 2,
      listed: true,
    }))
      .rejects
      .toThrow(NotFoundException);

    expect(mockGetAcademyByIdUseCase.execute).toBeCalledTimes(1);
    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledWith(1);

    expect(mockScoreboardRepository.findByIdAndAcademyIdAndActive).toBeCalledTimes(1);
    expect(mockScoreboardRepository.findByIdAndAcademyIdAndActive).toHaveBeenCalledWith(1, 1);
  });

  test('Gera exceção se o placar não estiver disponível', async () => {
    const mockGetAcademyByIdUseCase = {
      execute: jest.fn(() => ({ id: 1 })),
    };

    const mockScoreboardRepository = {
      findByIdAndAcademyIdAndActive: jest.fn(() => ({ id: 1 })),
      checkIfIsAvailable: jest.fn(() => false),
    };

    const useCase = new CreateMatchUseCase({
      getAcademyByIdUseCase: mockGetAcademyByIdUseCase,
      scoreboardRepository: mockScoreboardRepository,
    });

    await expect(useCase.execute(1, {
      scoreboardId: 1,
      duration: 30,
      player1Id: 1,
      player2Id: 2,
      listed: true,
    }))
      .rejects
      .toThrowError(new BusinessException('O placar não está disponível.'));

    expect(mockGetAcademyByIdUseCase.execute).toBeCalledTimes(1);
    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledWith(1);

    expect(mockScoreboardRepository.findByIdAndAcademyIdAndActive).toBeCalledTimes(1);
    expect(mockScoreboardRepository.findByIdAndAcademyIdAndActive).toHaveBeenCalledWith(1, 1);

    expect(mockScoreboardRepository.checkIfIsAvailable).toBeCalledTimes(1);
    expect(mockScoreboardRepository.checkIfIsAvailable).toHaveBeenCalledWith(1, 1);
  });

  test('Gera exceção se não encontrar o jogador 1', async () => {
    const mockGetAcademyByIdUseCase = {
      execute: jest.fn(() => ({ id: 1 })),
    };

    const mockScoreboardRepository = {
      findByIdAndAcademyIdAndActive: jest.fn(() => ({ id: 1 })),
      checkIfIsAvailable: jest.fn(() => true),
    };

    const mockEnrollmentRepository = {
      findByAcademyIdAndPlayerId: jest.fn(() => null),
    };

    const useCase = new CreateMatchUseCase({
      getAcademyByIdUseCase: mockGetAcademyByIdUseCase,
      scoreboardRepository: mockScoreboardRepository,
      enrollmentRepository: mockEnrollmentRepository,
    });

    await expect(useCase.execute(1, {
      scoreboardId: 1,
      duration: 30,
      player1Id: 1,
      listed: true,
    }))
      .rejects
      .toThrowError(new BusinessException('Um ou mais jogadores não estão matriculados na academia'));

    expect(mockGetAcademyByIdUseCase.execute).toBeCalledTimes(1);
    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledWith(1);

    expect(mockScoreboardRepository.findByIdAndAcademyIdAndActive).toBeCalledTimes(1);
    expect(mockScoreboardRepository.findByIdAndAcademyIdAndActive).toHaveBeenCalledWith(1, 1);

    expect(mockScoreboardRepository.checkIfIsAvailable).toBeCalledTimes(1);
    expect(mockScoreboardRepository.checkIfIsAvailable).toHaveBeenCalledWith(1, 1);

    expect(mockEnrollmentRepository.findByAcademyIdAndPlayerId).toHaveBeenCalledTimes(1);
    expect(mockEnrollmentRepository.findByAcademyIdAndPlayerId).toHaveBeenCalledWith(1, 1);
  });

  test('Gera exceção se não encontrar o jogador 2', async () => {
    const mockGetAcademyByIdUseCase = {
      execute: jest.fn(() => ({ id: 1 })),
    };

    const mockScoreboardRepository = {
      findByIdAndAcademyIdAndActive: jest.fn(() => ({ id: 1 })),
      checkIfIsAvailable: jest.fn(() => true),
    };

    const mockEnrollmentRepository = {
      findByAcademyIdAndPlayerId: jest.fn(() => null),
    };

    const useCase = new CreateMatchUseCase({
      getAcademyByIdUseCase: mockGetAcademyByIdUseCase,
      scoreboardRepository: mockScoreboardRepository,
      enrollmentRepository: mockEnrollmentRepository,
    });

    await expect(useCase.execute(1, {
      scoreboardId: 1,
      duration: 30,
      player2Id: 1,
      listed: true,
    }))
      .rejects
      .toThrowError(new BusinessException('Um ou mais jogadores não estão matriculados na academia'));

    expect(mockGetAcademyByIdUseCase.execute).toBeCalledTimes(1);
    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledWith(1);

    expect(mockScoreboardRepository.findByIdAndAcademyIdAndActive).toBeCalledTimes(1);
    expect(mockScoreboardRepository.findByIdAndAcademyIdAndActive).toHaveBeenCalledWith(1, 1);

    expect(mockScoreboardRepository.checkIfIsAvailable).toBeCalledTimes(1);
    expect(mockScoreboardRepository.checkIfIsAvailable).toHaveBeenCalledWith(1, 1);

    expect(mockEnrollmentRepository.findByAcademyIdAndPlayerId).toHaveBeenCalledTimes(1);
    expect(mockEnrollmentRepository.findByAcademyIdAndPlayerId).toHaveBeenCalledWith(1, 1);
  });

  test('Cria a partida sem o pin', async () => {
    const mockGetAcademyByIdUseCase = {
      execute: jest.fn(() => ({ id: 1 })),
    };

    const mockScoreboardRepository = {
      findByIdAndAcademyIdAndActive: jest.fn(() => ({ id: 1 })),
      checkIfIsAvailable: jest.fn(() => true),
    };

    const mockEnrollmentRepository = {
      findByAcademyIdAndPlayerId: jest.fn(() => ({ playerId: 1 })),
    };

    const mockMatchRepository = {
      create: jest.fn(() => ({ id: 6 })),
    };

    const useCase = new CreateMatchUseCase({
      getAcademyByIdUseCase: mockGetAcademyByIdUseCase,
      scoreboardRepository: mockScoreboardRepository,
      enrollmentRepository: mockEnrollmentRepository,
      matchRepository: mockMatchRepository,
    });

    const mockDate = new Date();
    const spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate);

    const tokens = await useCase.execute(1, {
      scoreboardId: 1,
      duration: 30,
      player1Id: 1,
      listed: true,
    });

    spy.mockRestore();

    expect(tokens.id).toBe(6);
    expect(tokens.expiration).toBe(mockDate);

    expect(tokens).toHaveProperty('publishToken');
    expect(tokens.publishToken).not.toBeNull();

    expect(tokens).toHaveProperty('refreshToken');
    expect(tokens.refreshToken).not.toBeNull();

    expect(tokens).toHaveProperty('subscribeToken');
    expect(tokens.subscribeToken).toBeNull();

    expect(mockGetAcademyByIdUseCase.execute).toBeCalledTimes(1);
    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledWith(1);

    expect(mockScoreboardRepository.findByIdAndAcademyIdAndActive).toBeCalledTimes(1);
    expect(mockScoreboardRepository.findByIdAndAcademyIdAndActive).toHaveBeenCalledWith(1, 1);

    expect(mockScoreboardRepository.checkIfIsAvailable).toBeCalledTimes(1);
    expect(mockScoreboardRepository.checkIfIsAvailable).toHaveBeenCalledWith(1, 1);

    expect(mockEnrollmentRepository.findByAcademyIdAndPlayerId).toHaveBeenCalledTimes(1);
    expect(mockEnrollmentRepository.findByAcademyIdAndPlayerId).toHaveBeenCalledWith(1, 1);

    expect(mockMatchRepository.create).toHaveBeenCalledTimes(1);
  });

  test('Cria a partida com o pin', async () => {
    const mockGetAcademyByIdUseCase = {
      execute: jest.fn(() => ({ id: 1 })),
    };

    const mockScoreboardRepository = {
      findByIdAndAcademyIdAndActive: jest.fn(() => ({ id: 1 })),
      checkIfIsAvailable: jest.fn(() => true),
    };

    const mockEnrollmentRepository = {
      findByAcademyIdAndPlayerId: jest.fn(() => ({ playerId: 1 })),
    };

    const mockMatchRepository = {
      create: jest.fn(() => ({ id: 6 })),
    };

    const useCase = new CreateMatchUseCase({
      getAcademyByIdUseCase: mockGetAcademyByIdUseCase,
      scoreboardRepository: mockScoreboardRepository,
      enrollmentRepository: mockEnrollmentRepository,
      matchRepository: mockMatchRepository,
    });

    const mockDate = new Date();
    const spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate);

    const tokens = await useCase.execute(1, {
      scoreboardId: 1,
      duration: 30,
      player1Id: 1,
      listed: true,
      pin: '1234',
    });

    spy.mockRestore();

    expect(tokens.id).toBe(6);
    expect(tokens.expiration).toBe(mockDate);

    expect(tokens).toHaveProperty('publishToken');
    expect(tokens.publishToken).not.toBeNull();

    expect(tokens).toHaveProperty('refreshToken');
    expect(tokens.refreshToken).not.toBeNull();

    expect(tokens).toHaveProperty('subscribeToken');
    expect(tokens.subscribeToken).not.toBeNull();

    expect(mockGetAcademyByIdUseCase.execute).toBeCalledTimes(1);
    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledWith(1);

    expect(mockScoreboardRepository.findByIdAndAcademyIdAndActive).toBeCalledTimes(1);
    expect(mockScoreboardRepository.findByIdAndAcademyIdAndActive).toHaveBeenCalledWith(1, 1);

    expect(mockScoreboardRepository.checkIfIsAvailable).toBeCalledTimes(1);
    expect(mockScoreboardRepository.checkIfIsAvailable).toHaveBeenCalledWith(1, 1);

    expect(mockEnrollmentRepository.findByAcademyIdAndPlayerId).toHaveBeenCalledTimes(1);
    expect(mockEnrollmentRepository.findByAcademyIdAndPlayerId).toHaveBeenCalledWith(1, 1);

    expect(mockMatchRepository.create).toHaveBeenCalledTimes(1);
  });
});
