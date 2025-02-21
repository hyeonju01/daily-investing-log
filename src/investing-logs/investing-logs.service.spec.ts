import { Test, TestingModule } from '@nestjs/testing'
import { InvestingLogsService } from './investing-logs.service'
import { UsersService } from '../users/users.service'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { InvestingLog } from './entities/investing-log.entity'
import { Repository } from 'typeorm'
import { mockInvestingLog } from '../mocks/mockInvestingLog'
import { mockUser } from '../mocks/mockUser'
import { ForbiddenException, NotFoundException } from '@nestjs/common'

describe('InvestingLogsService (Unit Test, No Database Connecting)', () => {
  let investingLogService: InvestingLogsService
  let investingLogRepository: jest.Mocked<Partial<Repository<InvestingLog>>>
  let userService: UsersService

  const mockDto = {
    title: 'test log of mock DTO',
    contents: 'test contents of mock DTO',
    investingDate: new Date('2024-02-19'),
  }

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      remove: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
    }

    const mockUserService = {
      findById: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestingLogsService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: getRepositoryToken(InvestingLog),
          useValue: mockRepository,
        },
      ],
    }).compile()

    investingLogService = module.get<InvestingLogsService>(InvestingLogsService)
    investingLogRepository = module.get(getRepositoryToken(InvestingLog))
    userService = module.get(UsersService)
  })

  it('should be defined', () => {
    expect(investingLogService).toBeDefined()
    expect(investingLogRepository).toBeDefined()
    expect(userService).toBeDefined()
  })

  it('should create an investing log', async () => {
    const newInvestingLog = {
      id: 2,
      user: mockUser,
      title: mockDto.title,
      contents: mockDto.contents,
      investingDate: mockDto.investingDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(userService.findById as jest.Mock).mockResolvedValue(mockUser)
    ;(investingLogRepository.create as jest.Mock).mockReturnValue(
      newInvestingLog,
    )
    ;(investingLogRepository.save as jest.Mock).mockResolvedValue(
      newInvestingLog,
    )

    const result = await investingLogService.create(mockUser.id, mockDto)

    expect(result).toEqual(newInvestingLog)

    expect(investingLogRepository.create).toHaveBeenCalledWith({
      user: mockUser,
      title: mockDto.title,
      contents: mockDto.contents,
      investingDate: mockDto.investingDate,
    })
    expect(investingLogRepository.save).toHaveBeenCalledWith(newInvestingLog)
  })

  it('should return a list of investing log for a user', async () => {
    const result = await investingLogService.findAllByUserId(mockUser.id)
    console.log(result)
    expect(result).toEqual(result)
  })

  it('should return an investing log by logId', async () => {
    ;(investingLogRepository.findOne as jest.Mock).mockResolvedValue(
      mockInvestingLog,
    )

    const result = await investingLogService.findOne(
      mockInvestingLog.id,
      mockUser.id,
    )

    expect(result).toEqual(mockInvestingLog)
    expect(investingLogRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockInvestingLog.id },
      relations: ['user'],
    })
  })

  it('should throw NotFoundException when investing log does not exist.', async () => {
    ;(investingLogRepository.findOne as jest.Mock).mockResolvedValue(null)

    const nonExistentId = 9999

    await expect(
      investingLogService.findOne(nonExistentId, mockUser.id),
    ).rejects.toThrow(NotFoundException)
  })
  it('should throw ForbiddenException if the log does not belong to the user.', async () => {
    ;(investingLogRepository.findOne as jest.Mock).mockResolvedValue({
      ...mockInvestingLog,
      user: { id: 999 },
    })

    await expect(
      investingLogService.findOne(mockInvestingLog.id, mockUser.id),
    ).rejects.toThrow(ForbiddenException)
  })

  it('should delete an investing log.', async () => {
    ;(investingLogRepository.findOne as jest.Mock).mockResolvedValue(
      mockInvestingLog,
    )
    ;(investingLogRepository.remove as jest.Mock).mockResolvedValue(undefined)

    await investingLogService.deleteInvestingLog(
      mockInvestingLog.id,
      mockUser.id,
    )
    expect(investingLogRepository.remove).toHaveBeenCalledWith(mockInvestingLog)
  })
  it('should throw NotFoundException if log to delete does not exist', async () => {
    ;(investingLogRepository.findOne as jest.Mock).mockResolvedValue(null)
    await expect(
      investingLogService.deleteInvestingLog(999, mockUser.id),
    ).rejects.toThrow(NotFoundException)
  })
  it('should throw ForbiddenException if the user does not own the log', async () => {
    ;(investingLogRepository.findOne as jest.Mock).mockResolvedValue({
      ...mockInvestingLog,
      user: { id: 999 },
    })
    await expect(
      investingLogService.deleteInvestingLog(mockInvestingLog.id, mockUser.id),
    ).rejects.toThrow(ForbiddenException)
  })
})
