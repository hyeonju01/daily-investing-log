import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateAssetDto } from './dto/create-asset.dto'
import { UpdateAssetDto } from './dto/update-asset.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Asset } from './entities/asset.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetsRepository: Repository<Asset>,
  ) {}

  async findAll(): Promise<Asset[]> {
    return this.assetsRepository.find()
  }

  async findOne(id: number): Promise<Asset> {
    const asset = await this.assetsRepository.findOne({
      where: { id },
    })

    if (!asset) {
      throw new NotFoundException('No such asset')
    }

    return asset
  }

  /* 추후 구현 예정 */
  // update(id: number, updateAssetDto: UpdateAssetDto) {
  //   return `This action updates a #${id} asset`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} asset`;
  // }
  // create(createAssetDto: CreateAssetDto) {
  //   return 'This action adds a new asset';
  // }
}
