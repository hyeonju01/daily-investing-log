import { Test, TestingModule } from '@nestjs/testing'
import { JwtStrategy } from './jwt.strategy'
import { ConfigService } from '@nestjs/config'

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy
  let mockConfigService: Partial<ConfigService>

  beforeEach(async () => {
    mockConfigService = { get: jest.fn().mockReturnValue('testSecretKey') }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile()

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy)
  })

  it('✅ should be defined', () => {
    expect(jwtStrategy).toBeDefined()
  })

  it('✅ should validate and return user data', async () => {
    const payload = { sub: 1, email: 'test@example.com' }
    const result = await jwtStrategy.validate(payload)

    expect(result).toEqual({ id: 1, email: 'test@example.com' })
  })
})
