import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
    private UserRepository: Repository<User>,
    private jwtService: JwtService, // readOnl?
    private configService: ConfigService, // readOnly?
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
    // 사용자 엔티티에 refresh Token 저장
    await this.storeRefreshToken(id, refreshToken)

    // return `Issue Refresh Completed. Refresh Token: ${refreshToken}`
    return refreshToken
  }

  /* Access Token 재발급 */
  async reIssueAccessToken(userId: number, oldRefreshToken: string) {
    const isValid = this.validateRefreshToken(userId, oldRefreshToken)
    if (!isValid) {
      throw new UnauthorizedException('Invalid Token')
    }

    const newAccessToken = await this.issueAccessToken(userId, oldRefreshToken)

    const newRefreshToken = await this.issueRefreshToken(userId)
    await this.storeRefreshToken(userId, newRefreshToken)

    return { accessToken: newAccessToken }
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

  /* 이메일 인증 토큰 발급 */
  async sendEmailVerification(email: string): Promise<string> {
    const user = await this.UserRepository.findOne({ where: { email } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified')
    }

    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      },
    )

    // TODO: 이메일 발송 로직 추가 (메일 서비스 사용)
    console.log(
      `🔗 Email verification link: http://localhost:3000/api/auth/verify-email/${token}`,
    )

    return token
  }

  /* 이메일 인증 확인 */
  async verifyEmail(token: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })

      const user = await this.UserRepository.findOne({
        where: { id: payload.sub },
      })
      if (!user) {
        throw new NotFoundException('User not found')
      }

      if (user.isEmailVerified) {
        throw new BadRequestException('Email is already verified')
      }

      user.isEmailVerified = true
      await this.UserRepository.save(user)

      return 'Email verified successfully'
    } catch (error) {
      throw new BadRequestException('Invalid or expired token')
    }
  }
}
