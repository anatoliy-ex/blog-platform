import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDbSchema, UserDocument } from '../shame/user.Schema';
import { Model } from 'mongoose';
import { CommentDocument, CommentOut } from '../shame/comment.Schema';
import { BlogDbSchema, BlogDocument } from '../shame/blog.Schema';
import { PostDbSchema, PostDocument } from '../shame/post.Schema';
import {
  LikeStatusForPostDbSchema,
  LikeStatusForPostDocument,
} from '../shame/like.status.for.post.Schema';
import {
  LikeStatusForCommentDbSchema,
  LikeStatusForCommentDocument,
} from '../shame/like.status.for.comment.Schema';

@Injectable()
export class AllDataRepositories {
  constructor(
    @InjectModel(BlogDbSchema.name)
    private blogModel: Model<BlogDocument>,
    @InjectModel(PostDbSchema.name)
    private postModel: Model<PostDocument>,
    @InjectModel(LikeStatusForPostDbSchema.name)
    private likeModelForPost: Model<LikeStatusForPostDocument>,
    @InjectModel(UserDbSchema.name)
    private userModel: Model<UserDocument>,
    @InjectModel(CommentOut.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(LikeStatusForCommentDbSchema.name)
    private likeModelForComment: Model<LikeStatusForCommentDocument>,
  ) {}
  async deleteAllData() {
    await this.userModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.likeModelForComment.deleteMany({});
    await this.likeModelForPost.deleteMany({});
    return [];
  }
}
