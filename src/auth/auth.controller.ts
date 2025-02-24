import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common'
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
import { JwtAuthGuard } from './jwt-auth.guard'

@ApiTags('사용자')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/signUp')
  @ApiOperation({ summary: '회원가입 및 이메일 인증' })
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
    return this.usersService.signIn(loginUserDto)
  }

  @Post('/verify-email')
  @ApiOperation({ summary: '이메일 인증' })
  async verifyEmail(@Query('token') token: string) {
    return this.usersService.verifyEmail(token)
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: '비밀번호 재설정 요청' })
  async forgotPassword(@Body('email') email: string) {
    return this.usersService.forgotPassword(email)
  }

  @Post('/reset-password')
  @ApiOperation({ summary: '비밀번호 재설정' })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.usersService.resetPassword(token, newPassword)
  }

  @Post('/refresh-token')
  @ApiOperation({ summary: '액세스 토큰을 재발급합니다.' })
  @ApiResponse({ status: 201, description: '새로운 Access Token 발급' })
  @ApiResponse({ status: 401, description: '유효하지 않은 Refresh Token' })
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.reIssueAccessToken(body.refreshToken)
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 201 })
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.id)
  }
}
