import { Injectable } from '@nestjs/common';
import { PaginationQueryTypeForUsers } from '../pagination/user.pagination';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { UserDbSchema, UserDocument } from '../shame/user.Schema';

@Injectable()
export class UsersRepositories {
  constructor(
    @InjectModel(UserDbSchema.name)
    private userModel: Model<UserDocument>,
  ) {}
  async allUsers(paginationUsers: PaginationQueryTypeForUsers) {
    const filter = {
      $or: [
        { login: { $regex: paginationUsers.searchLoginTerm, $options: 'i' } },
        { email: { $regex: paginationUsers.searchEmailTerm, $options: 'i' } },
      ],
    };

    const users = await this.userModel
      .find(filter, { __v: 0, _id: 0, hash: 0 })
      .sort({ [paginationUsers.sortBy]: paginationUsers.sortDirection })
      .skip((paginationUsers.pageNumber - 1) * paginationUsers.pageSize)
      .limit(paginationUsers.pageSize);

    console.log(users);

    const countOfUsers: any = await this.userModel.countDocuments(filter);
    const pagesCount = Math.ceil(countOfUsers / paginationUsers.pageSize);
    console.log(countOfUsers);

    return {
      page: paginationUsers.pageNumber,
      pagesCount: pagesCount === 0 ? 1 : pagesCount,
      pageSize: paginationUsers.pageSize,
      totalCount: countOfUsers,
      items: users,
    };
  }

  async createUser(newUser: any) {
    //: Promise<UserViewType>
    await this.userModel.insertMany([newUser]);

    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const result: mongo.DeleteResult = await this.userModel.deleteOne({
      id: userId,
    });
    return result.deletedCount === 1;
  }
}
