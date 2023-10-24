import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDbSchema, UserDocument } from '../schema/user.Schema';
import { Model } from 'mongoose';
import { CommentDocument, CommentOut } from '../schema/comment.Schema';
import { BlogDbSchema, BlogDocument } from '../schema/blog.Schema';
import { PostDbSchema, PostDocument } from '../schema/post.Schema';
import {
  LikeStatusForPostDbSchema,
  LikeStatusForPostDocument,
} from '../schema/like.status.for.post.Schema';
import {
  LikeStatusForCommentDbSchema,
  LikeStatusForCommentDocument,
} from '../schema/like.status.for.comment.Schema';

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
