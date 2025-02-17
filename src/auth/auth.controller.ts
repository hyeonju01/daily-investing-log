import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";

@Controller('/api/auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    // 회원 가입 URL 핸들러
    @Post('users/join')
    async createUser(@Body() createUserDto: CreateUserDto) : Promise<{message: string}> {
        // 비밀번호 암호화 추가
        await this.authService.createUser(createUserDto);
        console.log(createUserDto);
        return {message:"success"};
    }
}