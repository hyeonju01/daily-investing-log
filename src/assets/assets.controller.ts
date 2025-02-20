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

@Controller('/api/assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async getAllAssets() {
    return this.assetsService.findAll()
  }

  @Get(':id')
  async getAssetById(@Param('id') id: number) {
    return this.assetsService.findOne(+id)
  }

  // @Post()
  // create(@Body() createAssetDto: CreateAssetDto) {
  //   return this.assetsService.create(createAssetDto);
  // }
  //
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
  //   return this.assetsService.update(+id, updateAssetDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.assetsService.remove(+id);
  // }
}
