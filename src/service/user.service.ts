import { UsersRepositories } from '../repositories/user.repositories';
import { Injectable } from '@nestjs/common';
import { PaginationQueryTypeForUsers } from '../pagination/user.pagination';
import { InputUserType } from '../types/user.confirm.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(protected usersRepositories: UsersRepositories) {}

  allUsers(paginationUsers: PaginationQueryTypeForUsers) {
    return this.usersRepositories.allUsers(paginationUsers);
  }

  createNewUser(user: InputUserType) {
    const passwordHash = bcrypt.hash(user.password, 10);

    const now = new Date();

    const newUser = {
      id: `${Date.now()}`,
      login: user.login,
      email: user.email,
      hash: passwordHash,
      createdAt: now.toISOString(),
    };

    return this.usersRepositories.createUser(newUser);
  }

  deleteUserById(userId: string) {
    return this.usersRepositories.deleteUserById(userId);
  }
}
