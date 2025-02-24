import { Test, TestingModule } from '@nestjs/testing'
import { InvestingLogsController } from './investing-logs.controller'
import { InvestingLogsService } from './investing-logs.service'

describe('InvestingLogsController', () => {
  let investingLogsController: InvestingLogsController
  let investingLogsService: InvestingLogsService

  const mockInvestingLog = {
    id: 1,
    user: { id: 1, email: 'test@example.com' },
    title: 'Test log title',
    contents: 'This is a Test Contents',
    investingDate: new Date('2024-02-19'),
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  }

  const mockInvestingLogService = {
    create: jest.fn().mockResolvedValue(mockInvestingLog),
    findAllByUserId: jest.fn().mockResolvedValue([mockInvestingLog]),
    findOne: jest.fn().mockResolvedValue(mockInvestingLog),
    softDelete: jest.fn(),
  }

  const mockRequest = {
    user: {
      id: 1,
      email: 'test@example.com',
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestingLogsController],
      providers: [
        {
          provide: InvestingLogsService,
          useValue: mockInvestingLogService,
        },
      ],
    }).compile()

    investingLogsController = module.get<InvestingLogsController>(
      InvestingLogsController,
    )
  })

  it('should be defined', () => {
    expect(investingLogsController).toBeDefined()
  })

  it('should create an investing log', async () => {
    const dto = {
      title: mockInvestingLog.title,
      contents: mockInvestingLog.contents,
      investingDate: mockInvestingLog.investingDate,
    }
    const result = await investingLogsController.createInvestingLog(
      mockRequest,
      dto,
    )
    expect(result).toEqual(mockInvestingLog)
    expect(mockInvestingLogService.create).toHaveBeenCalledWith(
      mockRequest.user.id,
      dto,
    )
  })

  it('should find one investing log', async () => {
    const result = await investingLogsController.getInvestingLogById(
      mockRequest,
      mockInvestingLog.id,
    )

    expect(result).toEqual(mockInvestingLog)
    expect(mockInvestingLogService.findOne).toHaveBeenCalledWith(
      mockInvestingLog.id,
      mockRequest.user.id,
    )
  })

  it('should find all investing logs', async () => {
    const result =
      await investingLogsController.getAllInvestingLogs(mockRequest)

    expect(result).toEqual([mockInvestingLog])
    expect(mockInvestingLogService.findAllByUserId).toHaveBeenCalledWith(
      mockRequest.user.id,
    )
  })

  it('should soft delete an investing log', async () => {
    const result = await investingLogsController.deleteInvestingLog(
      mockRequest,
      mockInvestingLog.id,
    )
    expect(result).toBeUndefined()
    expect(mockInvestingLogService.softDelete).toHaveBeenCalledWith(
      mockInvestingLog.id,
      mockRequest.user.id,
    )
  })
})
