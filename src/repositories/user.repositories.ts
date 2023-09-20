import { Injectable } from '@nestjs/common';
import { PaginationQueryTypeForUsers } from '../pagination/user.pagination';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDbSchema, UserDocument } from '../shame/user.Schema';

@Injectable()
export class UsersRepositories {
  constructor(
    @InjectModel(UserDbSchema.name)
    private userModel: Model<UserDocument>,
  ) {}
  allUsers(paginationUsers: PaginationQueryTypeForUsers) {
    const filter = {
      $or: [
        { login: { $regex: paginationUsers.searchLoginTerm, $options: 'i' } },
        { email: { $regex: paginationUsers.searchEmailTerm, $options: 'i' } },
      ],
    };

    const users = this.userModel
      .find(filter)
      .select('-_id _hash')
      .sort({ [paginationUsers.sortBy]: paginationUsers.sortDirection })
      .skip((paginationUsers.pageNumber - 1) * paginationUsers.pageSize)
      .limit(paginationUsers.pageSize)
      .lean();

    const countOfUsers: any = this.userModel.countDocuments(filter);
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

  createUser(newUser: any) {
    //: Promise<UserViewType>
    this.userModel.insertMany([newUser]);

    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }

  deleteUserById(id: string) {
    const isDeleted = this.userModel.deleteOne({ id: id });
    return !!isDeleted;
  }
}
