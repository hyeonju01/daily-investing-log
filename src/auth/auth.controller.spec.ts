import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { Repository } from 'typeorm'

describe('AuthController', () => {
  let authController: AuthController
  let userService: UsersService

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'hashedPassword',
    refresh_token: null,
    created_at: new Date(),
    updated_at: new Date(),
  }

  const mockUserService = {
    signUp: jest.fn().mockResolvedValue(mockUser),
    signIn: jest.fn().mockResolvedValue({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    userService = module.get(UsersService)
  })

  it('should sign up a user successfully', async () => {
    expect(
      await authController.signUp({
        email: 'test@test.com',
        password: 'hashedPassword',
      }),
    ).toEqual(mockUser)

    expect(mockUserService.signUp).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'hashedPassword',
    })
  })

  it('should throw error if sign up fails', async () => {
    jest
      .spyOn(mockUserService, 'signUp')
      .mockRejectedValue(new Error('Email already exists'))

    await expect(
      authController.signUp({
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('Email already exists')
  })

  it('should log in a user successfully', async () => {
    const mockToken = {
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    }
    jest.spyOn(mockUserService, 'signIn').mockResolvedValue(mockToken)

    expect(
      await authController.signIn({
        email: 'test@example.com',
        password: 'password123',
      }),
    ).toEqual(mockToken)
  })

  it('should throw error if login fails', async () => {
    jest
      .spyOn(userService, 'signIn')
      .mockRejectedValue(new Error('Invalid credentials'))

    await expect(
      authController.signIn({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow('Invalid credentials')
  })
})
