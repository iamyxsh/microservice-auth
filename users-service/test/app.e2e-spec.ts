import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreatedUserResponse, GetUserResponse } from 'src/users/types';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { UsersModule } from '../src/users/users.module';
import { createConnection } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5430,
          username: 'root',
          password: 'password',
          database: 'postgres',
          entities: [User],
          synchronize: true,
          keepConnectionAlive: true,
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5430,
      username: 'root',
      password: 'password',
      database: 'postgres',
      name: 'test',
    });

    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.dropTable('user');
    await queryRunner.release();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/users (POST)', () => {
    const dto: CreateUserDto = {
      firstName: 'Yash',
      lastName: 'Sharma',
      email: 'yash@sharma.com',
      password: 'password',
    };
    const res: CreatedUserResponse = {
      id: expect.any(Number),
      email: 'yash@sharma.com',
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(dto)
      .expect(201)
      .expect((response) => res === response.body);
  });

  it('/users (GET)', () => {
    const res: GetUserResponse[] = [
      {
        id: expect.any(Number),
        email: 'yash@sharma.com',
        firstName: 'Yash',
        lastName: 'Sharma',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ];

    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((response) => res === response.body);
  });

  it('/users/:id (GET)', () => {
    const res: GetUserResponse = {
      id: expect.any(Number),
      email: 'yash@sharma.com',
      firstName: 'Yash',
      lastName: 'Sharma',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    return request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .expect((response) => res === response.body);
  });
});
