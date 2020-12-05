const jwt = require('jsonwebtoken');

const config = require('../../../config/secrets');
const BusinessException = require('../../../exceptions/BusinessException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const ValidationException = require('../../../exceptions/ValidationException');
const AuthenticateCoordinatorUseCase = require('./AuthenticateCoordinatorUseCase');

const email = 'john@doe.com';
const password = '123456';

describe('AuthenticateCoordinatorUseCase', () => {
  test('Gera exceção se ocorrer erro na validação', async () => {
    const useCase = new AuthenticateCoordinatorUseCase({
      coordinatorRepository: null,
    });

    await expect(useCase.execute())
      .rejects
      .toThrow(ValidationException);
  });

  test('Gera exceção se não encontrar academia', async () => {
    const mockGetAcademyBySubdomainUseCase = {
      execute: jest.fn(() => {
        throw new NotFoundException();
      }),
    };

    const useCase = new AuthenticateCoordinatorUseCase({
      getAcademyBySubdomainUseCase: mockGetAcademyBySubdomainUseCase,
    });

    await expect(useCase.execute({
      email: 'john@doe.com',
      password: '123456',
      academySubdomain: 'club',
    }))
      .rejects
      .toThrow(NotFoundException);

    expect(mockGetAcademyBySubdomainUseCase.execute).toHaveBeenCalledWith('club');
  });

  test('Gera exceção se credenciais forem inválidas', async () => {
    const mockGetAcademyBySubdomainUseCase = {
      execute: jest.fn(() => ({
        id: 1,
      })),
    };

    const mockCoordinatorRepository = {
      findByAcademyIdAndEmailAndPassword: jest.fn(() => {
        throw new BusinessException();
      }),
    };

    const useCase = new AuthenticateCoordinatorUseCase({
      getAcademyBySubdomainUseCase: mockGetAcademyBySubdomainUseCase,
      coordinatorRepository: mockCoordinatorRepository,
    });

    await expect(useCase.execute({
      email,
      password,
      academySubdomain: 'club',
    }))
      .rejects
      .toThrow(BusinessException);

    expect(mockGetAcademyBySubdomainUseCase.execute).toHaveBeenCalledWith('club');
    expect(mockCoordinatorRepository.findByAcademyIdAndEmailAndPassword).toHaveBeenCalledWith(1, email, password);
  });

  test('Retorna token se credenciais forem válidas', async () => {
    const mockGetAcademyBySubdomainUseCase = {
      execute: jest.fn(() => ({
        id: 1,
        subdomain: 'club',
        name: 'Club',
      })),
    };

    const mockCoordinatorRepository = {
      findByAcademyIdAndEmailAndPassword: jest.fn(() => {}),
    };

    const useCase = new AuthenticateCoordinatorUseCase({
      getAcademyBySubdomainUseCase: mockGetAcademyBySubdomainUseCase,
      coordinatorRepository: mockCoordinatorRepository,
    });

    jest.mock('../../../config/secrets');

    config.jwtSecret = 'secret';

    const token = await useCase.execute({
      email,
      password,
      academySubdomain: 'club',
    });

    const decoded = jwt.decode(token);

    expect(decoded.email).toBe(email);
    expect(decoded.type).toBe('coordinator');
    expect(decoded.academy).toStrictEqual({
      id: 1,
      subdomain: 'club',
      name: 'Club',
    });
  });
});
