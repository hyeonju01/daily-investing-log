import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { LoginUserDto } from '../users/dto/login-user.dto'

@Controller('/api/users/auth')
export class AuthController {
  constructor(
    // private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/signUp')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUp(createUserDto)
  }
  @Post('/signIn')
  async signIn(@Body() loginUserDto: LoginUserDto) {
    /* refresh token을 쿠키에 저장하는 로직 작성*/

    return this.usersService.signIn(loginUserDto)
  }
}
