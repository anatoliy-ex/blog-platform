import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../service/user.service';
import {
  getPaginationFromQueryUsers,
  PaginationQueryTypeForUsers,
} from '../pagination/user.pagination';
import { InputUserType } from '../types/user.confirm.types';

@Controller('users')
export class UserController {
  constructor(protected usersService: UsersService) {}

  @Get()
  async getAllUsers(@Query() query: PaginationQueryTypeForUsers) {
    const paginationUsers = getPaginationFromQueryUsers(query);
    return await this.usersService.allUsers(paginationUsers);
  }

  @Post()
  async createUser(@Body() inputModel: InputUserType) {
    return await this.usersService.createNewUser(inputModel);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteUserById(@Param('id') userId: string) {
    await this.usersService.deleteUserById(userId);
  }
}
