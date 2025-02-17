import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {Repository} from "typeorm";
import {CreateUserDto} from "../users/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private UserRepository: Repository<User>,
    ) {}

    // 회원가입
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { email, password } = createUserDto;
        if (!email || !password) {
            throw new BadRequestException("Email and password is required");
        }
        const newUser = this.UserRepository.create({email, password});
        const createdUser = await this.UserRepository.save(newUser);

        return createdUser;
    }
}