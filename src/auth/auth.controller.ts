import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { LoginUserDto } from '../users/dto/login-user.dto'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('사용자')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/signUp')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201 })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUp(createUserDto)
  }

  @Post('/signIn')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 201 })
  async signIn(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    /* refresh token을 쿠키에 저장하는 로직 작성*/

    return this.usersService.signIn(loginUserDto)
  }

  @Post('/send-email-verification/:email')
  async sendEmailVerification(@Param('email') email: string) {
    return this.authService.sendEmailVerification(email)
  }

  @Get('/verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token)
  }
}
