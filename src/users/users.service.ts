import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    private AuthService: AuthService,
  ) {}

  // 회원가입
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

    const newUser = this.UserRepository.create({ email, password: hashedPass })
    const createdUser = await this.UserRepository.save(newUser)

    /* 토큰 발급 로직 추가 */
    const accessToken = this.AuthService.issueAccessToken(
      createdUser.id,
      createdUser.email,
    )
    const refreshToken = this.AuthService.issueRefreshToken(createdUser.id)
    this.logger.log(`회원가입 성공 - userId: ${createdUser.id}`)
    return createdUser
  }

  // 로그인
  async signIn(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(`로그인 요청: ${JSON.stringify(loginUserDto)}`)
    // 이메일 검증
    const user = await this.UserRepository.findOne({
      where: { email: loginUserDto.email },
    })

    if (!user || !user.email) {
      throw new BadRequestException('Email and password is required')
    }

    // 비밀번호 검증
    const comparePassword = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    )

    if (!comparePassword) {
      throw new BadRequestException('Invalid credentials')
    }

    // 토큰 발급
    const accessToken = await this.AuthService.issueAccessToken(
      user.id,
      user.email,
    )
    const refreshToken = await this.AuthService.issueRefreshToken(user.id)

    // 응답으로 accessToken 전달
    // return `login successful`
    this.logger.log(`로그인 성공 - userId: ${user.id}`)
    return { accessToken, refreshToken }
  }

  findAll() {
    return `This action returns all users`
  }

  // 사용자 조회
  async findById(userId: number): Promise<User> {
    this.logger.log(`사용자 조회 요청: ${JSON.stringify(userId)}`)
    const user = await this.UserRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    this.logger.log(`사용자 조회 성공 - userId: ${user.id}`)
    return user
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }

  // 비밀번호 암호화
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    this.logger.log(`비밀번호 암호화 완료`)

    return await bcrypt.hash(password, salt)
  }
}
