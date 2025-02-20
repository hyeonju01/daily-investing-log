import { Test, TestingModule } from '@nestjs/testing'
import { AssetsController } from './assets.controller'
import { AssetsService } from './assets.service'
import { mockAsset, mockAssetArray } from '../mocks/mockAsset'

describe('AssetsController', () => {
  let assetController: AssetsController
  let assetService: AssetsService

  const mockAssetService = {
    findAll: jest.fn().mockResolvedValue(mockAssetArray),
    findOne: jest.fn().mockResolvedValue(mockAsset),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [
        {
          provide: AssetsService,
          useValue: mockAssetService,
        },
      ],
    }).compile()

    assetController = module.get<AssetsController>(AssetsController)
    assetService = module.get(AssetsService)
  })

  it('should be defined', () => {
    expect(assetController).toBeDefined()
  })

  it('should return all assets', async () => {
    const result = await assetController.getAllAssets()
    expect(result).toEqual(mockAssetArray)
    expect(assetService.findAll).toHaveBeenCalledTimes(1)
  })

  it('should return a single asset by ID', async () => {
    const result = await assetController.getAssetById(1)
    expect(result).toEqual(mockAsset)
    expect(assetService.findOne).toHaveBeenCalledWith(1)
  })
})
