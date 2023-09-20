import { Injectable } from '@nestjs/common';
import { CommentDocument, CommentOut } from '../shame/comment.Schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommentRepositories {
  constructor(
    @InjectModel(CommentOut.name)
    private commentModel: Model<CommentDocument>,
  ) {}

  getUserById(commentId: string) {
    return this.commentModel.findById({ commentId });
  }
}
