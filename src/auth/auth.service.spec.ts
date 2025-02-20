import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { User } from '../users/entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('AuthService', () => {
  let authService: AuthService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockJwtToken'),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mockSecret'),
          },
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be able to sign in', async () => {
    expect(await authService.issueAccessToken(1, 'test@example.com')).toBe(
      'mockJwtToken',
    )
  })

  it('should issue a refresh token', async () => {
    expect(await authService.issueRefreshToken(1)).toBe('mockJwtToken')
  })
})
