const AlreadyUsedException = require('../../../exceptions/AlreadyUsedException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const ValidationException = require('../../../exceptions/ValidationException');
const UpdateAcademyUseCase = require('./UpdateAcademyUseCase');

describe('UpdateAcademyUseCase', () => {
  test('Gera exceção se ocorrer erro na validação #1', async () => {
    const useCase = new UpdateAcademyUseCase({
      academyRepository: null,
      getAcademyByIdUseCase: null,
    });

    await expect(useCase.execute())
      .rejects
      .toThrow(ValidationException);
  });

  test('Gera exceção se ocorrer erro na validação #2', async () => {
    const useCase = new UpdateAcademyUseCase({
      academyRepository: null,
      getAcademyByIdUseCase: null,
    });

    await expect(useCase.execute(1, {}))
      .rejects
      .toThrow(ValidationException);
  });

  test('Gera exceção se academia não existir', async () => {
    const mockGetAcademyByIdUseCase = {
      execute: jest.fn(() => {
        throw new NotFoundException();
      }),
    };

    const useCase = new UpdateAcademyUseCase({
      academyRepository: null,
      getAcademyByIdUseCase: mockGetAcademyByIdUseCase,
    });

    await expect(useCase.execute(1, {
      name: 'Club',
      subdomain: 'club',
      address: 'address',
    }))
      .rejects
      .toThrow(NotFoundException);

    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledWith(1);
  });

  test('Gera exceção se o subdomínio já for utilizado por outra pessoa', async () => {
    const mockGetAcademyByIdUseCase = {
      execute: jest.fn(() => {}),
    };

    const mockAcademyRepository = {
      findBySubdomain: jest.fn(() => ({ id: 2 })),
    };

    const useCase = new UpdateAcademyUseCase({
      academyRepository: mockAcademyRepository,
      getAcademyByIdUseCase: mockGetAcademyByIdUseCase,
    });

    await expect(useCase.execute(1, {
      name: 'Club',
      subdomain: 'club',
      address: 'address',
    }))
      .rejects
      .toThrow(AlreadyUsedException);

    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledWith(1);

    expect(mockAcademyRepository.findBySubdomain).toHaveBeenCalledTimes(1);
    expect(mockAcademyRepository.findBySubdomain).toHaveBeenCalledWith('club');
  });

  test('Atualiza a academia se o subdomíno estiver disponível', async () => {
    const mockGetAcademyByIdUseCase = {
      execute: jest.fn(() => {}),
    };

    const mockAcademyRepository = {
      findBySubdomain: jest.fn(() => undefined),
      update: jest.fn(() => {}),
    };

    const useCase = new UpdateAcademyUseCase({
      academyRepository: mockAcademyRepository,
      getAcademyByIdUseCase: mockGetAcademyByIdUseCase,
    });

    await useCase.execute(1, {
      name: 'Club',
      subdomain: 'club',
      address: 'address',
    });

    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledWith(1);

    expect(mockAcademyRepository.findBySubdomain).toHaveBeenCalledTimes(1);
    expect(mockAcademyRepository.findBySubdomain).toHaveBeenCalledWith('club');

    expect(mockAcademyRepository.update).toHaveBeenCalledTimes(1);
    expect(mockAcademyRepository.update).toHaveBeenCalledWith(1, {
      name: 'Club',
      subdomain: 'club',
      address: 'address',
      additionalInfo: undefined,
      logoUrl: 'https://uilogos.co/img/logomark/hexa.png',
    });
  });

  test('Atualiza a academia se o subdomíno estiver disponível (atual)', async () => {
    const mockGetAcademyByIdUseCase = {
      execute: jest.fn(() => {}),
    };

    const mockAcademyRepository = {
      findBySubdomain: jest.fn(() => ({ id: 1 })),
      update: jest.fn(() => {}),
    };

    const useCase = new UpdateAcademyUseCase({
      academyRepository: mockAcademyRepository,
      getAcademyByIdUseCase: mockGetAcademyByIdUseCase,
    });

    await useCase.execute(1, {
      name: 'Club',
      subdomain: 'club',
      address: 'address',
    });

    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockGetAcademyByIdUseCase.execute).toHaveBeenCalledWith(1);

    expect(mockAcademyRepository.findBySubdomain).toHaveBeenCalledTimes(1);
    expect(mockAcademyRepository.findBySubdomain).toHaveBeenCalledWith('club');

    expect(mockAcademyRepository.update).toHaveBeenCalledTimes(1);
    expect(mockAcademyRepository.update).toHaveBeenCalledWith(1, {
      name: 'Club',
      subdomain: 'club',
      address: 'address',
      additionalInfo: undefined,
      logoUrl: 'https://uilogos.co/img/logomark/hexa.png',
    });
  });
});
