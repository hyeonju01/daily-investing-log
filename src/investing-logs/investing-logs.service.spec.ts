import { Test, TestingModule } from '@nestjs/testing'
import { InvestingLogsService } from './investing-logs.service'
import { UsersService } from '../users/users.service'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { InvestingLog } from './entities/investing-log.entity'
import { Repository } from 'typeorm'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { PurchaseHistory } from '../purchase-history/entities/purchase-history.entity'
import { User } from '../users/entities/user.entity'

describe('InvestingLogsService (Unit Test, No Database Connecting)', () => {
  let investingLogService: InvestingLogsService
  let investingLogRepository: Repository<InvestingLog>
  let purchaseHistoryRepository: Repository<PurchaseHistory>
  let userService: UsersService

  const mockDto = {
    title: 'test log of mock DTO',
    contents: 'test contents of mock DTO',
    investingDate: new Date('2024-02-19'),
  }
  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    investingLogs: [],
    refresh_token: null,
    created_at: new Date(),
    updated_at: new Date(),
  }

  // ✅ TypeScript 오류 방지를 위해 필요한 필드만 추가
  const mockInvestingLog: Partial<InvestingLog> = {
    id: 1,
    user: mockUser,
    title: 'Test Log',
    contents: 'Test Contents',
    investingDate: new Date(),
    purchaseHistories: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  }

  const mockPurchaseHistories = [
    { id: 1, investingLog: mockInvestingLog, isDeleted: false },
    { id: 2, investingLog: mockInvestingLog, isDeleted: false },
  ]

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    }

    const mockPurchaseHistoryRepo = {
      update: jest.fn(),
    }

    const mockUserService = {
      findById: jest.fn(),
      findAllByUserId: jest.fn(),
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
        {
          provide: getRepositoryToken(PurchaseHistory),
          useValue: mockPurchaseHistoryRepo,
        },
      ],
    }).compile()

    investingLogService = module.get<InvestingLogsService>(InvestingLogsService)
    investingLogRepository = module.get(getRepositoryToken(InvestingLog))
    purchaseHistoryRepository = module.get(getRepositoryToken(PurchaseHistory))
    userService = module.get(UsersService)

    jest.spyOn(userService, 'findById').mockResolvedValue(mockUser)
    jest
      .spyOn(investingLogRepository, 'findOne')
      .mockResolvedValue(mockInvestingLog as InvestingLog)
    jest
      .spyOn(purchaseHistoryRepository, 'update')
      .mockResolvedValue({ affected: 2 } as any)
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
    const mockInvestingLogs = [
      {
        id: 1,
        user: mockUser,
        title: 'Log 1',
        isDeleted: false,
      } as InvestingLog,
      {
        id: 2,
        user: mockUser,
        title: 'Log 2',
        isDeleted: false,
      } as InvestingLog,
    ]

    jest
      .spyOn(investingLogRepository, 'find')
      .mockResolvedValue(mockInvestingLogs)

    const result = await investingLogService.findAllByUserId(mockUser.id)

    expect(result).toEqual(mockInvestingLogs) // ✅ 기대값을 명확하게 설정
    expect(investingLogRepository.find).toHaveBeenCalledWith({
      where: { user: { id: mockUser.id }, isDeleted: false },
    })
  })

  it('should return an investing log by logId', async () => {
    ;(investingLogRepository.findOne as jest.Mock).mockResolvedValue(
      mockInvestingLog,
    )

    const result = await investingLogService.findOne(
      mockInvestingLog.id!,
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
      investingLogService.findOne(mockInvestingLog.id!, mockUser.id),
    ).rejects.toThrow(ForbiddenException)
  })

  it('투자일지를 soft delete하면 관련된 매수이력도 soft delete 된다.', async () => {
    // ;(investingLogRepository.findOne as jest.Mock)
    //   .mockResolvedValue(mockInvestingLog)(
    //     purchaseHistoryRepo.update as jest.Mock,
    //   )
    //   .mockResolvedValue({ affected: 2 } as any)
    // ;(investingLogRepository.update as jest.Mock).mockResolvedValue({
    //   affected: 1,
    // } as any)
    jest.spyOn(userService, 'findById').mockResolvedValue(mockUser)
    jest
      .spyOn(investingLogRepository, 'findOne')
      .mockResolvedValue(mockInvestingLog as any)
    jest
      .spyOn(purchaseHistoryRepository, 'update')
      .mockResolvedValue({ affected: 2 } as any)
    jest
      .spyOn(investingLogRepository, 'update')
      .mockResolvedValue({ affected: 1 } as any)

    await investingLogService.softDelete(mockInvestingLog.id!, mockUser.id)

    expect(purchaseHistoryRepository.update).toHaveBeenCalledWith(
      { investingLog: { id: mockInvestingLog.id } },
      { isDeleted: true },
    )
    expect(investingLogRepository.update).toHaveBeenCalledWith(1, {
      isDeleted: true,
    })
  })

  it('❌ 유저가 존재하지 않으면 NotFoundException을 던진다.', async () => {
    jest
      .spyOn(userService, 'findById')
      .mockResolvedValue(null as unknown as User)

    await expect(
      investingLogService.softDelete(mockInvestingLog.id!, mockUser.id),
    ).rejects.toThrow(NotFoundException)
  })

  it('❌ 투자일지가 해당 유저의 것이 아니면 ForbiddenException을 던진다.', async () => {
    jest.spyOn(investingLogRepository, 'findOne').mockResolvedValue({
      ...mockInvestingLog,
      user: { id: 999 },
    } as any)

    // ;(investingLogRepository.findOne as jest.Mock).mockResolvedValue({
    //   ...mockInvestingLog,
    //   user: { id: 999 },
    // })

    await expect(
      investingLogService.softDelete(mockInvestingLog.id!, mockUser.id),
    ).rejects.toThrow(ForbiddenException)
  })

  it('❌ 투자일지가 존재하지 않으면 NotFoundException을 던진다.', async () => {
    jest.spyOn(investingLogRepository, 'findOne').mockResolvedValue(null)

    await expect(
      investingLogService.softDelete(999, mockUser.id),
    ).rejects.toThrow(NotFoundException)
  })
})
