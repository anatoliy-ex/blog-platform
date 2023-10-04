import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDbSchema, UserDocument } from '../shame/user.Schema';
import { Model } from 'mongoose';
import { CommentDocument, CommentOut } from '../shame/comment.Schema';

@Injectable()
export class AllDataRepositories {
  constructor(
    @InjectModel(UserDbSchema.name)
    private userModel: Model<UserDocument>,
    @InjectModel(CommentOut.name)
    private commentModel: Model<CommentDocument>,
  ) {}
  async deleteAllData() {
    await this.userModel.deleteMany({});
    await this.commentModel.deleteMany({});
    return [];
  }
}
