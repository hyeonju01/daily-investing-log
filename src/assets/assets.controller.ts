import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { AssetsService } from './assets.service'
import { CreateAssetDto } from './dto/create-asset.dto'
import { UpdateAssetDto } from './dto/update-asset.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('자산종목')
@Controller('/api/assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: '자산 종목 목록을 조회합니다.' })
  @ApiResponse({ status: 201 })
  async getAllAssets() {
    return this.assetsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: '자산 ID로 자산 종목을 조회합니다.' })
  @ApiResponse({ status: 201 })
  async getAssetById(@Param('id') id: number) {
    return this.assetsService.findOne(+id)
  }
}
