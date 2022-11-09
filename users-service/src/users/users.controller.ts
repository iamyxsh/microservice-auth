import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

import { CreatedUserResponse, GetUserResponse } from './types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<CreatedUserResponse> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<GetUserResponse[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<GetUserResponse | null> {
    return this.usersService.findOne(+id);
  }
}
