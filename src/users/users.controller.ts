/* 사용하지 않는 컨트롤러, 삭제 예정 */

import { Controller, Get, Body } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post('/join')
  // async create(
  //   @Body() createUserDto: CreateUserDto,
  // ): Promise<{ message: string }> {
  //   await this.usersService.signUp(createUserDto)
  //   return { message: 'success' }
  // }
  //
  // @Get()
  // findAll() {
  //   return this.usersService.findAll()
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id)
  // }
}
