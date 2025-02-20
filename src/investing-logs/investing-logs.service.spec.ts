import { Test, TestingModule } from '@nestjs/testing'
import { InvestingLogsService } from './investing-logs.service'
import { UsersService } from '../users/users.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { InvestingLog } from './entities/investing-log.entity'
import { Repository } from 'typeorm'

describe('InvestingLogsService', () => {
  let investingLogService: InvestingLogsService
  let investingLogRepository: Repository<InvestingLog>
  let userService: UsersService

  const mockInvestingLog = {
    id: 1,
    user: { id: 230 },
    title: 'Test Investing Log',
    contents: 'This is a test investing log entry.',
    investingDate: new Date('2024-02-19'),
    createdAt: new Date('2024-02-19'),
    updatedAt: new Date('2024-02-19'),
  }

  const mockDto = {
    title: 'test log of mock DTO',
    contents: 'test contents of mock DTO',
    investingDate: new Date('2024-02-19'),
  }

  const mockUser = {
    id: 230,
    email: 'test@example.com',
    password: 'hashedPassword',
    investingLog: [mockInvestingLog],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockInvestingLogRepository = {
    create: jest
      .fn()
      .mockImplementation(({ user, title, contents, investingDate }) => ({
        id: 1,
        userId: user,
        title: title,
        contents: contents,
        investingDate: new Date(investingDate),
        createdAt: new Date('2024-02-19'),
        updatedAt: new Date('2024-02-19'),
      })),
    save: jest.fn().mockResolvedValue(mockInvestingLog),
    find: jest.fn().mockResolvedValue([mockInvestingLog]),
    findOne: jest.fn().mockResolvedValue(mockInvestingLog),
    remove: jest.fn().mockResolvedValue(undefined),
  }

  const mockUserService = {
    findById: jest.fn().mockResolvedValue({
      id: mockUser.id,
      email: mockUser.email,
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestingLogsService,
        {
          provide: getRepositoryToken(InvestingLog),
          useValue: mockInvestingLogRepository,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile()

    investingLogService = module.get<InvestingLogsService>(InvestingLogsService)
    investingLogRepository = module.get<Repository<InvestingLog>>(
      getRepositoryToken(InvestingLog),
    )
    userService = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(investingLogService).toBeDefined()
    expect(investingLogRepository).toBeDefined()
  })

  it('should create an investing log', async () => {
    const result = await investingLogService.create(mockUser.id, mockDto)
    console.log(new Date(mockDto.investingDate))

    expect(mockInvestingLogRepository.create).toHaveBeenCalledWith({
      user: { id: mockUser.id, email: mockUser.email },
      title: mockDto.title,
      contents: mockDto.contents,
      investingDate: new Date(mockDto.investingDate),
    })

    expect(result).toMatchObject({
      id: expect.any(Number),
      userId: { id: mockUser.id, email: mockUser.email },
      title: mockDto.title,
      contents: mockDto.contents,
      investingDate: new Date('2024-02-19'),
      createdAt: new Date('2024-02-19'),
      updatedAt: new Date('2024-02-19'),
    })
  })

  it('should return a list of investing log for a user', async () => {})

  it('should return an investing log by logId', async () => {})
  it('should throw NotFoundException when investing log does not exist.', async () => {})
  it('should throw ForbiddenException if the log does not belong to the user.', async () => {})

  it('should delete an investing log.', async () => {})
  it('should throw NotFoundException if log to delete does not exist', async () => {})
  it('should throw ForbiddenException if the user does not own the log', async () => {})
})
