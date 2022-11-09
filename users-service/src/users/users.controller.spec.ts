import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const dto: CreateUserDto = {
    firstName: 'Yash',
    lastName: 'Sharma',
    email: 'yash@sharma.com',
    password: 'password',
  };

  const mockUserService = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn(() =>
      Promise.resolve([
        {
          id: 1,
          email: 'yash@sharma.com',
          firstName: 'Yash',
          lastName: 'Sharma',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ),
    findOne: jest.fn(() =>
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
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const newUser = await controller.create(dto);
    expect(newUser.id).toBe(1);
    expect(mockUserService.create).toBeCalledWith(dto);
  });

  it('should return users', async () => {
    const users = await controller.findAll();
    expect(users[0].email).toBe('yash@sharma.com');
    expect(mockUserService.findAll).toBeCalled();
  });

  it('should return single user based on id', async () => {
    const user = await controller.findOne('1');
    expect(user.email).toBe('yash@sharma.com');
    expect(user.id).toBe(1);
    expect(mockUserService.findOne).toBeCalled();
  });
});
