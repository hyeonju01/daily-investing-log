import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    // 테스트용 모듈 생성
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          UsersService,
        {
          provide: getRepositoryToken(User), // 가짜 리포지토리 주입
          useValue: {
            create: jest.fn().mockImplementation((dto) => ({
              id: Math.floor(Math.random() * 1000),
              email: dto.email,
              password: dto.password,
              created_at: new Date(),
              updated_at: new Date(),
            })),
            save: jest.fn().mockImplementation(async (user) => ({
              ...user,
              updated_at: new Date(),
            })),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    console.log('▶️ UsersService:', usersService);
    console.log('▶️ UserRepository:', userRepository);

  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('should create an instance of UsersService', () => {
    expect(usersService).toBeInstanceOf(UsersService);
  });

  // it('should create an instance of Repository User', () => {
  //   expect(userRepository).toBeInstanceOf(Repository<User>);
  // });

  it('should create a user', async () => {
    const createUserDto = { email: 'test@test.com', password: 'test' };

    // jest.spyOn(userRepository, 'save').mockResolvedValue({
    //   email: createUserDto.email,
    //   password: createUserDto.password,
    // } as User);

    jest.spyOn(userRepository, 'create');
    jest.spyOn(userRepository, 'save');
    jest.spyOn(bcrypt, 'genSalt').mockImplementation(async (rounds) => {
      console.log('▶️ bcrypt.genSalt() called with:', rounds);
      return `randomSalt${rounds}`;
    });
    jest.spyOn(bcrypt, 'hash').mockImplementation(async() => 'hashedPassword123');

    const result = await usersService.create(createUserDto);

    console.log(result);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(expect.any(Number));
    expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);

    expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 'randomSalt10');
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);

    // bcrypt.compare() 검증
    // const isPasswordCorrectly = await bcrypt.compare(createUserDto.password, result.password);
    // expect(isPasswordCorrectly).toBe(true);

    expect(result).toEqual({
      id: expect.any(Number),
      email: createUserDto.email,
      // password: createUserDto.password,
      // password: expect.any(String),
      password: 'hashedPassword123',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });

    // expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
    // expect(userRepository.save).toHaveBeenCalledWith(expect.any(Object));
  });

});