import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { AuthService } from '../auth/auth.service'
import { BadRequestException } from '@nestjs/common'
import { mockInvestingLog } from '../mocks/mockInvestingLog'

describe('UsersService', () => {
  let usersService: UsersService
  let userRepository: Repository<User>
  let authService: AuthService

  // 가짜 사용자
  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    investingLogs: [],
    refresh_token: null,
    created_at: new Date(),
    updated_at: new Date(),
  }

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  }

  const mockAuthService = {
    issueAccessToken: jest.fn().mockResolvedValue('mockAccessToken'),
    issueRefreshToken: jest.fn().mockResolvedValue('mockRefreshToken'),
  }

  beforeEach(async () => {
    // 테스트용 모듈 생성
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        // userRepository, AuthService
        UsersService,
        {
          provide: getRepositoryToken(User), // 가짜 리포지토리 주입
          useValue: mockRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile()

    usersService = module.get<UsersService>(UsersService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(usersService).toBeDefined()
  })

  it('should be defined', () => {
    expect(userRepository).toBeDefined()
  })

  it('should create an instance of UsersService', () => {
    expect(usersService).toBeInstanceOf(UsersService)
  })

  it('should create a user', async () => {
    const createUserDto = { email: 'test@test.com', password: 'test' }

    jest.spyOn(bcrypt, 'genSalt').mockImplementation(async (rounds) => {
      console.log('▶️ bcrypt.genSalt() called with:', rounds)
      return `randomSalt${rounds}`
    })
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async () => 'hashedPassword123')

    mockRepository.create.mockReturnValue({
      id: 1,
      email: createUserDto.email,
      password: 'hashedPassword123',
      created_at: new Date(),
      updated_at: new Date(),
    } as User)

    mockRepository.save.mockResolvedValue({
      id: 1,
      email: createUserDto.email,
      password: 'hashedPassword123',
      created_at: new Date(),
      updated_at: new Date(),
    } as User)

    const result = await usersService.signUp(createUserDto)

    console.log('▶️ Created User:', result)

    expect(bcrypt.genSalt).toHaveBeenCalledWith(expect.any(Number))
    expect(bcrypt.genSalt).toHaveBeenCalledTimes(1)

    expect(bcrypt.hash).toHaveBeenCalledWith(
      createUserDto.password,
      'randomSalt10',
    )
    expect(bcrypt.hash).toHaveBeenCalledTimes(1)

    // bcrypt.compare() 검증
    // const isPasswordCorrectly = await bcrypt.compare(createUserDto.password, result.password);
    // expect(isPasswordCorrectly).toBe(true);

    expect(result).toEqual({
      id: expect.any(Number),
      email: createUserDto.email,
      password: 'hashedPassword123',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    })

    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: createUserDto.email }),
    )
    expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Object))
  })

  it('✅ should sign up a new user successfully', async () => {
    mockRepository.findOne.mockResolvedValue(null) // 이메일 중복 확인
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async () => 'hashedPassword123')
    mockRepository.create.mockReturnValue(mockUser)
    mockRepository.save.mockResolvedValue(mockUser)

    expect(
      await usersService.signUp({
        email: 'test@example.com',
        password: 'password123',
      }),
    ).toEqual(mockUser)
  })

  it('❌ should throw error if email already exists', async () => {
    mockRepository.findOne.mockResolvedValue(mockUser) // 이메일 중복 발견

    await expect(
      usersService.signUp({
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(BadRequestException)
  })

  it('✅ should log in successfully', async () => {
    mockRepository.findOne.mockResolvedValue(mockUser)
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true)

    expect(
      await usersService.signIn({
        email: 'test@example.com',
        password: 'password123',
      }),
    ).toEqual({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    })
  })

  it('❌ should throw error if password is incorrect', async () => {
    mockRepository.findOne.mockResolvedValue(mockUser)
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false) // 비밀번호 불일치

    await expect(
      usersService.signIn({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow(BadRequestException)
  })
})
