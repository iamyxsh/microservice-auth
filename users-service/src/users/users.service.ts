import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hashing } from '../utils/hashing';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { GetUserResponse } from './types';
import { KafkaService } from '../kafka/kafka.service';

interface CreatedUserResponse {
  id: number;
  email: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly kafka: KafkaService,
    private readonly hashing: Hashing,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreatedUserResponse> {
    let user = this.userRepo.create({
      ...createUserDto,
      password: await this.hashing.generateHash(createUserDto.password),
    });

    user = await this.userRepo.save(user);

    await this.kafka.produce({
      topic: 'USER_CREATED',
      messages: [
        {
          key: 'user',
          value: JSON.stringify({ email: user.email, password: user.password }),
          partition: 0,
        },
      ],
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  async findAll(): Promise<GetUserResponse[]> {
    const users = await this.userRepo.find();
    if (users.length > 0) {
      return users.map((res) => ({
        id: res.id,
        email: res.email,
        createdAt: res.created_at,
        updatedAt: res.updated_at,
        firstName: res.firstName,
        lastName: res.lastName,
      }));
    } else {
      return [];
    }
  }

  async findOne(id: number): Promise<GetUserResponse | null> {
    const user = await this.userRepo.findOneBy({ id });
    return {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
