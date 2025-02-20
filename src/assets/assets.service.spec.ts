import { Test, TestingModule } from '@nestjs/testing'
import { AssetsService } from './assets.service'
import { Repository } from 'typeorm'
import { Asset } from './entities/asset.entity'
import { mockAsset, mockAssetArray } from '../mocks/mockAsset'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('AssetsService', () => {
  let assetService: AssetsService
  let assetRepository: Repository<Asset>

  // Repository<Asset> Mocking
  const mockRepository = {
    find: jest.fn().mockResolvedValue(mockAssetArray),
    findOne: jest.fn().mockResolvedValue(mockAsset),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetsService,
        {
          provide: getRepositoryToken(Asset),
          useValue: mockRepository,
        },
      ],
    }).compile()

    assetService = module.get<AssetsService>(AssetsService)
    assetRepository = module.get<Repository<Asset>>(getRepositoryToken(Asset))
  })

  it('should be defined', () => {
    expect(assetService).toBeDefined()
  })

  // 모든 자산 조회
  it('should return all assets', async () => {
    const result = await assetService.findAll()
    expect(result).toEqual(mockAssetArray)
    expect(assetRepository.find).toHaveBeenCalledTimes(1)
  })

  it('should return a single asset by ID', async () => {
    const result = await assetService.findOne(1)
    expect(result).toEqual(mockAsset)
    expect(assetRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
  })
})
