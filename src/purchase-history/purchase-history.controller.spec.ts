import { Test, TestingModule } from '@nestjs/testing'
import { PurchaseHistoryController } from './purchase-history.controller'
import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { mockInvestingLog } from '../mocks/mockInvestingLog'
import { PurchaseHistoryService } from './purchase-history.service'
import { InvestingLogsService } from '../investing-logs/investing-logs.service'
import { AssetsService } from '../assets/assets.service'
jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {})
jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {})
jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {})
describe('PurchaseHistoryController', () => {
  let controller: PurchaseHistoryController
  let purchaseHistoryService: PurchaseHistoryService
  let investingLogsService: InvestingLogsService
  let assetService: AssetsService

  const mockUser = { id: 1 }

  const mockReq = {
    logId: 1,
    assetId: 10,
    purchasePrice: 100.5,
    quantity: 5.2,
  }

  const mockRes = {
    id: 1,
    logId: 1,
    assetId: 10,
    purchasePrice: 100.5,
    quantity: 5.2,
    createdAt: new Date(),
  }
  beforeEach(async () => {
    const mockPurchaseHistoryService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findAllByLogId: jest.fn(),
      delete: jest.fn(),
    }

    const mockInvestingLogsService = {
      findOne: jest.fn(),
    }

    const mockAssetService = {
      findOne: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseHistoryController],
      providers: [
        PurchaseHistoryService,
        {
          provide: PurchaseHistoryService,
          useValue: mockPurchaseHistoryService,
        },
        {
          provide: InvestingLogsService,
          useValue: mockInvestingLogsService,
        },
        {
          provide: AssetsService,
          useValue: mockAssetService,
        },
      ],
    }).compile()

    controller = module.get<PurchaseHistoryController>(
      PurchaseHistoryController,
    )
    purchaseHistoryService = module.get<PurchaseHistoryService>(
      PurchaseHistoryService,
    )
    investingLogsService =
      module.get<InvestingLogsService>(InvestingLogsService)
    assetService = module.get<AssetsService>(AssetsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  /* 1. 자산 추가 테스트 */
  describe('POST /investing-logs/{logId}/purchase-history/new', () => {
    it('인증된 사용자가 자산을 추가할 수 있다.', async () => {
      purchaseHistoryService.create = jest.fn().mockResolvedValue(mockRes)
      investingLogsService.findOne = jest
        .fn()
        .mockResolvedValue({ id: 1, user: mockUser })
      assetService.findOne = jest.fn().mockResolvedValue({ id: 10 })
      const result = await controller.create(
        { user: mockUser },
        mockReq.logId,
        mockReq,
      )

      expect(result).toEqual(mockRes)
      expect(purchaseHistoryService.create).toHaveBeenCalledWith(
        mockUser.id,
        mockReq.logId,
        mockReq,
      )
    })

    it('미인증 사용자는 자산을 추가할 수 없다.', async () => {
      await expect(
        controller.create(null, mockReq.logId, mockReq),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('자산 목록에 없는 자산을 추가하려고 하면 실패한다.', async () => {
      mockReq.assetId = 9999
      investingLogsService.findOne = jest
        .fn()
        .mockResolvedValue({ id: 1, user: mockUser })
      assetService.findOne = jest
        .fn()
        .mockRejectedValue(new NotFoundException())

      await expect(
        controller.create({ user: mockUser }, mockReq.logId, mockReq),
      ).rejects.toThrow(NotFoundException)
    })

    it('투자일지가 존재하지 않는 경우 실패한다.', async () => {
      mockReq.logId = 9999
      investingLogsService.findOne = jest
        .fn()
        .mockRejectedValue(new NotFoundException())
      //{ user: mockUser }, createPurchaseHistoryDto)
      await expect(
        controller.create({ user: mockUser }, mockReq.logId, mockReq),
      ).rejects.toThrow(NotFoundException)
    })
  })

  /* 2. 자산 목록 조회 테스트 */
  describe('GET /investing-logs/{:logId}/purchase-history/list', () => {
    it('인증된 사용자가 매수이력 목록을 조회할 수 있다.', async () => {
      purchaseHistoryService.findAllByLogId = jest
        .fn()
        .mockResolvedValue([mockRes])

      investingLogsService.findOne = jest
        .fn()
        .mockResolvedValue(mockInvestingLog)

      const result = await controller.findAll({ user: mockUser }, mockReq.logId)

      expect(result).toEqual([mockRes])
      expect(purchaseHistoryService.findAllByLogId).toHaveBeenCalledWith(
        mockUser.id,
        mockReq.logId,
      )
    })
    it('미인증 사용자는 매수이력 목록을 조회할 수 없다.', async () => {
      await expect(controller.findAll(null, mockReq.logId)).rejects.toThrow(
        UnauthorizedException,
      )
    })
    it('투자일지가 존재하지 않으면 실패한다.', async () => {
      mockReq.logId = 9999

      purchaseHistoryService.findAllByLogId = jest.fn().mockResolvedValue(null)

      await expect(
        controller.findAll({ user: mockUser }, mockReq.logId),
      ).rejects.toThrow(NotFoundException)
    })
  })

  /* 3. 자산 삭제 테스트 */
  describe('DELETE /investing-logs/{:logId}/purchase-history/{historyId}', () => {
    it('인증된 사용자가 매수이력을 삭제할 수 있다.', async () => {
      investingLogsService.findOne = jest
        .fn()
        .mockResolvedValue(mockInvestingLog)
      purchaseHistoryService.findOne = jest.fn().mockResolvedValue(mockRes)
      purchaseHistoryService.softDelete = jest.fn().mockResolvedValue(undefined)
      await expect(
        controller.remove({ user: mockUser }, mockReq.logId, mockRes.id),
      ).resolves.toEqual({ message: 'Purchase history successfully deleted' })
    })

    it('미인증 사용자는 매수이력을 삭제할 수 없다.', async () => {
      await expect(
        controller.remove(null, mockReq.logId, mockRes.id),
      ).rejects.toThrow(UnauthorizedException)
    })
    it('투자일지가 존재하지 않으면 실패한다.', async () => {
      mockReq.logId = 9999

      investingLogsService.findOne = jest.fn().mockResolvedValue(null)

      await expect(
        controller.remove({ user: mockUser }, mockReq.logId, mockUser.id),
      ).rejects.toThrow(NotFoundException)
    })
    it('삭제하려는 매수이력이 존재하지 않으면 실패한다.', async () => {
      mockRes.id = 9999
      purchaseHistoryService.findOne = jest.fn().mockResolvedValue(null)

      await expect(
        controller.remove({ user: mockUser }, mockReq.logId, mockRes.id),
      ).rejects.toThrow(NotFoundException)
    })
  })
})
