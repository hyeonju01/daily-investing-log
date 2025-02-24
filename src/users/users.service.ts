import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { LoginUserDto } from './dto/login-user.dto'
import { AuthService } from '../auth/auth.service'
import { MailService } from '../mail/mail.service'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    private AuthService: AuthService,
    private mailService: MailService,
  ) {}

  /* 1. 회원가입 */
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`회원가입 요청: ${JSON.stringify(createUserDto)}`)
    const { email, password } = createUserDto
    if (!email || !password) {
      throw new BadRequestException('Email and password is required')
    }

    // 이메일 중복 확인
    const existingUser = await this.UserRepository.findOne({
      where: { email: email },
    })
    if (existingUser) {
      throw new BadRequestException('Email already exits with existing user')
    }

    // 비밀번호 해싱
    const hashedPass = await this.hashPassword(password)

    // 이메일 인증 토큰 생성
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')

    const newUser = this.UserRepository.create({
      email,
      password: hashedPass,
      emailVerificationToken,
      isEmailVerified: false,
    })
    const createdUser = await this.UserRepository.save(newUser)

    await this.mailService.sendVerificationEmail(email, emailVerificationToken)

    /* 토큰 발급 로직 추가 */
    const accessToken = this.AuthService.issueAccessToken(
      createdUser.id,
      createdUser.email,
    )
    const refreshToken = this.AuthService.issueRefreshToken(createdUser.id)

    this.logger.log(`회원가입 성공 - userId: ${createdUser.id}`)
    return createdUser
  }

  /* 2. 이메일 인증 */
  async verifyEmail(token: string): Promise<void> {
    const user = await this.UserRepository.findOne({
      where: { emailVerificationToken: token },
    })

    if (!user) {
      throw new BadRequestException('유효하지 않은 인증 토큰입니다.')
    }

    user.isEmailVerified = true
    user.emailVerificationToken = null
    await this.UserRepository.save(user)

    this.logger.log(`✅ 이메일 인증 성공 - userId: ${user.id}`)
    // return { message: 'Email verified successfully' }
  }

  /* 3. 로그인 */
  async signIn(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(`로그인 요청: ${JSON.stringify(loginUserDto)}`)

    const user = await this.UserRepository.findOne({
      where: { email: loginUserDto.email },
    }) // 이메일 검증

    if (!user || !user.email) {
      throw new BadRequestException('존재하지 않는 이메일입니다.')
    }

    const comparePassword = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    ) // 비밀번호 검증

    if (!comparePassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.')
    }

    const accessToken = await this.AuthService.issueAccessToken(
      user.id,
      user.email,
    ) // 액세스 토큰 발급
    const refreshToken = await this.AuthService.issueRefreshToken(user.id)

    this.logger.log(`로그인 성공 - userId: ${user.id}`)
    return { accessToken, refreshToken }
  }

  /* 4. 회원 조회 */
  async findById(userId: number): Promise<User> {
    this.logger.log(`사용자 조회 요청: ${JSON.stringify(userId)}`)
    const user = await this.UserRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.')
    }
    this.logger.log(`사용자 조회 성공 - userId: ${user.id}`)
    return user
  }

  /* 5. 비밀번호 암호화 */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    this.logger.log(`비밀번호 암호화 완료`)
    return await bcrypt.hash(password, salt)
  }

  /* 6. 비밀번호 재설정 요청 (토큰 발송) */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.UserRepository.findOne({ where: { email } })
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.')
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    user.passwordResetToken = resetToken
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1시간 유효시간 설정

    await this.UserRepository.save(user)
    await this.mailService.sendPasswordResetEmail(user.email, resetToken) // // 비밀번호 재설정 이메일 전송
    this.logger.log(`비밀번호 재설정 이메일 발송 - userId: ${user.id}`)
  }

  /* 7. 비밀번호 초기화 */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.UserRepository.findOne({
      where: {
        passwordResetToken: token,
      },
    })

    if (!user || user.passwordResetExpires! < new Date()) {
      throw new BadRequestException('유효하지 않거나 만료된 토큰입니다.')
    }

    user.password = await bcrypt.hash(newPassword, 10)
    user.passwordResetToken = null
    user.passwordResetExpires = null

    await this.UserRepository.save(user)
    this.logger.log(`✅ 비밀번호 재설정 완료 - userId: ${user.id}`)
  }
}
