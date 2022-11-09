import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KafkaService } from '../kafka/kafka.service';
import { Hashing } from '../utils';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const dto: CreateUserDto = {
    firstName: 'Yash',
    lastName: 'Sharma',
    email: 'yash@sharma.com',
    password: 'password',
  };

  const mockUserRepo = {
    create: jest.fn((dto) => dto),
    save: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
    find: jest.fn(() =>
      Promise.resolve([
        {
          id: 1,
          email: 'yash@sharma.com',
          firstName: 'Yash',
          lastName: 'Sharma',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]),
    ),
    findOneBy: jest.fn(() =>
      Promise.resolve({
        id: 1,
        email: 'yash@sharma.com',
        firstName: 'Yash',
        lastName: 'Sharma',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        KafkaService,
        Hashing,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const newUser = await service.create(dto);

    expect(newUser.id).toBe(1);
    expect(mockUserRepo.save).toBeCalled();
  });

  it('should return users', async () => {
    const users = await service.findAll();

    expect(users[0].email).toBe('yash@sharma.com');
    expect(mockUserRepo.find).toBeCalled();
  });

  it('should return single user based on id', async () => {
    const user = await service.findOne(1);
    expect(user.email).toBe('yash@sharma.com');
    expect(user.id).toBe(1);
    expect(mockUserRepo.findOneBy).toBeCalled();
  });
});
