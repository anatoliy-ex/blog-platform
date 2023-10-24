import { Injectable } from '@nestjs/common';
import { CommentDocument, CommentOut } from '../schema/comment.Schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { LikeStatusesEnum } from '../types/post.types';
import {
  LikeStatusForCommentDbSchema,
  LikeStatusForCommentDocument,
} from '../schema/like.status.for.comment.Schema';

@Injectable()
export class CommentRepositories {
  constructor(
    @InjectModel(CommentOut.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(LikeStatusForCommentDbSchema.name)
    private likeModelForComment: Model<LikeStatusForCommentDocument>,
  ) {}

  async likeAndDislikeOperation(
    commentId: string,
    likeStatus: LikeStatusesEnum,
    userId: string,
  ) {
    await this.likeModelForComment.updateOne(
      { commentId, userId },
      { $set: { userStatus: likeStatus } },
      { upsert: true },
    );
    const likesCount = await this.likeModelForComment.countDocuments({
      commentId,
      userStatus: LikeStatusesEnum.Like,
    });
    const dislikesCount = await this.likeModelForComment.countDocuments({
      commentId,
      userStatus: LikeStatusesEnum.Dislike,
    });

    const result: mongo.UpdateResult = await this.commentModel.updateOne(
      { id: commentId },
      {
        $set: {
          'likesInfo.likesCount': likesCount,
          'likesInfo.dislikesCount': dislikesCount,
        },
      },
    );
    return result.matchedCount === 1;
  }

  async updateCommentById(
    commentId: string,
    content: string,
  ): Promise<boolean> {
    const result: mongo.UpdateResult = await this.commentModel.updateOne(
      { id: commentId },
      { content: content },
    );

    return result.matchedCount == 1;
  }

  async deleteCommentById(commentId: string) {
    const isDeleted: mongo.DeleteResult = await this.commentModel.deleteOne({
      id: commentId,
    });

    return isDeleted.deletedCount == 1;
  }

  async getUserById(commentId: string) {
    return this.commentModel.findById({ commentId });
  }
}
