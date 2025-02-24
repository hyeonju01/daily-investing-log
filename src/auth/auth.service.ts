import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { LoginUserDto } from '../users/dto/login-user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /* Access Token 발급 */
  async issueAccessToken(id: number, email: string): Promise<string> {
    return this.jwtService.sign(
      { sub: id, email: email },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      },
    )
  }

  /* Refresh Token 발급 */
  async issueRefreshToken(id: number): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { sub: id },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      },
    )

    await this.storeRefreshToken(id, refreshToken) // 사용자 엔티티에 refresh Token 저장

    return refreshToken
  }

  /* Access Token 재발급 */
  async reIssueAccessToken(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })

      const isValid = this.validateRefreshToken(payload.sub, oldRefreshToken)

      if (!isValid) {
        throw new UnauthorizedException('만료된 리프레쉬 토큰입니다.')
      }

      const newAccessToken = await this.issueAccessToken(
        payload.sub,
        payload.email,
      )

      const newRefreshToken = await this.issueRefreshToken(payload.sub)

      await this.storeRefreshToken(payload.sub, newRefreshToken)

      return { accessToken: newAccessToken, refreshToken: newRefreshToken }
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
  }

  /* RT 저장 */
  async storeRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedRT = await bcrypt.hash(refreshToken, 10)
    await this.UserRepository.update(userId, { refresh_token: hashedRT })
  }

  /* RT 검증 */
  private async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.UserRepository.findOne({ where: { id: userId } })

    if (!user || !user.refresh_token) {
      return false
    }

    const isValid = await bcrypt.compare(refreshToken, user.refresh_token)
    return isValid
  }

  /* 로그아웃 */
  async logout(userId: number): Promise<{ message: string }> {
    const user = await this.UserRepository.findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    await this.UserRepository.update(userId, { refresh_token: null })
    return { message: 'Successfully logged out' }
  }
}
