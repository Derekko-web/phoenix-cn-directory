import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const registerDto = { email: 'test@example.com', password: 'password123' };
    const result = {
      access_token: 'token',
      refresh_token: 'refresh_token',
      user: { id: '1', email: 'test@example.com', locale: 'en', roles: ['user'] },
    };

    mockAuthService.register.mockResolvedValue(result);

    expect(await controller.register(registerDto)).toBe(result);
    expect(authService.register).toHaveBeenCalledWith(registerDto);
  });

  it('should refresh token', async () => {
    const refreshToken = 'refresh_token';
    const result = { access_token: 'new_token' };

    mockAuthService.refreshToken.mockResolvedValue(result);

    expect(await controller.refresh(refreshToken)).toBe(result);
    expect(authService.refreshToken).toHaveBeenCalledWith(refreshToken);
  });
});