import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {getRepositoryToken} from "@nestjs/typeorm";


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

    const result = await usersService.create(createUserDto);

    console.log(result);

    expect(result).toEqual({
      id: expect.any(Number),
      email: createUserDto.email,
      password: createUserDto.password, // 암호화하지 않음
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });

    expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
    expect(userRepository.save).toHaveBeenCalledWith(expect.any(Object));
  });

});