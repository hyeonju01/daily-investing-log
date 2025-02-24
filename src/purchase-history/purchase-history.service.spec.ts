import { Test, TestingModule } from '@nestjs/testing'
import { PurchaseHistoryService } from './purchase-history.service'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { PurchaseHistory } from './entities/purchase-history.entity'
import { InvestingLog } from '../investing-logs/entities/investing-log.entity'
import { Asset } from '../assets/entities/asset.entity'
import { NotFoundException } from '@nestjs/common'
import { mockInvestingLog } from '../mocks/mockInvestingLog'
import { User } from '../users/entities/user.entity'

describe('PurchaseHistoryService', () => {
  let service: PurchaseHistoryService
  let purchaseHistoryRepo: Repository<PurchaseHistory>
  let investingLogRepo: Repository<InvestingLog>
  let assetRepo: Repository<Asset>
  let userRepo: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseHistoryService,
        {
          provide: getRepositoryToken(PurchaseHistory),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(InvestingLog),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Asset),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<PurchaseHistoryService>(PurchaseHistoryService)
    purchaseHistoryRepo = module.get<Repository<PurchaseHistory>>(
      getRepositoryToken(PurchaseHistory),
    )
    investingLogRepo = module.get<Repository<InvestingLog>>(
      getRepositoryToken(InvestingLog),
    )
    assetRepo = module.get<Repository<Asset>>(getRepositoryToken(Asset))
    userRepo = module.get<Repository<User>>(getRepositoryToken(User))
  })

  it('✅ should create a new purchase history', async () => {
    const mockUser = { id: 1 } as User
    const mockInvestingLog = { id: 1, user: mockUser } as InvestingLog
    const mockAsset = { id: 1 } as Asset

    const mockPurchaseHistory = {
      id: 1,
      user: mockUser,
      investingLog: mockInvestingLog,
      asset: mockAsset,
      purchasePrice: 100.5,
      purchaseVolume: 5.2,
      isDeleted: false,
    } as PurchaseHistory

    const dto = {
      assetId: mockAsset.id,
      purchasePrice: mockPurchaseHistory.purchasePrice,
      quantity: mockPurchaseHistory.purchaseVolume,
    }

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser)
    jest.spyOn(investingLogRepo, 'findOne').mockResolvedValue(mockInvestingLog)
    jest.spyOn(assetRepo, 'findOne').mockResolvedValue(mockAsset)
    jest
      .spyOn(purchaseHistoryRepo, 'create')
      .mockReturnValue(mockPurchaseHistory)
    jest
      .spyOn(purchaseHistoryRepo, 'save')
      .mockResolvedValue(mockPurchaseHistory)

    const result = await service.create(mockUser.id, mockInvestingLog.id, dto)

    expect(result).toEqual(mockPurchaseHistory)
    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { id: mockUser.id },
    })
    expect(investingLogRepo.findOne).toHaveBeenCalledWith({
      where: { id: mockInvestingLog.id },
    })
    expect(assetRepo.findOne).toHaveBeenCalledWith({
      where: { id: dto.assetId },
    })
    expect(purchaseHistoryRepo.save).toHaveBeenCalledWith(mockPurchaseHistory)
  })

  it('❌ should fail if investing log does not exist', async () => {
    const mockUser = { id: 1 } as User
    const dto = { logId: 999, assetId: 1, purchasePrice: 100, quantity: 5 }

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser)
    jest.spyOn(investingLogRepo, 'findOne').mockResolvedValue(null)

    await expect(service.create(mockUser.id, 999, dto)).rejects.toThrow(
      NotFoundException,
    )
  })

  it('❌ should fail if asset does not exist', async () => {
    const mockUser = { id: 1 } as User
    const mockInvestingLog = { id: 1, user: mockUser } as InvestingLog
    const dto = { assetId: 999, purchasePrice: 100, quantity: 5 }

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser)
    jest.spyOn(investingLogRepo, 'findOne').mockResolvedValue(mockInvestingLog)
    jest.spyOn(assetRepo, 'findOne').mockResolvedValue(null)

    await expect(
      service.create(mockUser.id, mockInvestingLog.id, dto),
    ).rejects.toThrow(NotFoundException)
  })

  it('✅ should soft delete a purchase history', async () => {
    const mockPurchaseHistory = {
      id: 1,
      investingLog: { id: 1 },
      isDeleted: false,
    }

    jest
      .spyOn(purchaseHistoryRepo, 'findOne')
      .mockResolvedValue(mockPurchaseHistory as any)
    jest
      .spyOn(purchaseHistoryRepo, 'update')
      .mockResolvedValue({ affected: 1 } as any)
    jest.spyOn(investingLogRepo, 'findOne').mockResolvedValue(1 as any)
    await service.softDelete(1, 1, 1)

    expect(purchaseHistoryRepo.update).toHaveBeenCalledWith(1, {
      isDeleted: true,
    })
  })

  it('❌ should fail if purchase history does not exist', async () => {
    jest.spyOn(purchaseHistoryRepo, 'findOne').mockResolvedValue(null)

    await expect(service.softDelete(1, 1, 999)).rejects.toThrow(
      NotFoundException,
    )
  })

  /** ❌ 투자일지가 존재하지 않을 경우 */
  it('❌ should fail if investing log does not exist when finding all histories', async () => {
    jest.spyOn(investingLogRepo, 'findOne').mockResolvedValue(null)

    await expect(service.findAllByLogId(1, 999)).rejects.toThrow(
      NotFoundException,
    )
  })
})
