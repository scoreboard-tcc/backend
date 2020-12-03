const jwt = require('jsonwebtoken');

const BusinessException = require('../../../exceptions/BusinessException');
const ValidationException = require('../../../exceptions/ValidationException');
const AuthenticateCoordinatorUseCase = require('./AuthenticateCoordinatorUseCase');
const config = require('../../../config/secrets');
const NotFoundException = require('../../../exceptions/NotFoundException');

describe('AuthenticateCoordinatorUseCase', () => {
  test('Gera exceção se ocorrer erro na validação', async () => {
    const useCase = new AuthenticateCoordinatorUseCase({
      coordinatorRepository: null,
    });

    try {
      await useCase.execute();
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationException);
    }
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

    try {
      await useCase.execute({
        email: 'john@doe.com',
        password: '123456',
        academySubdomain: 'club',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(mockGetAcademyBySubdomainUseCase.execute).toHaveBeenCalledWith('club');
    }
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

    try {
      await useCase.execute({
        email: 'john@doe.com',
        password: '123456',
        academySubdomain: 'club',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessException);
      expect(mockGetAcademyBySubdomainUseCase.execute).toHaveBeenCalledWith('club');
      expect(mockCoordinatorRepository.findByAcademyIdAndEmailAndPassword).toHaveBeenCalledWith(1, 'john@doe.com', '123456');
    }
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
      email: 'john@doe.com',
      password: '123456',
      academySubdomain: 'club',
    });

    const decoded = jwt.decode(token);

    expect(decoded.email).toBe('john@doe.com');
    expect(decoded.type).toBe('coordinator');
    expect(decoded.academy).toStrictEqual({
      id: 1,
      subdomain: 'club',
      name: 'Club',
    });
  });
});
