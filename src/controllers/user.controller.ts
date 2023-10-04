import {
  Body,
  Controller,
  Delete,
  Get,
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
  getAllUsers(@Query() query: PaginationQueryTypeForUsers) {
    const paginationUsers = getPaginationFromQueryUsers(query);
    return this.usersService.allUsers(paginationUsers);
  }

  @Post()
  createUser(@Body() inputModel: InputUserType) {
    return this.usersService.createNewUser(inputModel);
  }

  @Delete(':id')
  deleteUserById(@Param('id') userId: string) {
    console.log(userId);
    return this.usersService.deleteUserById(userId);
  }
}
