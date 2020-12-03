const jwt = require('jsonwebtoken');

const BusinessException = require('../../../exceptions/BusinessException');
const ValidationException = require('../../../exceptions/ValidationException');
const AuthenticateAdminUseCase = require('./AuthenticateAdminUseCase');
const config = require('../../../config/secrets');

describe('AuthenticateAdminUseCase', () => {
  test('Gera exceção se ocorrer erro na validação', async () => {
    const useCase = new AuthenticateAdminUseCase({
      adminRepository: null,
    });

    try {
      await useCase.execute();
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationException);
    }
  });

  test('Gera exceção se credenciais forem inválidas', async () => {
    const mockAdminRepository = {
      findByEmailAndPassword: jest.fn(() => {
        throw new BusinessException();
      }),
    };

    const useCase = new AuthenticateAdminUseCase({
      adminRepository: mockAdminRepository,
    });

    try {
      await useCase.execute({
        email: 'john@doe.com',
        password: '123456',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessException);
      expect(mockAdminRepository.findByEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(mockAdminRepository.findByEmailAndPassword).toHaveBeenCalledWith('john@doe.com', '123456');
    }
  });

  test('Retorna token se credenciais forem válidas', async () => {
    const mockAdminRepository = {
      findByEmailAndPassword: jest.fn(() => {}),
    };

    const useCase = new AuthenticateAdminUseCase({
      adminRepository: mockAdminRepository,
    });

    jest.mock('../../../config/secrets');

    config.jwtSecret = 'secret';

    const token = await useCase.execute({
      email: 'john@doe.com',
      password: '123456',
    });

    const decoded = jwt.decode(token);

    expect(decoded.email).toBe('john@doe.com');
    expect(decoded.type).toBe('administrator');
  });
});
