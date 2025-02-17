import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}

  // 회원가입
  async create(createUserDto: CreateUserDto): Promise<User> {

    const { email, password } = createUserDto;
    if (!email || !password) {
      throw new BadRequestException("Email and password is required");
    }
    const newUser = this.UserRepository.create({email, password});
    const createdUser = await this.UserRepository.save(newUser);

    return createdUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
